const express = require("express") // <-- Libreria express (Basicamente decimos QUIERO CREAR UNA API)
const cors = require("cors") // <-- Esto es importante ya que permite a mi frontend que vive en otro domino (ej: localhost:5173) pueda hablar el backend con los fetch
require("dotenv").config() // <-- esto carga mi archivo .env basicamente lee mis variables secretas
const pool = require("./db/pool") // <-- Aqui nos estamos trayendo el puente que nos conecta a la BD/supabase
const authRoutes = require("./routes/auth.routes")
const usersRoutes = require("./routes/users.routes") // <-- Rutas para gestionar usuarios
const path = require("path");
const { supabase, BUCKET } = require("./lib/supabaseClient")

const { fileToDataUri } = require("./utils/fileToDataUri")
const { renderCertificate } = require("./utils/renderTemplate")
const { htmlToPdfBuffer } = require("./utils/pdf")
const { uploadPdfBuffer, createSignedPdfUrl } = require("./utils/storagePdf")

// Incrustar logo en el pdf que se va a generar

// rutas absolutas
const mppeLogoPath = path.join(__dirname, "assets", "logo-mppe.png");
const mjmLogoPath  = path.join(__dirname, "assets", "logo-colegio-mjm.png");

// convertir a Data URI
const mppeLogo = fileToDataUri(mppeLogoPath);
const mjmLogo  = fileToDataUri(mjmLogoPath);

const app = express() // <-- Aqui creamos el servidor app es mi API

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});


app.use(express.json()) // <-- Le dice al servidor cuando llegue una peticion/request en formato JSON interpretalo
app.use(cors({ origin: process.env.CORS_ORIGIN })) // <-- Aqui indicamos que solo va a recibir peticiones/request del dominio que este en CORS_ORIGIN en el archivo .env

app.get("/status", (req, res) => { // <-- Aqui creamos nuestra primera ruta, si alguien accede a http://localhost:3001/status el servidor responde con lo que este dentro
    res.json({ok: true, message: "API running 🚀"}) // <-- Aqui basicamente estamos enviando un JSON para comprobar si el servidor esta funcionando usando res
})

app.get("/db-test", async (req, res) => { // <-- Creamos la ruta para probar la conectividad con la bd/supabase
    try{
        const result = await pool.query("SELECT NOW() as now") // <-- Aqui basicamente le estamos hablando con la BD/supabase, y especificamente le estamos diciendo hey dame la hora actual
        res.json({ok: true, dbTime: result.rows[0].now}) // <-- Esto es como queremos que nos muestre la respuesta de la bd/supabase en el navegador en forma de JSON
    } catch (error) { // <-- Manejamos errores en caso de que algo no funcione bien
        console.error("DB TEST ERROR:", error)
        res.status(500).json({  
            ok: false,
            message: "DB connection failed",
            error: error.message,
          });
    }
})

app.use("/auth", authRoutes)
app.use("/users", usersRoutes) // <-- Registramos las rutas de usuarios en /users

// NOTA:
// req de (REQUEST): Es el objeto enviado por el cliente (navedor, APP) al servidor, el cual contiene informacion como la URL, el metodo de la peticion o request (GET, POST, PUT, DELETE)

// res de (RESPONSE): Es el el objeto que usa el servidor para enviarle una respuesta a el cliente, con los datos solicitados en formato (TXT, JSON, HTML) ademas de el codigo del estado de la peticion/request (200: OK, 404: NOT FOUND)

// Ademas el orden en la funcion Async importa ya que 

const PORT = process.env.PORT || 3001 // <-- Esto significa usa el puerto que este en PORT dentro de .env, si no existe usa el puerto 3001
app.listen(PORT, () => { // <-- Esto es importante ya que aqui basicamente encedemos el servidor, y le decimos que se ponga escuchar peticiones/request
    console.log("Backend encendido http://localhost:" + PORT) // <-- Un mensaje de funcionamiento en la consola para comprobar el funcionamiento
})


// Ruta de prueba con mi renderTemplate
app.get("/certificate-test", async(req, res) => {
    try {
        const html = renderCertificate({
            type: "buena-conducta",
            data: {
                logo_mppe: mppeLogo,
                logo_mjm: mjmLogo,
                doc_heading: "BUENA CONDUCTA",
                student_name: "Juan Perez",
                document_type: "Cédula de Identidad",
                student_ci: "30622675",
                grade: "1ER GRADO",
                academic_level: "EDUCACION PRIMARIA",
                school_year: "2025-2026",
            }
        })

        const pdf = await htmlToPdfBuffer(html)

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", "inline; filename=constancia.pdf")
        return res.send(pdf)

    } catch (err) {
        console.error("CERTIFICATE TEST ERROR:", err)
        return res.status(500),json({ok: false, error: err.message})
    }
})

// Funcion para mapear el tipo de constancia (template)
function mapRecordTypeToTemplate(record_type) {
  // tus archivos en templates/types: estudio.html, retiro.html, solvencia.html, buena-conducta.html
  const map = {
    "ESTUDIO": "estudio",
    "RETIRO": "retiro",
    "SOLVENCIA ADMINISTRATIVA": "solvencia",
    "BUENA CONDUCTA": "buena-conducta",
  };
  return map[record_type];
}

// Funciones para convertir ci y ce en (Cedula de identidad o Cedula escolar) para el PDF
function normalizeDocType(input) {
  const v = String(input || "").trim().toLowerCase();
  if (v === "ci" || v === "ce") 
  return v;
  return null;
}

function docTypeLabel(docType) {
  const map = {
    ci: "Cédula de Identidad",
    ce: "Cédula Escolar",
  };
  return map[docType] || docType;
}

// Listar todas las constancias (para la tabla de viewRequest)
app.get("/records", async (req, res) => {
  try {
    const result = await pool.query(
      `select id, record_type, student_full_name, student_number_document, student_academic_level,
              student_academic_degrees, student_academic_year, pay_date, pay_reference, pay_amount,
              status, pdf_path, extra_data, created_at
       from records
       order by id desc`
    );
    return res.json({ ok: true, records: result.rows });
  } catch (err) {
    console.error("GET /records ERROR:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Obtener URL firmada para descargar un PDF (por id de registro)
app.get("/records/:id/pdf-url", async (req, res) => {
  try {
    const { id } = req.params;
    const r = await pool.query("select pdf_path from records where id = $1", [id]);
    if (!r.rows.length) return res.status(404).json({ ok: false, error: "Registro no encontrado" });
    const pdfPath = r.rows[0].pdf_path;
    if (!pdfPath) return res.status(404).json({ ok: false, error: "PDF no generado aún" });
    const signedUrl = await createSignedPdfUrl(pdfPath, 600);
    return res.json({ ok: true, url: signedUrl });
  } catch (err) {
    console.error("GET /records/:id/pdf-url ERROR:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Ruta para eliminar una constancia
app.delete("/records/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el registro existe y obtener el pdf_path
    const recordResult = await pool.query("SELECT pdf_path FROM records WHERE id = $1", [id]);
    
    if (!recordResult.rows.length) {
      return res.status(404).json({ ok: false, error: "Registro no encontrado" });
    }

    const pdfPath = recordResult.rows[0].pdf_path;

    // Eliminar el registro de la BD
    await pool.query("DELETE FROM records WHERE id = $1", [id]);

    // Si existe un PDF, eliminarlo del storage
    if (pdfPath) {
      try {
        const { error } = await supabase.storage.from(BUCKET).remove([pdfPath]);
        if (error) {
          console.warn("Error al eliminar PDF del storage:", error);
          // No fallamos la petición si el PDF no se puede eliminar
        }
      } catch (storageError) {
        console.warn("Error al eliminar PDF del storage:", storageError);
        // Continuamos aunque falle la eliminación del PDF
      }
    }

    return res.json({ ok: true, message: "Registro eliminado correctamente" });
  } catch (err) {
    console.error("DELETE /records/:id ERROR:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Ruta para crear nueva constancia
app.post("/records", async (req, res) => {
  try {
    const {
      record_type,
      student_full_name,
      student_document_type,
      student_number_document,
      student_academic_level,
      student_academic_degrees,
      student_academic_year,
      pay_date,
      pay_reference,
      pay_amount,
      extra_data,
    } = req.body;

    // Validación mínima
    if (
      !record_type ||
      !student_full_name ||
      !student_document_type ||
      !student_number_document ||
      !student_academic_level ||
      !student_academic_degrees ||
      !student_academic_year ||
      !pay_date ||
      !pay_reference ||
      pay_amount === undefined || pay_amount === null
    ) {
      return res.status(400).json({ ok: false, error: "Faltan campos requeridos." });
    }

    const templateName = mapRecordTypeToTemplate(record_type);
    if (!templateName) {
      return res.status(400).json({ ok: false, error: "record_type inválido." });
    }

    // Insert en la BD (pdf_path vacío por ahora)
    const insertQuery = `
      insert into records (
        record_type,
        student_full_name,
        student_document_type,
        student_number_document,
        student_academic_level,
        student_academic_degrees,
        student_academic_year,
        pay_date,
        pay_reference,
        pay_amount,
        extra_data,
        status
      )
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'PENDING')
      returning *
    `;

    const values = [
      record_type,
      student_full_name,
      student_document_type,
      student_number_document,
      student_academic_level,
      student_academic_degrees,
      student_academic_year,
      pay_date,
      pay_reference,
      pay_amount,
      extra_data || {},
    ];

    const inserted = await pool.query(insertQuery, values);
    const record = inserted.rows[0];

    // Preparar logos (Data URI) desde server/src/assets
    const mppeAbs = path.join(__dirname, "assets", "logo-mppe.png");
    const mjmAbs = path.join(__dirname, "assets", "logo-colegio-mjm.png");

    const logo_mppe = fileToDataUri(mppeAbs, "image/png");
    const logo_mjm = fileToDataUri(mjmAbs, "image/png");

    function getSpanishMonthName(monthIndex) {
      const months = [
        "enero","febrero","marzo","abril","mayo","junio",
        "julio","agosto","septiembre","octubre","noviembre","diciembre"
      ];
      return months[monthIndex];
    }
    
    function splitIssueDate(isoDate) {
      // isoDate: "YYYY-MM-DD"
      const [y, m, d] = isoDate.split("-");
    
      const day = String(parseInt(d, 10));      // "04" -> "4"
      const month = getSpanishMonthName(parseInt(m, 10) - 1); // "02" -> febrero
      const year = y;
    
      return { day, month, year };
    }
    
    // Convertir el nombre de el estudiante todo a mayusculas
    const normalizedStudentName = String(student_full_name).trim().toUpperCase();
    // Convertir ci o ce en (Cedula de identidad o Cedula escolar)
    const normalizedDocType = normalizeDocType(student_document_type);
    if (!normalizedDocType) {
      return res.status(400).json({
        ok: false,
        error: 'student_document_type inválido. Usa "ci" o "ce".',
      });
    }

    const { day, month, year } = splitIssueDate(pay_date);
    // Construir data para templates (placeholders)
    const templateData = {
      logo_mppe,
      logo_mjm,

      doc_heading: record_type,
      student_name: normalizedStudentName,
      student_ci: student_number_document,
      document_type: docTypeLabel(normalizedDocType),

      academic_level: student_academic_level,
      grade: student_academic_degrees,
      school_year: student_academic_year,

      day,
      month,
      year,

      // extras por tipo (si tu template los usa)
      ...(extra_data || {}),
    };

    // Render HTML final
    const html = renderCertificate({
      type: templateName,
      data: templateData,
    });

    // HTML → PDF
    const pdfBuffer = await htmlToPdfBuffer(html);

    // Subir PDF a Storage
    const pdfPath = `records/${record.id}.pdf`;
    await uploadPdfBuffer({ buffer: pdfBuffer, path: pdfPath });

    // Guardar pdf_path en BD
    const updateQuery = `update records set pdf_path = $1 where id = $2 returning *`;
    const updated = await pool.query(updateQuery, [pdfPath, record.id]);
    const finalRecord = updated.rows[0];

    // URL firmada para descargar
    const signedUrl = await createSignedPdfUrl(pdfPath, 600);

    return res.json({
      ok: true,
      record: finalRecord,
      pdf_url: signedUrl,
    });
  } catch (err) {
    console.error("POST /records ERROR:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

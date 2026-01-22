const express = require("express") // <-- Libreria express (Basicamente decimos QUIERO CREAR UNA API)
const cors = require("cors") // <-- Esto es importante ya que permite a mi frontend que vive en otro domino (ej: localhost:5173) pueda hablar el backend con los fetch
require("dotenv").config() // <-- esto carga mi archivo .env basicamente lee mis variables secretas
const pool = require("./db/pool") // <-- Aqui nos estamos trayendo el puente que nos conecta a la BD/supabase
const authRoutes = require("./routes/auth.routes")
const usersRoutes = require("./routes/users.routes") // <-- Rutas para gestionar usuarios

const app = express() // <-- Aqui creamos el servidor app es mi API

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
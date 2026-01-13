// Imports de todas las cosas necesarias
const router = require("express").Router() 
const pool = require("../db/pool") // <-- Puente a la BD/Supabase
const bcrypt = require("bcrypt") // <-- Permite comprar las claves para validar
const jwt = require("jsonwebtoken") // <-- Genera un Token (JWT) que prueba que el usuario ya inicio sesion

// Creamos la ruta para el proceso de Login
router.post("/login" , async (req, res) => { 
    try{
        const {username, password} = req.body // <-- Toma el JSON que mandara el fronted donde vendran las credenciales que ingreso el usuario

        // NOTA: el operador ! (NOT / NEGACION) tiene como funcion primero convertir un valor en un booleano (TRUE / FALSE), y segundo invierte el boleano a su valor contrario. 
        
        // Las Variables de texto como username o password se consideran (FALSY) cuando son: undefined, null o ('') vacias, por lo tanto estas devuelven un (false) que luego el operador ! convierte en (true), con este esquema podemos con una condicional detener el proceso de login y mandar un mensaje de lo que esta pasando.

        // Validacion basica
        if(!username || !password) {
            return res.status(400).json({message: "Faltan credenciales"}) // <-- Respondemos con status 400 y un mensaje de que faltan credenciales
        }

        // Buscar usuarios en la BD
        const result = await pool.query(
            "SELECT id, username, password_hash, role, is_active FROM users WHERE username = $1 LIMIT 1",
            [username]
        )

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Credenciales inválidas" });
          }
      
        const user = result.rows[0];
        
        // Verificar usuario activo
        if(!user.is_active) {
            return res.status(403).json({ message: "Usuario desactivado" });
        }

        // Comparar clave con el hash
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Crear Token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "3d" } // <-- Aqui se cambia la duracion de expiracion del token del ususario
          );

        // Responder
        return res.json({
            user: { id: user.id, username: user.username, role: user.role },
            token,
          });
    } catch(error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({ message: "Error interno", error: error.message });
    }
})

module.exports = router

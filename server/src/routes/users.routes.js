// Imports de todas las cosas necesarias
const router = require("express").Router() // <-- Router de Express para crear las rutas
const pool = require("../db/pool") // <-- Puente a la BD/Supabase

// Creamos la ruta GET para obtener todos los usuarios
router.get("/", async (req, res) => {
    try {
        // Consulta SQL para obtener todos los usuarios de la tabla users
        // IMPORTANTE: No incluimos password_hash por seguridad, solo datos públicos
        const result = await pool.query(
            "SELECT id, username, role, is_active, create_at FROM users ORDER BY create_at DESC"
        )

        // Si la consulta fue exitosa, respondemos con los datos
        res.json({
            ok: true,
            users: result.rows, // <-- result.rows contiene un array con todos los usuarios
            count: result.rows.length // <-- Cantidad de usuarios encontrados
        })
    } catch (error) {
        // Si algo sale mal, capturamos el error y respondemos con un mensaje
        console.error("ERROR AL OBTENER USUARIOS:", error)
        res.status(500).json({
            ok: false,
            message: "Error al obtener usuarios",
            error: error.message
        })
    }
})

module.exports = router // <-- Exportamos el router para usarlo en index.js


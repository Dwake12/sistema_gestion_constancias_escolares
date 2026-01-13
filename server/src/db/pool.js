// Este es el archivo puente entre el backend o servidor a la Base de datos o supabase
const { Pool } = require("pg") // <-- El pool es basimanete el administrador de las llamadas a la Base de Datos
require("dotenv").config() // <-- Aqui lo que hacemos es cargar el archivo .env y mete los valores en process.env, permitiendo que exista process.env.DATABASE_URL

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // <-- Aui directamente indicamos que se conecte a la base de datos PostgreSQL usando la URL que me dio Supabase
    ssl: {rejectUnauthorized: false} // <-- Esto es importnate ya que supabase no permite conexiones sin sifrado y para eso usa ssl
})

module.exports = pool // <-- Esto hace que cualquier archivo de tu backend pueda hablar con la BD/supabase llamandola, (Como exportar un componenten)
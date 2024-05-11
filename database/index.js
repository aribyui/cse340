// Database Connection (conexión a la base de datos)

// Importa la clase Pool del módulo 'pg'
const { Pool } = require("pg")

// Carga las variables de entorno desde el archivo .env
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */

// Declara una variable llamada 'pool'
let pool;
// Verifica si el entorno de ejecución es 'development' (desarrollo)
if (process.env.NODE_ENV == "development") {
  // Si el entorno es desarrollo, crea una nueva instancia de Pool con la configuración específica
  pool = new Pool({
    // Utiliza la cadena de conexión de la variable de entorno DATABASE_URL
    connectionString: process.env.DATABASE_URL,
    // Configura SSL para permitir certificados no autorizados (no válido o no verificable)
    ssl: {
      rejectUnauthorized: false,
    },
  })

  // Added for troubleshooting queries
  // during development

  // Si el entorno es 'development' (desarrollo), exporta un objeto con un método asincrónico llamado 'query'
  module.exports = {
    async query(text, params) {
      try {
        // Ejecuta la consulta en la base de datos utilizando la instancia 'pool' configurada anteriormente
        const res = await pool.query(text, params)
        // Imprime un mensaje de registro indicando que la consulta se ha ejecutado
        console.log("executed query", { text })
        // Devuelve los resultados de la consulta
        return res
      } catch (error) {
        // En caso de error, imprime un mensaje de registro indicando que hubo un error en la consulta
        console.error("error in query", { text })
        // Propaga el error para manejarlo en otra parte del código
        throw error
      }
    },
  }
} else {
  pool = new Pool({
    // Si el entorno es producción, crea una nueva instancia de 'Pool' con la cadena de conexión apropiada
    connectionString: process.env.DATABASE_URL,
  })
  // Exporta la instancia 'pool' para que pueda ser utilizada en otros módulos
  module.exports = pool
}
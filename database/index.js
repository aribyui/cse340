const { Pool } = require("pg");
require("dotenv").config();
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 *
 * 📌 SSL:
 * Una conexión SSL (Secure Sockets Layer) es un protocolo 
 * que establece una conexión cifrada y segura entre un 
 * navegador web y un servidor web. Esto significa que la 
 * información transmitida entre ambos sistemas está 
 * protegida y no puede ser interceptada ni leída por 
 * terceros.
 * 
 * Fuente: Gemini IA
 * *************** */
let pool;
if (process.env.NODE_ENV) { // 1️⃣ Development Environment
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Added for troubleshooting queries
  // during development
  module.exports = {
      async query(text, params) {
        try {
          const res = await pool.query(text, params);
          console.log("executed query", { text });
        return res;
      } catch (error) {
        console.log("error in query", { text });
        throw error;
      }
    },
  };
} else {
  pool = new Pool({ // 2️⃣ Production Environment
    connectionString: process.env.DATABASE_URL,
  });
  module.exports = pool;
}

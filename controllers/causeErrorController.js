const throwError = async (req, res) => {
  // 📌 ¿Qué hace?
  // ✅  throw → Lanza una excepción.
  // ✅  new Error(...) → Crea una instancia de la clase Error con un mensaje personalizado.
  // ✅  Al ser lanzado con throw, Express lo detecta y lo pasa automáticamente al middleware
  // de manejo de errores, si existe (como tu app.use(async (err, req, res, next) => { ... })).
  throw new Error("This is a simulated server error for testing purposes.");
};

module.exports = { throwError };

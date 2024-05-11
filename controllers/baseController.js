
/*   
  📌 El archivo 'baseController' o 'controlador base' será responsable 
  solo de las solicitudes a la aplicación en general, 
  y no a áreas específicas (como inventario o cuentas)
*/

// Importa un archivo index.js desde una carpeta utilities.
const utilities = require("../utilities/") // or ("../utilities/index.js")
/* 
  The 'baseController' will be responsible only for requests 
  to the application in general, and not to specific areas 
  (such as inventory or accounts).
*/
const baseController = {}

/*
  Crea una función anónima, asincrónica y asigna la función a buildHome, 
  que actúa como un método del objeto baseController. En resumen, 
  esto es similar en concepto a crear un método dentro de una clase, 
  donde baseController sería el nombre de la clase y buildHome sería el método. 
  Siendo asincrónico, no bloquea (detiene) la ejecución de la aplicación 
  mientras espera que se devuelvan los resultados de la función. 
  La función en sí acepta los objetos de solicitud y respuesta como parámetros.
*/
baseController.buildHome = async function(req, res) {
  /* 
    Llama a una función getNav() que se encontrará en el archivo utilities > index.js. 
    Los resultados, cuando se devuelven (observa la palabra clave "await"), 
    se almacenarán en la variable nav.
  */
  const nav = await utilities.getNav()
  /*
    Es el comando de Express para usar EJS para enviar la vista de índice de vuelta 
    al cliente, utilizando el objeto de respuesta. La vista de índice necesitará 
    el par de nombre-valor "title", y la variable nav. 
    La variable nav contendrá la cadena de código HTML para renderizar esta barra 
    de navegación generada dinámicamente.
  */
  res.render("index", {title: "Home", nav})
}

// Exporta el objeto baseController para su uso en otros lugares.
module.exports = baseController
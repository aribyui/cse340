/*
  💡 Con el grupo de conexiones de la base de datos creado, ahora podemos 
  usarlo para comenzar a interactuar con la base de datos. 
  Hay que recordar que en un enfoque MVC, el "Modelo" es donde se almacenan 
  todas las interacciones de datos. 
  📌 El archivo 'inventory-module.js' es donde escribiremos 
  todas las funciones para interactuar con las tablas de clasificación 
  e inventario de la base de datos, ya que son parte integral de 
  nuestro inventario.
*/

const pool = require("../database/") // or ("../database/index.js")

/* ***************************
 *  Get all classification data
 * ************************** */
/* 
  Se crea una función 'asincrónica', llamada 'getClassifications()'. 
  Una función asincrónica devuelve una promesa, sin bloquear (detener) la ejecución del código. 
  Permite que la aplicación continúe y luego manejará los resultados de la promesa cuando se entreguen. 

  Promise:
  Una Promise (promesa en castellano) es un objeto que representa la terminación 
  o el fracaso de una operación asíncrona.
*/
async function getClassifications() {
  /*
    Devolverá (enviará de vuelta) el resultado de la consulta SQL, 
    que será enviado al servidor de la base de datos utilizando una conexión de agrupamiento
    (pool connection), cuando el conjunto de resultados (data) o un error, sean enviados de 
    vuelta por  el servidor de la base de datos. Observa las dos palabras clave: return y await. 
    Await es parte de la estructura de promesa Async-Await introducida en ES6. 
    Return es una palabra clave de Express, indicando que los datos deben ser enviados a 
    la ubicación del código que llamó a la función originalmente.
  */
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name") 
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
/* 
  Declara una función asincrónica por nombre y pasa una variable, que debería contener el 
  valor classification_id, como parámetro.
*/
async function getInventoryByClassificationId(classification_id) {
  // Abre un bloque try-catch.
  try {
    /*
      Crea una consulta SQL para leer la información del inventario y la clasificación de sus respectivas 
      tablas utilizando un INNER JOIN. La consulta está escrita utilizando una declaración preparada 
      (prepared statement). 
      El "$1" es un marcador de posición, que será reemplazado por el valor mostrado entre corchetes "[]" 
      cuando se ejecute la instrucción SQL. La SQL se consulta contra la base de datos a través del pool de 
      bases de datos. Observa la palabra clave await, lo que significa que esta consulta esperará a que se 
      devuelva la información, donde se almacenará en la variable data.
    */
    const data = await pool.query(
      /*
        Consulta SQL que selecciona todos los campos de la tabla "inventory" (abreviada como "i") 
        y todos los campos de la tabla "classification" (abreviada como "c").
        Utiliza una cláusula JOIN para combinar los registros de ambas tablas donde el 
        "classification_id" en la tabla "inventory" sea igual al "classification_id" en la tabla "classification".
        También utiliza una cláusula WHERE para filtrar los resultados, seleccionando solo aquellos registros
        donde el "classification_id" en la tabla "inventory" sea igual al valor proporcionado en la variable "classification_id".
      */
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`, 
      // Parámetro de consulta para la variable "classification_id".
      [classification_id]
    )
    /* 
      Envía los datos, como un array de todas las filas, de vuelta al lugar donde se llamó 
      la función (en el controlador).
    */
    return data.rows
    /*
      Finaliza el try y abre el catch, con una variable de error que se suministra para almacenar 
      cualquier error que pueda ocurrir.
    */
  } catch (error) {
    /*
      Escribe el error, si lo hay, en la consola para que podamos leerlo. Tendremos que lidiar 
      con un mejor manejador de errores en el futuro.
    */
    console.error("getclassificationsbyid error " + error)
  }
}

/*
  📌 ¡Muy importante! Esta función ahora debe incluirse en las exportaciones en la parte inferior del archivo. 
  De lo contrario, no será utilizable por el controlador.
*/

module.exports = { getClassifications, getInventoryByClassificationId }
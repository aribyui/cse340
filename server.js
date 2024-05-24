/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")
// Requiere el middleware de manejo de sesiones para Express
const session = require("express-session")
// Requiere el módulo de conexión a la base de datos, configurado para interactuar con la base de datos (por ejemplo, PostgreSQL)
const pool = require("./database/")
const bodyParser = require("body-parser")

/* ***********************
 * Middleware
 * ************************/

// configuración de "express-sesion"

// 1️⃣ invoca la función "app.use()" e indica que se aplicará la sesión.
app.use(session({
  /* 
  "store" se refiere en dónde se almacenarán los datos de la sesión. 
  En este código, estamos creando una nueva tabla de sesión en nuestra 
  base de datos PostgreSQL usando el paquete "connect-pg-simple", 
  que se requiere en este momento. 
  */
  store: new (require('connect-pg-simple')(session))
  /* 
    aquí se indica que se está enviando un nuevo objeto a la conexión
    con información de configuración
  */
  ({
    /*
      le dice a la "session" que cree una tabla de 'session' en la
      base de datos si aún no existe.
    */
    createTableIfMissing: true,
    /*
      utiliza nuestro grupo de conexiones de base de datos para interactuar 
      con el servidor de la base de datos
    */
    pool,
  }), // cierra el objeto de datos de configuración
  /*
    indica un par nombre-valor "secreto" que se utilizará para proteger la sesión. 
  */
  secret: process.env.SESSION_SECRET,
  /*
    esta sesión para la sesión en la base de datos suele ser "falsa". Pero, debido 
    a que utilizamos mensajes "flash", necesitamos volver a guardar la tabla de 
    sesiones después de cada mensaje, por lo que debe establecerse en "verdadero"
  */
  resave: true,
  /*
    esta configuración es importante para el proceso de creación cuando se crea la 
    sesión por primera vez.
  */
  saveUninitialized: true,
  /*
    este es el "nombre" que asignamos al "id" único que se creará para cada sesión.
  */
  name: 'sessionId',
}))

// Express Messages Middleware
/*
  requiere el paquete "connect-flash" dentro de la función "app.use", haciéndolo
  accesible en toda la aplicación
*/
app.use(require('connect-flash')())
/*
  se aplica y se pasa una función como parámetro. La función acepta la solicitud (req), 
  la respuesta (res) y los siguientes objetos como parámetros.app.use
*/
app.use(function(req, res, next) {
  /*
    El paquete "express-messages" se requiere como una función. La función acepta los objetos 
    request y response como parámetros. La funcionalidad de esta función se asigna al objeto 
    response, utilizando la opción "locals" y un nombre de "messages". Esto permite que 
    cualquier mensaje se almacene en el objeto response, haciéndolo disponible en una vista.

    📌 res.locals es un objeto que contiene variables locales dentro de la respuesta de Express, 
    accesibles en las plantillas renderizadas. Cuando se agrega messages a res.locals, estamos 
    haciendo que los mensajes flash (mensajes temporales) estén disponibles en todas las 
    vistas renderizadas.
  */
  res.locals.messages = require("express-messages")(req, res)
  /*
    Llama a la función "next()", pasando el control a la siguiente pieza de middleware en la 
    aplicación. En última instancia, esto permite que los mensajes se configuren y luego se 
    pasen al siguiente
  */
  next()
})
/*
  le indica a la aplicación express que use el analizador de cuerpo para trabajar con datos JSON 
  (que se usará más adelante).
*/
app.use(bodyParser.json())
/*
  Le indica a la aplicación "Express" que lea y trabaje con los datos enviados a través de una URL, 
  así como desde un formulario, almacenados en el cuerpo del objeto de solicitud. 
  El objeto "extended: true" es una configuración que permite analizar objetos y matrices complejos. 
  La parte final es un comentario en línea que se refiere a toda la línea
*/
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route / Home route
// app.get("/", function(req, res){
//   res.render("index", {title: "Home"})
// })
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes.
/*
  1️⃣ "app.use()" es una función de Express que indica a la aplicación que utilice 
      los recursos pasados como parámetros. Es decir:
      👉🏼 const inventoryRoute = require("./routes/inventoryRoute")
  2️⃣ "/inv" es una palabra clave en nuestra aplicación, que indica que una ruta 
      que contenga esta palabra utilizará este archivo de ruta para trabajar con 
      procesos relacionados con el inventario; "inv" es simplemente una versión 
      corta de "inventory".
  3️⃣ "inventoryRoute" es la variable que representa el archivo inventoryRoute.js, 
      el cual fue requerido (traído al alcance del archivo server.js) anteriormente.
  💡  En resumen, cualquier ruta que comience con "/inv" será redirigida al archivo 
      inventoryRoute.js, para encontrar el resto de la ruta para poder cumplir con 
      la solicitud.
*/
app.use("/inv", inventoryRoute)

app.use("/account", accountRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: '<p>Sorry, we can\'t seem to find what you\'re looking for.</p>'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404) {
    message = err.message
  } else {
    message = '<p>Oh no! There was a crash. Maybe try a different route?</p>'
  }
  res.render("errors/error", {title: err.status || "Server Error", message: message, nav})
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
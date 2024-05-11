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
const inventoryRoute = require("./routes/inventoryRoute") // 📌 aún no estoy seguro si esta línea de código esta bien
const utilities = require("./utilities/") // Aquí se requiere el archivo utilities

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

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  // Ahora se puede usar la función getNav() de utilities
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
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
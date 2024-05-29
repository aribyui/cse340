// Trae el archivo 'inventory-model.js al alcance y almacena su funcionalidad en una variable "invModel"
const invModel = require("../models/inventory-model")
// Trae el archivo utilities > index.js al alcance y almacena su funcionalidad en una variable utilities.
const utilities = require("../utilities/")

// Crea un objeto vacío en la variable invCont
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
/*
  Crea una función asincrónica y anónima que acepta los objetos de solicitud (request) y respuesta (response), 
  junto con la función "next" de Express, como parámetros. La función se almacena en un 
  método nombrado "buildByClassificationId".
*/
invCont.buildByClassificationId = async function (req, res, next) {
  /* 
    Recoge el "classification_id" que ha sido enviado, como un parámetro nombrado, a través 
    de la URL y lo almacena en la variable "classification_id".

    "req" es el objeto de solicitud, que el cliente envía al servidor. 
    "params" es una función de Express, utilizada para representar datos que se pasan en la URL del cliente 
    al servidor. 
    "classificationId" es el nombre que se le dio al valor classification_id en el archivo inventoryRoute.js 
    (ver línea 7 de ese archivo).
  */
  const classification_id = req.params.classificationId
  /* 
    Llama a la función "getInventoryByClassificationId" que está en el archivo "inventory-model" 
    y pasa el "classification_id" como parámetro. 
    La función "await" espera a que se devuelvan los datos, y los datos se almacenan en la variable data.
  */
  const data = await invModel.getInventoryByClassificationId(classification_id)
  /*
    Llama a una función de "utility" para construir una cuadrícula, que contiene todos los vehículos 
    dentro de esa clasificación (la construirás más adelante en esta actividad). Ten en cuenta que se pasa 
    el array "data" como parámetro. Se devuelve una cadena HTML, que contiene una cuadrícula, y se almacena 
    en la variable grid.
  */
  const grid = await utilities.buildClassificationGrid(data)
  /*
    Llama a la función para construir la barra de navegación para usar en la vista y la almacena en la 
    variable nav
  */
  let nav = await utilities.getNav()
  /*
    Extrae el nombre de la clasificación, que coincide con "classification_id", de los datos devueltos por 
    la base de datos y lo almacena en la variable "className".
  */
  const className = data[0].classification_name
  /*
    Llama a la función "render" de Express para devolver una vista al navegador. La vista a devolver se llama 
    "clasification", que se creará dentro de una carpeta de "inventory", dentro de la carpeta de "views" ya 
    existente.
  */
  res.render("./inventory/classification", {
    /*
      Construye el valor "title" que se utilizará en el fragmento head, pero notarás que es dinámico para que 
      coincida con los datos. 
    */
    title: className + " vehicles",
    /*
      Contiene la variable nav, que mostrará la barra de navegación de la vista.
    */
    nav,
    /*
      Contiene la cadena HTML, que contiene la cuadrícula de elementos de inventario.
    */
    grid,
  })
}

invCont.buildByInventoryById = async function(req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getVehicleByInventoryId(inventory_id)
  // console.log(data)
  let nav = await utilities.getNav()
  const grid = await utilities.buildVehicleDetailsGrid(data)
  const vehicleYear = data.inv_year
  const vehicleMake = data.inv_make
  const vehicleModel = data.inv_model
  res.render("./inventory/details", {title: vehicleYear + ' ' + vehicleMake + ' ' + vehicleModel, nav, grid})
}

/* ****************************************
*  Deliver Vehicle Management view
* *************************************** */
invCont.buildVehicleManagement = async function(req, res, next) {
  let nav = await utilities.getNav()  
  res.render("./inventory/management", {title: "Vehicle Management", nav})
}

/* ****************************************
*  Deliver Add New Classification view
* *************************************** */
invCont.buildAddClassificationForm = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification", 
    nav, 
    errors: null,
  })
}

invCont.registerClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  
  const regResult = await invModel.registerClassification(classification_name)

  if (regResult) {
    req.flash ("notice",`Congratulations, you\'re registered ${classification_name}.`)    
    res.status(201).render("./inventory/management", {title: "Vehicle Management",nav}) 
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/add-classification", {title: "Add New classification",nav})
  }
}

module.exports = invCont
// Needed Resources 
// Integra Express en el ámbito del archivo.
const express = require("express")
// Usar archivos de enrutador separados para elementos específicos de la aplicación mantendría el archivo server.js más pequeño y más manejable
const router = new express.Router() 
// Lleva el controlador de inventario al ámbito de este documento de enrutador para ser utilizado.
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidate = require('../utilities/classification-validation')
const inventoryValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
/* 
  1️⃣ "get" indica que la ruta estará escuchando el método GET dentro de la solicitud (típicamente un enlace clicado o la URL misma).
  2️⃣ /type/:classificationId es la ruta que está siendo observada (nota que falta el elemento "inv" de la ruta, pero se tendrá en cuenta más adelante).
  3️⃣ invController.buildByClassification indica que la función buildByClassification dentro del invController será utilizada para cumplir con la solicitud enviada por la ruta.
*/
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build the inventory single item view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryById))

// Route to build the vehicle management view
router.get("", utilities.handleErrors(invController.buildVehicleManagement))

// Route to display the add classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationForm))

// Route to handle the addition of a new classification
router.post(
  "/add-classification",
  classificationValidate.classificationRules(),
  classificationValidate.checkRegData,
  utilities.handleErrors(invController.registerClassification)
)

// Route to display the add inventory form
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to handle the addition of a new vehicle
router.post(
  "/add-inventory",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkRegData,
  utilities.handleErrors(invController.registerVehicle)
)

module.exports = router
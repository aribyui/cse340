// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/")
const classificationValidate = require("../utilities/add-classification-validation");
const vehicleValidate = require("../utilities/add-vehicle-validation");

// Route utilities.handleErrors((o build inventory by classification v)ew
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory details view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to add a new vehicle classification
router.post("/add-classification", classificationValidate.classificationRules(), classificationValidate.checkClassificationData, utilities.handleErrors(invController.addClassification));

// Route to add a new vehicle to inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Route to add a new vehicle to inventory 
router.post("/add-inventory", vehicleValidate.vehicleRules(), vehicleValidate.checkVehicleData, utilities.handleErrors(invController.addVehicle))

module.exports = router;

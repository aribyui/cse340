// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/")
const classificationValidate = require("../utilities/classification-validation");
const inventoryValidation = require("../utilities/inventory-validation");

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
router.post("/add-inventory", inventoryValidation.inventoryRules(), inventoryValidation.checkInventoryData, utilities.handleErrors(invController.addVehicle));

// Route to get inventory list in JSON format by classification ID
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to build edit inventory item view
router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventoryView));

// Route to update an existing inventory item
router.post("/update/", inventoryValidation.inventoryRules(), inventoryValidation.checkUpdateData, utilities.handleErrors(invController.updateInventory))

// Route to build delete inventory item view
router.get("/delete/:inventory_id", utilities.handleErrors(invController.deleteItemInventoryView));

// Route to delete an existing inventory item
router.post("/delete/", utilities.handleErrors(invController.deleteItemInventory));

module.exports = router;

const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  // Devuelve el id o número de clasificación de cada categoría de vehículo
  // 1. Custom
  // 2. Sport
  // 3. SUV
  // 4. Truck
  // 5. Sedan
  const classification_id = req.params.classificationId;
  // console.log(classification_id)
  const data = await invModel.getInventoryByClassificationId(classification_id);
  // console.log(data)
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name; // 📌 ¿por qué data[0]?
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory details view
 * ************************** */
invCont.buildByInventoryId = async (req, res, next) => {
  const inv_id = req.params.inventoryId;
  const vehicleData = await invModel.getVehicleInventoryById(inv_id);
  const grid = await utilities.buildVehicleDetailsGrid(vehicleData);
  const nav = await utilities.getNav();
  const inv_year = vehicleData.inv_year;
  const inv_model = vehicleData.inv_model;
  const inv_make = vehicleData.inv_make;
  const vehicleName = `${inv_year} ${inv_make} ${inv_model}`;
  res.render("./inventory/details", {
    title: vehicleName,
    nav,
    grid,
  });
};

/* ****************************************
 *  Build management view
 * *************************************** */
invCont.buildManagementView = async (req, res) => {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Management",
    nav,
    errors: null,
    classificationSelect,
  });
};

/* ****************************************
 *  Build add classification view
 * *************************************** */
invCont.buildAddClassificationView = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Add a new vehicle classification
 * *************************************** */
invCont.addClassification = async (req, res) => {
  const nav = await utilities.getNav();
  const { classification_name } = req.body;

  const addClassificationResult = await invModel.addVehicleClassification(
    classification_name
  );

  if (addClassificationResult) {
    req.flash(
      "message",
      `The new car classification <span>${classification_name}</span> was successfully added.`
    );
    res
      .status(201)
      .render("inventory/management", { title: "Management", nav });
  } else {
    req.flash(
      "notice-classification",
      "Sorry, we couldn't add the new classification."
    );
    req.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    });
  }
};

/* ****************************************
 *  Add a new vehicle to inventory view
 * *************************************** */
invCont.buildAddInventoryView = async (req, res) => {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add a Vehicle",
    nav,
    select: classificationList,
    errors: null,
  });
};

/* ****************************************
 *  Add a new vehicle to inventory
 * *************************************** */
invCont.addVehicle = async (req, res) => {
  const nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const addVehicleResult = await invModel.addNewVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (addVehicleResult) {
    req.flash(
      "message",
      `The new vehicle <span>${inv_make}</span> was successfully added.`
    );
    res
      .status(201)
      .render("inventory/management", { title: "Management", nav });
  } else {
    req.flash("notice", "Sorry, we couldn't add the new vehicle.");
    res
      .status(501)
      .render("inventory/add-inventory", { title: "Add a Vehicle", nav });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    // En funciones async, usamos next(new Error(...)) para pasar errores al middleware de manejo de errores de Express
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async (req, res) => {
  const inv_id = parseInt(req.params.inventory_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getVehicleInventoryById(inv_id); // 📌 probablemente sea 'getVehicleInventoryById' -- getInventoryById
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async (req, res, next) => {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("message", `The ${itemName} was successfully updated.`); // estaba message en lugar de notice
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

module.exports = invCont;

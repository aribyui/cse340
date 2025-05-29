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
  res.render("inventory/management", {
    title: "Management",
    nav,
    errors: null,
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

  try {
    const addClassificationResult = await invModel.addVehicleClassification(
      classification_name
    );
    if (addClassificationResult) {
      req.flash("notice-classification", `The new car classification was successfully added.`);
      res
        .status(201)
        .render("inventory/management", { title: "Add Classification", nav });
    }
  } catch (error) {
    req.flash("notice-classification", "Sorry, we couldn't add the new classification.");
    req
      .status(501)
      .render("inventory/add-classification", {
        title: "Add Classification",
        nav,
      });
  }

  

};

module.exports = invCont;

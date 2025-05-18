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
  // console.log(className);
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

module.exports = invCont;

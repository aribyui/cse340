const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const validate = {};

/*  **********************************
 *  Check vehicle data and return errors or proceed
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide the vehicle make.")
      .isLength({ min: 3 })
      .withMessage("Vehicle make must be at least 3 characters long."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide the vehicle model.")
      .isLength({ min: 3 })
      .withMessage("Vehicle model must be at least 3 characters long."),

    body("inv_year")
      .notEmpty()
      .withMessage("Please provide the vehicle year.")
      .custom((inv_year) => {
        const year = parseInt(inv_year, 10);
        const currentYear = new Date().getFullYear();
        if (year >= 1886 && year <= currentYear) {
          return true;
        } else {
          throw new Error(`Year must be between 1886 and ${currentYear}.`);
        }
      }),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a description.")
      .isLength({ min: 50, max: 1000 })
      .withMessage("Description must be between 50 and 1000 characters."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle image URL."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle thumbnail URL."),

    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle price.")
      .isInt()
      .withMessage("Price accept only numbers."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle mileage.")
      .isInt()
      .withMessage("Miles accept only numbers."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide the vehicle color."),

    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please select a vehicle classification."),
  ];
};

/* ******************************
 * Check data and return errors or continue to vehicle processing
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
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
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      select: classificationList,
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
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors by re-rendering the edit view or continue to vehicle processing
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
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
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + inv_make + " " + invModel,
      nav,
      select: classificationList,
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
    return;
  }
  next();
};

module.exports = validate;
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
// const inventoryModel = require("../model/inventory-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please choose a classification."),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min:1, max: 3 })
      .withMessage("Please provide a make."),
    
    body("inv_model")
      .trim()    
      .escape()
      .notEmpty()
      .isLength({ min:1, max: 3 })
      .withMessage("Please provide a model."),

    body("inv_description")
      .trim()    
      .escape()
      .notEmpty()
      .withMessage("Please provide a description"),

    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide an image."),

    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a thumbnail."),
    
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a price."),

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ max: 4 })
      .isInt({ min: 1886 })
      .withMessage("Please provide a year."),
    
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Please provide miles"),
    
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a color.")
  ]
}

/* ******************************
 * Check data and return errors or continue to add a vehicle
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

module.exports = validate
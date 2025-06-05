const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 * Get all inventory items by joining the inventory and classification tables
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT
        *
      FROM
        public.inventory AS i 
      JOIN
        public.classification AS c
          ON
        i.classification_id = c.classification_id
      WHERE
        i.classification_id = $1`,
      [classification_id]
    );
    return data.rows; // 💡 sends the data, as an array of all the rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/* ***************************
 * Get all inventory vehicles by id
 * ************************** */
async function getVehicleInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT 
      * 
    FROM 
      public.inventory
    WHERE
      inventory.inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getvehicleinventorybyid " + error);
  }
}

/* ***************************
 * Add a new vehicle classification into the classification table
 * ************************** */
async function addVehicleClassification(classification_name) {
  try {
    const sql = `
    INSERT INTO
      classification (classification_name)
    VALUES
      ($1) RETURNING *
    `;
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(classification_name) {
  try {
    const sql = `
      SELECT
        *
      FROM
        classification
      WHERE
        classification_name = $1
    `;
    const classification = await pool.query(sql, [classification_name]);
    return classification.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 * Add a new vehicle to the inventory table
 * ************************** */
async function addNewVehicle(
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
) {
  try {
    const sql = `
  INSERT INTO inventory
    (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *
`;
    const results = await pool.query(sql, [
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
    ]);
    return results.rows[0];
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql = `
      UPDATE
        public.inventory
      SET
        inv_make = $2,
        inv_model = $3,
        inv_year = $4,
        inv_description = $5,
        inv_image = $6,
        inv_thumbnail = $7,
        inv_price = $8,
        inv_miles = $9,
        inv_color = $10,
        classification_id = $11
      WHERE
        inv_id = $1
      RETURNING *
    `;
    const data = await pool.query(sql, [
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
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteItemInventory(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    new Error("Delete Inventory Error");
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleInventoryById,
  addVehicleClassification,
  checkExistingClassification,
  addNewVehicle,
  updateInventory,
  deleteItemInventory,
};

const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
    INSERT INTO account 
      (account_firstname, account_lastname, account_email, account_password, account_type)
    VALUES
      ($1, $2, $3, $4, 'Client')
    RETURNING *
    `
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    // Define la consulta SQL para seleccionar todas las columnas de la tabla 'account'
    // donde el 'account_email' coincide con el valor proporcionado.
    const sql = "SELECT * FROM account WHERE account_email = $1"

    // Ejecuta la consulta con el valor de 'account_email' y espera a que la consulta se complete.
    const email = await pool.query(sql, [account_email])

    // Devuelve el número de filas que coinciden con el 'account_email' proporcionado.
    return email.rowCount
  } catch (error) {
    // Si ocurre un error, devuelve el mensaje de error
    return error.message
  }
}

module.exports = { registerAccount, checkExistingEmail }
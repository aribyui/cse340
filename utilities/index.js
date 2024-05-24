const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
      + 'details"><img src="' + vehicle.inv_thumbnail
      + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
      + ' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      // grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory item detail view HTML
* ************************************ */
Util.buildVehicleDetailsGrid = async function(data) {
  let grid = '<div id="vehicle-details">'
  let container1 = '<div id="container1">'
  let container2 = '<div id="container2">'

  container1 += '<img src="' + data.inv_image + '" alt="' + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model + '" title="' + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model + '">'
  container1 += '</div>'

  container2 += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details</h2>'
  container2 += '<p class="bold-text">Price: $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
  container2 += '<p><span class="bold-text">Description:</span> ' + data.inv_description + '</p>'
  container2 += '<p><span class="bold-text">Color:</span> ' + data.inv_color + '</p>'
  container2 += '<p><span class="bold-text">Miles:</span> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
  container2 += '</div>'
  
  grid += container1
  grid += container2
  grid += '</div>'

 return grid  
}

/* **************************************
* Build the login view HTML
* ************************************ */
// Util.buildLoginView = async function() {
//   const view = `
//     <form>
//       <fieldset>
//         <label for="account_email">Email Address: <input type="text" id="account_email" name="account_email"></label>
//         <label for="account_password">Password: <input type="password" id="account_password" name="account_password"></label>
//         <input type="submit" value="Login">
//       </fieldset>
//       <p>No account? <a href="/account/register">Sign-up</a></p>
//     </form>
//   `
//   return view
// }

/* **************************************
* Build the registration view HTML
* ************************************ */
// Util.buildRegisterView = async function() {
//   const view = `
//     <form action="/account/register" method="post" autocomplete="off">
//       <fieldset>
//         <label for="account_firstname">First name: <input type="text" id="account_firstname" name="account_firstname" required></label>
//         <label for="account_lastname">Last name: <input type="text" id="account_lastname" name="account_lastname" required></label>
//         <label for="account_email">Email address: <input type="email" id="account_email" name="account_email" required></label>
//         <label for="account_password">Password: <input type="password" id="account_password" name="account_password" required maxlength="12" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$"><div><p>Passwords must be minimun of 12 characters and include 1 capital letter, 1 number and 1 special character.</p></div></label>
        
//         <label for="show_password"><input type="checkbox" id="show_password"> Show password</label>
//         <input type="submit" value="Register">
//       </fieldset>      
//     </form>
//   `
//   return view
// }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
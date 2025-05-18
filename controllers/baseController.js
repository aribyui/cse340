const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
};

// Alternative version - función añadida directamente en el objeto al crearlo
// const baseController = {
//   buildHome: async function(req, res) {
//     const nav = await utilities.getNav();
//     res.render("index", { title: "Home", nav });
//   }
// }

module.exports = baseController;

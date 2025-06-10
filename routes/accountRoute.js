const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to build management view
router.get("/", utilities.checkLogin, accountController.buildAccountManagement);

// Route to build register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Route to build logout view
router.get(
  "/logout",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildLogout)
);

// Route to build update account view
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.buildUpdateAccount)
);

// Route to update an account
router.post(
  "/update",
  regValidate.accountRules(),
  regValidate.checkAccountData,
  utilities.handleErrors(accountController.updateAccount)
);

// Route to update a password
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
);


module.exports = router;

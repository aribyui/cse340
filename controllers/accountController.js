const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/login", { title: "Login", nav });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry there was an error processing the registration."
    );
    req.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", { title: "Login", nav });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", { title: "Register", nav });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      // delete accountData.account_password;

      const payload = {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type,
      };

      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again,"
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav();
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function buildLogout(req, res) {
  res.clearCookie("jwt");
  req.flash("message-logged-out", "You have been successfully logged out.");
  res.redirect("/");
}

/* ****************************************
 *  Deliver update account view
 * *************************************** */
async function buildUpdateAccount(req, res) {
  const nav = await utilities.getNav();
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id);
  res.render("account/update", {
    title: "Edit Account",
    nav,
    accountData: {
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    },
    errors: null,
  });
}

/* ****************************************
 *  Process to update an account
 * ************************************ */
async function updateAccount(req, res) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } =
      req.body;

    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      // Crear nuevo payload para el JWT
      const payload = {
        account_id: updateResult.account_id,
        account_firstname: updateResult.account_firstname,
        account_lastname: updateResult.account_lastname,
        account_email: updateResult.account_email,
        // Si tienes account_type, ponlo también aquí (si lo tienes en updateResult)
      };

      // Crear nuevo token con datos actualizados
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3600 * 1000,
      });

      // Actualizar cookie con el nuevo token
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }

      req.flash("message", "The account has been successfully updated.");
      return res.redirect("/account/");
    } else {
      // Algo salió mal (ajustar aquí el mensaje)
      let nav = await utilities.getNav();
      res.render("account/update", {
        title: "Edit Account",
        nav,
        errors: [{ msg: "Failed to update account. Please try again." }],
        accountData: {
          account_id,
          account_firstname,
          account_lastname,
          account_email,
        },
      });
    }
  } catch (error) {
    console.error("Error updating account: ", error);
    let nav = await utilities.getNav();
    res.status(500).render("account/update", {
      title: "Edit Account",
      nav,
      errors: [{ msg: "Server error. Please try again later." }],
      accountData: {
        account_id: req.body.account_id,
        account_firstname: req.body.account_firstname,
        account_lastname: req.body.account_lastname,
        account_email: req.body.account_email,
      },
    });
  }
}


/* ****************************************
 *  Process to update the account password
 * ************************************ */
async function changePassword(req, res) {
  try {
    const { account_id, account_password } = req.body;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(account_password, 10);

    // Update the password in the database
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      req.flash("message", "Your password has been successfully updated.");
      res.redirect("/account/");
    } else {
      let nav = await utilities.getNav();
      res.render("account/update", {
        title: "Edit Account",
        nav,
        errors: [{ msg: "Failed to update password. Please try again." }],
        accountData: { account_id },
      });
    }
  } catch (error) {
    console.error("Error changing password: ", error);
    let nav = await utilities.getNav();
    res.status(500).render("account/update", {
      title: "Edit Account",
      nav,
      errors: [{ msg: "Server error. Please try again later." }],
      accountData: { account_id },
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildLogout,
  buildUpdateAccount,
  updateAccount,
  changePassword,
};

/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const causeErrorRoute = require("./routes/causeErrorRoute");
const utilities = require("./utilities/");
const session = require("express-session");
const pool = require("./database/");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

/* ***********************
 * Middleware
 * ************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(utilities.checkJWTToken);

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory routes
app.use("/inv", inventoryRoute);
// Account routes
app.use("/account", accountRoute);
// Route to generate error
app.use("/cause-error", causeErrorRoute);
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({
    status: 404,
    title: "404 - Page Not Found",
    message: `
      <div class="status-hero">
        <picture>
          <source media="(max-width: 500px)" srcset="/images/site/404-error.png">
          <img src="/images/site/404-error.png" alt="" width="400" height="400">
        </picture>
        <div class="status-hero-label">
          <h2>🚧 Out of route!</h2>
          <p>The page you're looking for isn't here. Let's refuel at the homepage</p>
          <a href="/">Return Home</a>
        </div>
      </div>
      `,
  });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  let message;

  if (err.status === 404) {
    message = err.message;
  } else {
    message = `
      <div class="status-hero">
        <picture>
            <source media="(max-width: 500px)" srcset="/images/site/500-error.jpg">
            <img src="/images/site/500-error.jpg" alt="" width="400" height="400">
        </picture>
        <div class="status-hero-label">
          <h2>🛠️ Engine trouble on the server.</h2>
          <p>We're working to fix it. Please try a different route or return to the homepage.</p>
          <a href="/">Return Home</a>
        </div> 
      </div>
    `;
  }

  res.status(err.status || 500).render("errors/error", {
    title: err.title || "500 - Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

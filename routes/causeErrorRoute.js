const express = require("express");
const router = new express.Router();
const causeErrorController = require("../controllers/causeErrorController");
const utilities = require("../utilities/");

router.get("/", utilities.handleErrors(causeErrorController.throwError));

module.exports = router;

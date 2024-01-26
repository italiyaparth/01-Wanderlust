const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const userController = require("../controllers/users.js");


router.route("/")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));


module.exports = router;

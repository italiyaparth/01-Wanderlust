const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.js");


router.get("/", userController.signout);


module.exports = router;

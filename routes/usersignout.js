// Step 41

const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.js"); // Step 48

/*
router.get("/", (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash("success", "You are Logged Out");
        res.redirect("/listings");
    });

});
*/

// Step 48
router.get("/", userController.signout);

module.exports = router;
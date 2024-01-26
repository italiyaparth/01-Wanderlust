// Step 38

const express = require("express");
const router = express.Router();
// const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

const userController = require("../controllers/users.js");  // Step 48


// Step 49
router.route("/")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));


/*
router.get("/", (req, res) => {
    res.render("users/signup.ejs");
});
*/

/*
// Step 48
router.get("/", userController.renderSignupForm);
*/



/*
router.post("/", wrapAsync(async (req, res) => {

    try {
        let { username, email, password } = req.body;

        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {    // Step 43

            if (err) {
                
                return next(err);
            }

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
        
    } catch(e) {

        req.flash("error", e.message);
        res.redirect("/signup");
    }

}));
*/

/*
// Step 48
router.post("/", wrapAsync(userController.signup));
*/


module.exports = router;
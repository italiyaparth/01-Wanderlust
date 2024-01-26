// Step 39

const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");   // Step 44

const userController = require("../controllers/users.js"); // Step 48


// Step 49
router.route("/")
.get(userController.renderSigninForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  userController.signin
);

/*
router.get("/", (req, res) => {
  res.render("users/signin.ejs");
});
*/

/*
// Step 48
router.get("/", userController.renderSigninForm);
*/





/*
router.post(
  "/",
  saveRedirectUrl,   // Step 44
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  async (req, res) => {

    req.flash("success", "Welcome to Wanderlust! You are Signed In");

    // res.redirect("/listings");
    let redirectUrl = res.locals.redirectUrl || "/listings";   // Step 44
    res.redirect(redirectUrl);   // Step 44
  }
);
*/

/*
// Step 48
router.post(
  "/",
  saveRedirectUrl,   // Step 44
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  userController.signin
);
*/


module.exports = router;

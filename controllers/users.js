// Step 48

const User = require("../models/user.js");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {

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

};

module.exports.renderSigninForm = (req, res) => {
    res.render("users/signin.ejs");
  };

module.exports.signin = async (req, res) => {

    req.flash("success", "Welcome to Wanderlust! You are Signed In");

    let redirectUrl = res.locals.redirectUrl || "/listings";   // Step 44
    res.redirect(redirectUrl);   // Step 44
};

module.exports.signout = (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash("success", "You are Logged Out");
        res.redirect("/listings");
    });
};
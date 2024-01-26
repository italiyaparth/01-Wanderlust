const Listing = require("./models/listing"); // Step 46
const Review = require("./models/review"); // Step 47
const { listingSchemaJoiValidator, reviewSchemaJoiValidator } = require("./schema.js"); // Step 21 // Step 28 // Step 46
const ExpressError = require("./utils/ExpressError.js"); // Step 19 // Step 46

// Step 40
module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;  // Step 44

        req.flash("error", "You are NOT Logged in");
        return res.redirect("/signin");
    }

    next();
};


// Step 44
module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {
        
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};

// Step 46
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Step 46
// Step 22
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchemaJoiValidator.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Step 46
// Step 28
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchemaJoiValidator.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Step 47
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
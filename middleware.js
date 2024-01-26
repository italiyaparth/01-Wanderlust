const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchemaJoiValidator, reviewSchemaJoiValidator } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You are NOT Logged in");
        return res.redirect("/signin");
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {
        
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchemaJoiValidator.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchemaJoiValidator.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

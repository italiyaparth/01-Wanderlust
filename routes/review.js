// Step 33

const express = require("express");
const router = express.Router({ mergeParams: true });


const wrapAsync = require("../utils/wrapAsync.js"); // Step 18
// const ExpressError = require("../utils/ExpressError.js"); // Step 19
// const Review = require("../models/review.js"); // Step 26
// const { reviewSchemaJoiValidator } = require("../schema.js"); // Step 28
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js"); // Step 40 // Step 46 // Step 47

// const Listing = require("../models/listing.js");

const reviewController = require("../controllers/reviews.js"); // Step 48


/*
//Step 28
const validateReview = (req, res, next) => {
    let { error } = reviewSchemaJoiValidator.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
*/



/*
// Step 26  &  Step 28 - added validateReview middleware  // Step 40 - isLoggedIn
// Reviews Post
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;    // Step 47

    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    req.flash("success", "New Review Created!");   // Step 35

    res.redirect(`/listings/${listing._id}`);
}));
*/

// Step 48
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

/*
// Step 31
// Reviews Delete  // Step 40 - isLoggedIn
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");   // Step 35

    res.redirect(`/listings/${id}`);
}));
*/

// Step 48
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
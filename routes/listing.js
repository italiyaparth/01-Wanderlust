// Step 33

const express = require("express");
const router = express.Router();


const wrapAsync = require("../utils/wrapAsync.js"); // Step 18
// const ExpressError = require("../utils/ExpressError.js"); // Step 19
// const Listing = require("../models/listing.js"); // Step 2 // Step 48
// const { listingSchemaJoiValidator } = require("../schema.js"); // Step 21
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Step 40 // Step 46

const listingController = require("../controllers/listings.js");    // Step 48


const multer = require("multer");   // Step 51
const { storage } = require("../cloudConfig.js");   // Step 51
const upload = multer({ storage });   // Step 51


// Step 49

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing)); // Step 51 - upload

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing)) // Step 51 - upload
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


/*
// Step 22
const validateListing = (req, res, next) => {
    let { error } = listingSchemaJoiValidator.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
*/



/*
// Step 4 // Step 18 - add wrapAsync
router.get("/", wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));
*/

/*
// Step 48
router.get("/", wrapAsync(listingController.index));
*/



/*
// Step 6 - write this above "/listing/:id" so that js understands new != :id   // Step 40 - isLoggedIn
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});
*/

/*
// Step 48
router.get("/new", isLoggedIn, listingController.renderNewForm);
*/




/*
// Step 5 // Step 18 - add wrapAsync  // Step 29 - add populate reviews // Step 45 - populate owner // Step 47 - populate author of reviews
router.get("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

    // Step 35
    if(!listing) {
        req.flash("error", "Listing does NOT exist");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs",  { listing });
}));
*/

/*
// Step 48
router.get("/:id", wrapAsync(listingController.showListing));
*/



/*
// Step 6 // Step 18 - add wrapAsync // Step 22 - add validateListing  // Step 40 - isLoggedIn
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {

    
    //    let result = listingSchemaJoiValidator.validate(req.body);      // Step 21
    //    if (result.error) {
    //        throw new ExpressError(400, result.error);      // Step 21
    //    }
    

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;    // Step 45
    await newListing.save();

    req.flash("success", "New Listing Created!");   // Step 35

    res.redirect("/listings");
}));
*/

/*
// Step 48
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));
*/




/*
// Step 7 // Step 18 - add wrapAsync  // Step 40 - isLoggedIn // Step 46 - isOwner
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    // Step 35
    if(!listing) {
        req.flash("error", "Listing does NOT exist");
        res.redirect("/listings");
    }

    res.render("listings/edit.ejs",  { listing });
}));
*/

/*
// Step 48
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
*/



/*
// Step 6 // Step 18 - add wrapAsync // Step 22 - add validateListing  // Step 40 - isLoggedIn // Step 46 - isOwner
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res, next) => {

    
    //    let result = listingSchemaJoiValidator.validate(req.body);      // Step 21
    //    if (result.error) {
    //        throw new ExpressError(400, result.error);      // Step 21
    //    }


    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // "..." means deconstructing given object into individual key-value pairs

    req.flash("success", "Listing Updated!");   // Step 35

    res.redirect(`/listings/${id}`);
}));
*/

/*
// Step 48
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));
*/



/*
// Step 8 // Step 18 - add wrapAsync  // Step 40 - isLoggedIn // Step 46 - isOwner
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");   // Step 35

    res.redirect("/listings");
}));
*/

/*
// Step 48
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
*/



module.exports = router;
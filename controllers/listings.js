// Step 48

const Listing = require("../models/listing");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");  // Step 52
const mapToken = process.env.MAP_TOKEN;  // Step 52
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });  // Step 52

module.exports.index = async (req, res) => {

    let allListings;

    console.log(req.query.filter);
    if (req.query.filter && req.query.filter.length > 0) {      // Step 53 filter
        
        allListings = await Listing.find({ category: { $in: req.query.filter } });
        res.render("listings/index.ejs", { allListings });
    } else {
        allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings } );
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

    // Step 35
    if(!listing) {
        req.flash("error", "Listing does NOT exist");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs",  { listing });
};

module.exports.createListing = async (req, res) => {

    /*
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1    // 5 is by default if not written
    }).send();     // Step 52
    */

    let url = req.file.path;    // Step 51
    let filename = req.file.filename;    // Step 51
    
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;    // Step 45

    newListing.image = { url, filename }; // Step 51

    // newListing.geometry = response.body.feature[0].geometry;    // Step 52

    await newListing.save();

    req.flash("success", "New Listing Created!");   // Step 35

    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    // Step 35
    if(!listing) {
        req.flash("error", "Listing does NOT exist");
        return res.redirect("/listings");
    }

    let previewUrl = listing.image.url;     // Step 51
    previewUrl = previewUrl.replace("upload/", "upload/w_300/");     // Step 51

    res.render("listings/edit.ejs",  { listing, previewUrl }); // Step 51 - previewUrl
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if (typeof req.file !== "undefined") { // Step 51
        
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");   // Step 35

    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");   // Step 35

    res.redirect("/listings");
};
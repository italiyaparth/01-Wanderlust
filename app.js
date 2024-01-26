// Step 51
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}


const express = require("express"); // Step 1
const app = express(); // Step 1
const mongoose = require("mongoose"); // Step 1
const path = require("path");   // Step 4
const methodOverride = require("method-override");   // Step 7
const ejsMate = require("ejs-mate");   // Step 9
const session = require("express-session"); // Step 34

const MongoStore = require("connect-mongo");   // Step 54

const flash = require("connect-flash"); // Step 35
const passport = require("passport");   // Step 36
const LocalStrategy = require("passport-local");    // Step 36

// const Listing = require("./models/listing.js"); // Step 2   // Step 33
// const wrapAsync = require("./utils/wrapAsync.js"); // Step 18   // Step 33
const ExpressError = require("./utils/ExpressError.js"); // Step 19   // Step 33
// const { listingSchemaJoiValidator } = require("./schema.js"); // Step 21   // Step 33
// const Review = require("./models/review.js"); // Step 26   // Step 33
// const { reviewSchemaJoiValidator } = require("./schema.js"); // Step 28   // Step 33
const User = require("./models/user.js");   // Step 36

const listingRouter = require("./routes/listing.js"); // Step 33
const reviewRouter = require("./routes/review.js"); // Step 33
const userSignupRouter = require("./routes/usersignup.js"); // Step 38
const userSigninRouter = require("./routes/usersignin.js"); // Step 39
const userSignoutRouter = require("./routes/usersignout.js"); // Step 41



app.set("view engine", "ejs");      // Step 4
app.set("views", path.join(__dirname, "views"));    // Step 4

app.use(express.urlencoded( { extended: true } ));  // Step 5
app.use(methodOverride("_method"));  // Step 7
app.use(express.static(path.join(__dirname,"public"))); // Step 9

app.engine("ejs", ejsMate);     // Step 9





// Step 1
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const MONGO_URL = process.env.ATLASDB_URL;   // Step 54


// Step 1
async function main() {
  await mongoose.connect(MONGO_URL);
}

// Step 1
main()
.then( () => console.log("MongoDB connection successful") )
.catch( (err) => console.log(err) );



// Step 54
const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

// Step 54
store.on("error", () => {
    console.log("Error in session store", err);
});

// Step 34
const sessionOptions = {
    store,   // Step 54
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true  // for security purposes - prevents cross scripting attacks
    }
};




app.use(session(sessionOptions));   // Step 34
app.use(flash());   // Step 35

app.use(passport.initialize()); // Step 36
app.use(passport.session()); // Step 36
passport.use(new LocalStrategy(User.authenticate())); // Step 36
passport.serializeUser(User.serializeUser()); // Step 36
passport.deserializeUser(User.deserializeUser()); // Step 36


// Step 35
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // Step 42
    next();
});


/*
// Step 37
app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "abc@gmail.com",
        username: "student"
    });

    let registeredUser = await User.register(fakeUser, "abc123");
    res.send(registeredUser);
});
*/



// Step 33

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

app.use("/signup", userSignupRouter);   // Step 38
app.use("/signin", userSigninRouter);   // Step 39
app.use("/signout", userSignoutRouter);   // Step 41


/* Step 33  cut - pasted in routes/listing.js



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


/* Step 33  cut - pasted in routes/review.js



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











/* Step 33  cut - pasted in routes/listing.js



// Step 4 // Step 18 - add wrapAsync
app.get("/listings", wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


// Step 6 - write this above "/listing/:id" so that js understands new != :id 
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Step 5 // Step 18 - add wrapAsync  // Step 29 - add populate
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",  { listing });
}));

// Step 6 // Step 18 - add wrapAsync // Step 22 - add validateListing
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {

    
    //    let result = listingSchemaJoiValidator.validate(req.body);      // Step 21
    //    if (result.error) {
    //        throw new ExpressError(400, result.error);      // Step 21
    //    }
    

    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Step 7 // Step 18 - add wrapAsync
app.get("/listings/:id/edit", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",  { listing });
}));

// Step 6 // Step 18 - add wrapAsync // Step 22 - add validateListing
app.put("/listings/:id", validateListing, wrapAsync(async (req, res, next) => {

    
    //    let result = listingSchemaJoiValidator.validate(req.body);      // Step 21
    //    if (result.error) {
    //        throw new ExpressError(400, result.error);      // Step 21
    //    }


    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // "..." means deconstructing given object into individual key-value pairs
    res.redirect(`/listings/${id}`);
}));

// Step 8 // Step 18 - add wrapAsync
app.delete("/listings/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));



*/











/* Step 33  cut - pasted in routes/review.js



// Step 26  &  Step 28 - added validateReview middleware
// Reviews Post
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    res.redirect(`/listings/${listing._id}`);
}));

// Step 31
// Reviews Delete
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));



*/





// Step 19
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// Step 18
app.use((err, req, res, next) => {

    // res.send("something went wrong!");

    // Step 19
    // let { statusCode = 500, message = "Something went Wrong!" } = err;
    // res.status(statusCode).send(message);

    // Step 20
    let { statusCode = 500, message = "Something went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});


// Step 1
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
  });
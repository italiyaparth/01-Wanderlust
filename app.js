if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userSignupRouter = require("./routes/usersignup.js");
const userSigninRouter = require("./routes/usersignin.js");
const userSignoutRouter = require("./routes/usersignout.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded( { extended: true } ));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

app.engine("ejs", ejsMate);


const MONGO_URL = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
.then( () => console.log("MongoDB connection successful") )
.catch( (err) => console.log(err) );


const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in session store", err);
});


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


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/signup", userSignupRouter);
app.use("/signin", userSigninRouter);
app.use("/signout", userSignoutRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

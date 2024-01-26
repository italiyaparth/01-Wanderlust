// Step 2

const mongoose = require("mongoose");
const Review = require("./review.js"); // Step 32

const Schema = mongoose.Schema;


const listingSchema = new Schema({

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  // image: {
  //   type: String, //  URL
  //   default:
  //     "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  //   set: (userImage) =>
  //     userImage === ""
  //       ? "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  //       : userImage,
  //   // user uploaded image, and uploaded in our different database which stores only images but from there URL link didn't come then default image will come from here
  // },

  image: { // Step 51
    url: String,
    filename: String
  },

  price: {
    type: Number,
  },

  location: {
    type: String,
  },

  country: {
    type: String,
  },

// Step 24
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],

// Step 45
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

// Step 52
  geometry: {
    type: {
      type: String,   // Do not do { location: { type: String } }
      enum: ["Point"],
      // required: true
    },
    coordinates: {
      type: [Number],
      // required: true
    }
  },

// Step 53
  category: {
    type: String,
    enum: ["mountains", "farms", "cabins", "beach", "castles"],
    required: true
  }

});


// Step 32
listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

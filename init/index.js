const mongoose = require("mongoose");       // Step 3
const initData = require("./data.js");      // Step 3
const Listing = require("../models/listing.js");     

// Step 3
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Step 3
async function main() {
  await mongoose.connect(MONGO_URL);
}

// Step 3
main()
.then( () => console.log("MongoDB connection successful") )
.catch( (err) => console.log(err) );

// Step 3
const initDB = async () => {
    await Listing.deleteMany({});   //  delete any previous data if there are any

    initData.data = initData.data.map((obj) => ({...obj, owner: "65aa3da98a16c33241fea65a"})); // Step 45
    initData.data = initData.data.map((obj) => ({...obj, image: { url: obj.image }})); // Step 51

    // Step 53
    const categoryArray = ["mountains", "farms", "cabins", "beach", "castles"];
    const randomCategory = () => {
      return categoryArray[Math.floor(Math.random() * 5)];
    };
  
    initData.data = initData.data.map((obj) => ({...obj, category: randomCategory()})); // Step 53
    

    await Listing.insertMany(initData.data);    // initData is an object and data is key
    console.log("Data stored successfully");
};

// Step 3
initDB();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");     

const MONGO_URL = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
.then( () => console.log("MongoDB connection successful") )
.catch( (err) => console.log(err) );

const initDB = async () => {
    await Listing.deleteMany({});   //  delete any previous data if there are any

    initData.data = initData.data.map((obj) => ({...obj, owner: "65aa3da98a16c33241fea65a"}));
    initData.data = initData.data.map((obj) => ({...obj, image: { url: obj.image }}));


    const categoryArray = ["mountains", "farms", "cabins", "beach", "castles"];
    const randomCategory = () => {
      return categoryArray[Math.floor(Math.random() * 5)];
    };
  
    initData.data = initData.data.map((obj) => ({...obj, category: randomCategory()}));
    

    await Listing.insertMany(initData.data);    // initData is an object and data is key
    console.log("Data stored successfully");
};

initDB();

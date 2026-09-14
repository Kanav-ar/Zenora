const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/Zenora";
const initData = require("./data")
const Listing = require("../models/listings");
main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initializeDB = async ()=>{
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj) => ({...obj, owner: "68baef0bc731587303b588a1"}))
    await Listing.insertMany(initData.data)
}
initializeDB();
// Listing.insertMany()
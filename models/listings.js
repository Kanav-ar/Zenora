const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js")

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: function(v) {
      return v === "" ? this.default : v
      // Default value is for testing backend, and set value is for frontend when no link is provided
      // If any document doesn't contain the image key then the image value will be undefined so default value is required
    },
  },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
   geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category:{
    type: String,
    enum: ["room","city","mountain","castle","pool","camp","farm","arctic","boat","dome"]
  },
  updated_at: Number,
});

ListingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;

// For debug
// const initData = require("../init/data")
// console.log(initData);

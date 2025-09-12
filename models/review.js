const mongoose = require("mongoose");
const User = require("./user")

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min:1,
        max:5
    },
    created_at:{
        type: Date,
        default: Date.now(),
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;
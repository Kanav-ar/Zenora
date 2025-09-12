const Review = require("../models/review.js");
const Listing = require("../models/listings.js");

// Add a new review to DataBase - POST
module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!")
    res.redirect(`/listings/${id}`);
  }


// Delete an existing review - DELETE
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
  }

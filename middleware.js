const Listing = require("./models/listings")
const Review = require("./models/review.js")
const {ListingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/expressError.js");

// Checks if the user is logged in or not
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
      req.flash("error","You must be logged in to create a listing");  
      return res.redirect("/login");
    } 
  next();
}

// Save the original url so that the user redirect to the page they requested for after login
module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

// Checks if user have the appropriate permission to edit listing (Authorized or not)
module.exports.isOwner = async (req,res,next) => {
   let {id} = req.params;
    let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You're not the owner of this lisitng");
    return res.redirect(`/listings/${id}`)
  }
  next();
}

// Checks if user have the appropriate permission to edit review (Authorized or not)
module.exports.isReviewAuthor = async (req,res,next) => {
   let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","You donot have the permission");
    return res.redirect(`/listings/${id}`)
  }
  next();
}



// Checks and ensures that listing data should be in right format
 module.exports.validateListing = (req,res,next) => {
  let result = ListingSchema.validate(req.body) // this will validate all the fields
  if(result.error){
    let errMsg = result.error.details.map((el)=>{el.message}).join(",")
    throw new ExpressError(400,result.error)
  }
  else{
    next()
  }
}

// Checks and ensures that review data should be in right format
module.exports.validateReviews = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};
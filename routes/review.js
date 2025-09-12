const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {validateReviews, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require ("../controllers/reviews.js")


// POST review route
router.post(
  "/:id/reviews",
  isLoggedIn,
  validateReviews,
  wrapAsync(reviewController.createReview)
);

// DELETE review route
router.delete(
  "/:id/reviews/:reviewId",isLoggedIn ,isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;

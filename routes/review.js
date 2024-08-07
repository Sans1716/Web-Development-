const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isAuthenticate, isReviewOwner} = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");

// Reviews:

// POST review Route:
router.post("/",
    isAuthenticate, 
    validateReview, 
    wrapAsync (reviewControllers.addReview)
);

// Delete  review Route:
router.delete("/:reviewId", 
    isAuthenticate, 
    isReviewOwner, 
    wrapAsync(reviewControllers.deleteReview)
);

module.exports = router;
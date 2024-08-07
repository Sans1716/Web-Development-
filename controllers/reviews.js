const Listing = require("../models/listing");
const Review = require("../models/review.js");


module.exports.addReview = async(req,res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "review Created Successfully !!!");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review Deleted Successfully Successfully !!!");
    res.redirect(`/listings/${id}`);
};
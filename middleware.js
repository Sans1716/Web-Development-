const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const expressError = require("./utils/expressError.js");

module.exports.isAuthenticate = (req,res,next)=>{
        // console.log(req.path, "..", req.originalUrl);
        if (req.isAuthenticated()) {
            return next();
        };
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that!");
        res.redirect("/login");
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser.id)){
        req.flash("error","You are not the owner of this listing! ");
        return res.redirect(`/listings/${id}`);
    };

    next();
};

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    };
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        const errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next();
    };
};

module.exports.isReviewOwner = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser.id)){
        req.flash("error","You are not the author of this review! ");
        return res.redirect(`/listings/${id}`);
    };

    next();
};

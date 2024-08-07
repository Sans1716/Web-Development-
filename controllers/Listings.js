const Listing = require("../models/listing");
const multer = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({storage});
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.new = (req,res)=>{
    res.render("listings/New.ejs");
};

module.exports.show = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"} }).populate("owner");
    if(!listing) {
        req.flash("error","Listing you requested for DOES NOT EXIST !!!");
        res.redirect("/listings");
    };
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.create = async (req,res,next)=>{

    try{
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        if(req.file){
        const {path: url, filename} = req.file;
        newListing.image = {url, filename};
        };

        await newListing.save();
        req.flash("success", "New Listing Created !");
        res.redirect("/listings");
    } catch(err){
        console.log(err);
        req.flash("error","Failed to create listing");
        res.redirect("/listings/new");
    }


};

module.exports.edit = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","Listing you requested for DOES NOT EXIST !!!");
        res.redirect("/listings");
    };
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};


module.exports.update = async(req,res)=>{

    const {id} = req.params;
    const updateListing = {...req.body.listing};

    let updatedListing = await Listing.findByIdAndUpdate(
        id,
        updateListing
    );
    if(typeof req.file !== "undefined"){
        
    let url = req.file.path;
    let filename = req.file.filename;

    updatedListing.image = {url,filename};
    await updatedListing.save();
    };

    console.log(updatedListing);
    req.flash("success", "Listing Updated Successfully !!!");
    res.redirect(`/listings/${id}`);
};

module.exports.delete =  async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing Deleted Successfully !!!");
    res.redirect("/listings");
};

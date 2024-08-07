if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
};


const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {validateListing,isAuthenticate, isOwner} = require("../middleware.js");
const listingController = require("../controllers/Listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")
    .get(wrapAsync(listingController.index)
    )
    .post(isAuthenticate, 
        upload.single('listing[image]'),
        validateListing,  
        wrapAsync(listingController.create)
    );
// New Route
router.get("/new", 
    isAuthenticate, 
    listingController.new 
    );

router
    .route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isAuthenticate, 
        isOwner, 
        upload.single('listing[image]'),
        validateListing, 
        wrapAsync( listingController.update)
    )
    .delete(isAuthenticate,
        isOwner, 
        wrapAsync(listingController.delete)
    ); 

// Edit Route
router.get("/:id/edit", 
    isAuthenticate, 
    isOwner, 
    wrapAsync(listingController.edit));

module.exports = router;
const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn , isOwner , validationListing } = require("../middlewares.js");

const listingController = require("../constollers/listings.js")

//Index--> 
router.get("/", wrapAsync(listingController.index));

//New route --> 
router.get("/new",isLoggedIn, listingController.renderNewForm );

//show route --> 
router.get("/:id", wrapAsync(listingController.showListing) );

//Create route
router.post("/", isLoggedIn , validationListing, wrapAsync(listingController.createListing));

//Edit Route-->
router.get("/:id/edit", isLoggedIn , isOwner   ,wrapAsync(listingController.renderEditForm));

//Update rought-->
router.put("/:id",isLoggedIn , isOwner ,  validationListing,   wrapAsync(listingController.updateListing));

//Delete Route-->
router.delete("/:id", isLoggedIn , isOwner , wrapAsync(listingController.destroyListing));

module.exports = router;
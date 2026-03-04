const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn,isOwner,validationListing } = require("../middlewares.js");




//Index--> 
router.get("/", wrapAsync(  async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));




//New route --> 
router.get("/new",isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");

});


//show route --> 
router.get("/:id", wrapAsync( async (req, res) => {
  let {id} = req.params;
   const listing =  await Listing.findById(id).populate("reviews").populate("owner");
   if(!listing){
    req.flash("error" , "Listing does not exist!");
    res.redirect("/listings");
   }
   console.log(listing);
   res.render("listings/show.ejs" ,{ listing })
}));



//Create route
router.post("/", isLoggedIn , validationListing, wrapAsync(async (req, res , next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  //flash message
  req.flash("success" , "New listing created successfully!");
  res.redirect("/listings");
}));



//Edit Route-->
router.get("/:id/edit", isLoggedIn , isOwner   ,wrapAsync( async (req, res) => {
  let {id} = req.params;
   const listing =  await Listing.findById(id);
   if(!listing){
    req.flash("error" , "Listing does not exist!");
    res.redirect("/listings");
   }
   res.render("listings/edit.ejs", { listing });
    // res.redirect("/listings");
}));



//Update rought-->
router.put("/:id",isLoggedIn , isOwner ,  validationListing,   wrapAsync(async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success" , "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
}));


//Delete Route-->
router.delete("/:id", isLoggedIn , isOwner , wrapAsync( async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
   await Review.deleteMany({ _id: { $in: deletedListing.reviews } });
  console.log(deletedListing);
  req.flash("success" , "Listing deleted successfully!");
 res.redirect("/listings");
}));

module.exports = router;
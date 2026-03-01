const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");



//validationListing --> for listing form
const validationListing = (req , res , next) =>{
  // console.log("REQ BODY:", req.body);
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    //  console.log("VALIDATION ERROR:", errMsg); 
    throw new ExpressError(400 ,errMsg);
  }else{
    next();
  }
};




//Index--> 
router.get("/", wrapAsync(  async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));



//New route --> 
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});


//show route --> 
router.get("/:id", wrapAsync( async (req, res) => {
  let {id} = req.params;
   const listing =  await Listing.findById(id).populate("reviews");
   if(!listing){
    req.flash("error" , "Listing does not exist!");
    res.redirect("/listings");
   }
   res.render("listings/show.ejs" ,{ listing })
}));



//Create route
router.post("/",validationListing, wrapAsync(async (req, res , next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  //flash message
  req.flash("success" , "New listing created successfully!");
  res.redirect("/listings");
}));



//Edit Route-->
router.get("/:id/edit", wrapAsync( async (req, res) => {
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
router.put("/:id", validationListing, wrapAsync(async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success" , "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
}));


//Delete Route-->
router.delete("/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
   await Review.deleteMany({ _id: { $in: deletedListing.reviews } });
  console.log(deletedListing);
  req.flash("success" , "Listing deleted successfully!");
 res.redirect("/listings");
}));

module.exports = router;
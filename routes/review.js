const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const  { validationReview, isLoggedIn , isreviewAuthor } = require("../middlewares.js");



//Review Route --> post route 
router.post("/", isLoggedIn  , validationReview  , wrapAsync(async (req, res) => {
  // console.log(req.params.id);
 let listing =  await Listing.findById(req.params.id);
 let newReview = new Review(req.body.review);

 newReview.author = req.user._id;
//  console.log(newReview);

 listing.reviews.push(newReview);

 await newReview.save();
 await listing.save();
//  console.log("New review was added");
//  res.send("Review added successfully");
req.flash("success" , "New review created successfully!");
res.redirect(`/listings/${req.params.id}`);
}));


//Review delete route -->
router.delete("/:reviewId", isLoggedIn,isreviewAuthor , wrapAsync(async (req, res) => {
  let  { id , reviewId} = req.params;
   await  Listing.findByIdAndUpdate (id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}));


               // this is working
// router.all("*splat", (req, res, next) => {
//   next(new ExpressError(404, "Page not Found! Due to wrong URL "));
// });


// router.use((err ,req,res,next) =>{
//   let {statusCode= 500 , message = "Somethig went Wrong!"} = err;
//   res.status(statusCode).render("error.ejs", {err});
//  // res.status(statusCode).send(message);
// });



module.exports = router;





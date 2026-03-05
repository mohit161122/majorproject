const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const  { validationReview, isLoggedIn , isreviewAuthor } = require("../middlewares.js");

const reviewController = require("../constollers/review.js")



//Review Route --> post route 
router.post("/", isLoggedIn  , validationReview  , wrapAsync(reviewController.createReview));


//Review delete route -->
router.delete("/:reviewId", isLoggedIn,isreviewAuthor , wrapAsync(reviewController.destroyReview));


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





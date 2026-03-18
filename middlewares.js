const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;      //after logion user will be redirected to the page he wanted to access before login
    req.flash("error" , "You must be signed in to create a new listing!");
    return res.redirect("/login");
  }
  next();
}


module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner =   async (req, res, next) =>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if( !listing.owner._id.equals(res.locals.currentUser._id)){
    req.flash("error" , "You are not the Owner of this listings!");
     return res.redirect(`/listings/${id}`);
  }

next();
};


//validationListing --> for listing form
module.exports.validationListing = (req , res , next) =>{
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



//validationListing --> for Review
module.exports.validationReview =   async (req, res, next) =>{
  // console.log("REQ BODY:", req.body);
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    //  console.log("VALIDATION ERROR:", errMsg); 
    throw new ExpressError(400 ,errMsg);
  }else{
    next();
  }
};



module.exports.isreviewAuthor =   async (req, res, next) =>{
  let { id,  reviewId } = req.params;
  let review = await Review.findById(reviewId );
  if( !review.author.equals(res.locals.currentUser._id)){
    req.flash("error" , "You are not the Author of this review!");
     return res.redirect(`/listings/${id}`);
  }

next();
};
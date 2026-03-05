const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn , isOwner , validationListing } = require("../middlewares.js");

const listingController = require("../constollers/listings.js")

// for image uploding
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// //Index-->  1
// router.get("/", wrapAsync(listingController.index));

// //New route --> 2
// router.get("/new",isLoggedIn, listingController.renderNewForm );

// //show route --> 3
// router.get("/:id", wrapAsync(listingController.showListing) );

// //Create route--> 1
// router.post("/", isLoggedIn , validationListing, wrapAsync(listingController.createListing));

// //Edit Route--> 4
// router.get("/:id/edit", isLoggedIn , isOwner   ,wrapAsync(listingController.renderEditForm));

// //Update rought-->3
// router.put("/:id",isLoggedIn , isOwner ,  validationListing,   wrapAsync(listingController.updateListing));

// //Delete Route-->3
// router.delete("/:id", isLoggedIn , isOwner , wrapAsync(listingController.destroyListing));


                 // or 
                 
                 //route - 1
  router.route("/")
  .get( wrapAsync(listingController.index))
  //.post( isLoggedIn , validationListing, wrapAsync(listingController.createListing));
  .post( upload.single("listing[image]"), (req,res) => {
        res.send(req.file)
  });
 
               //route 2
  router.get("/new",isLoggedIn, listingController.renderNewForm );

               //route  - 3
  router.route("/:id")
  .get( wrapAsync(listingController.showListing) )
  .put(isLoggedIn , isOwner ,  validationListing,   wrapAsync(listingController.updateListing))
  .delete( isLoggedIn , isOwner , wrapAsync(listingController.destroyListing));

          //route-4
   router.get("/:id/edit", isLoggedIn , isOwner   ,wrapAsync(listingController.renderEditForm));

module.exports = router;
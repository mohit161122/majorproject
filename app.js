const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema , reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");

const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");

// for --> coockies
const session = require("express-session");

//for flash messages
const flash = require("connect-flash");







// mongosh --> 
main().then((res) => {
    console.log("Connected to DB")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}




app.set("view engine" , "ejs" );
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());  
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname , "/public")));


//coockies -->started
const sessionOptions= {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookies: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000 ,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
 };

 app.get("/", (req, res) => {
   res.send("Game is started ");
 });



app.use(session(sessionOptions));

//flash
app.use(flash());
app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});





//listings routes
app.use("/listings", listings);
//reviews routes
app.use("/listings/:id/reviews" , reviews );



               // this is working
app.all("*splat", (req, res, next) => {
  next(new ExpressError(404, "Page not Found! Due to wrong URL "));
});


app.use((err ,req,res,next) =>{
  let {statusCode= 500 , message = "Somethig went Wrong!"} = err;
  res.status(statusCode).render("error.ejs", {err});
 // res.status(statusCode).send(message);
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});




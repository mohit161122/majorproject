const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");


// mongosh
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
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Game is started");
});

//Index
app.get("/listings",  async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});


//New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});



//show route
app.get("/listings/:id", async (req, res) => {
  let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render("listings/show.ejs" ,{ listing })
});

//Create route
app.post("/listings", async (req, res) => {
  // let {title ,description ,image ,price , country , location } = req.body;
  //or
 const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render("listings/edit.ejs", { listing });
    // res.redirect("/listings");
});

//Update rought
app.put("/listings/:id", async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
});


// app.get('/testlisting', async (req, res) => {
//   let sampleListings = new Listing ({
//     tital: "My new Villa",
//     description:  "by the beach"  ,
//     prices:  1200  , 
//     location:   "Calangute Goa" ,
//     country : "India",
//   });

//   await sampleListings.save();
//   console.log("sample was saved");
//   res.send("sacessfully testing ");
// });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
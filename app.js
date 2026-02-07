const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");


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

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.get('/listings',  async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
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
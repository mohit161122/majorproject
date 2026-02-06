const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");


// mongosh
main().then((res) => {
    console.log("Connected to DB")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/testListing', async (req, res) => {
  let sampleListing = new Listing({
    title: "My new Villa",
    description: "By the beach",
    price: 1200,
    location: "Caslangute , Goa",
    country: "India", 
  });
 await sampleListing.save();
 console.log("sample was saved");
 res.send("sucessfull testing");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
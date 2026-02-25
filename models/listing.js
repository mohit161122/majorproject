const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title: {
        type:String,
        required:true,
    },
    description: String,
    image: {
        filename: String,
        url: String,
    },
    price: Number,
    location:String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "reviews",
        }
    ]
});``

const Listing = mongoose.model("listings" , listingSchema ); 
module.exports = Listing;
const mongoose = require('mongoose');
// const review = require('./review.js');
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
        },

    ],
});

listingSchema.post("findOneAndDelete", async  (listing) => {
    if(listing) {
        const review = require('./review.js');
        await Review.deleteMany({ _id: {$in : listing.reviews } });
    }
});

const Listing = mongoose.model("listings" , listingSchema ); 
module.exports = Listing;
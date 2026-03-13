const { ref } = require('joi');
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
        url:String,
        filename: String,
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
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    category: {
        type: String,
        enum: ["mountains" , " arctic" , " farms" , "deserts"]
    },
});

listingSchema.post("findOneAndDelete", async  (listing) => {
    if(listing) {
        const Review = require('./review.js');
        await Review.deleteMany({ _id: {$in : listing.reviews } });
    }
});

const Listing = mongoose.model("listings" , listingSchema ); 
module.exports = Listing;
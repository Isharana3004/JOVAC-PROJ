const mongoose = require("mongoose");


const priceSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true
        },

        platform: {
            type: String,
            required: true,
            enum: [
                "Amazon",
                "Flipkart",
                "Myntra"
            ]
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        mrp: {
            type: Number,
            default: 0,
            min: 0
        },

        url: {
            type: String,
            default: ""
        },

        available: {
            type: Boolean,
            default: false
        },

        rating: {
            type: Number,
            default: 0
        },

        ratingCount: {
            type: Number,
            default: 0
        },

        image: {
            type: String,
            default: ""
        },

        sla: {
            type: String,
            default: ""
        },

        checkedAt: {
            type: Date,
            default: Date.now,
            index: true
        }
    },

    {
        timestamps: true
    }
);


// Same product + same platform should not
// have duplicate current price records
priceSchema.index(
    {
        productId: 1,
        platform: 1
    }
);


module.exports =
    mongoose.model(
        "Price",
        priceSchema
    );
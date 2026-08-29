const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        brand: {
            type: String,
            default: "",
            trim: true
        },

        model: {
            type: String,
            default: "",
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            default: "",
            trim: true
        }
    },

    {
        timestamps: true
    }
);


// Useful for searching products
productSchema.index({
    name: "text",
    brand: "text",
    model: "text"
});


module.exports =
    mongoose.model(
        "Product",
        productSchema
    );
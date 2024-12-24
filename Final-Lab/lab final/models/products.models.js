const mongoose = require("mongoose")
let productSchema = new mongoose.Schema({
    title : String,
    description : String,
    original_price : Number, 
    discount_price : Number,
    discount : String,
    image : String 
})



let Product = mongoose.model("Product",productSchema)
module.exports = Product

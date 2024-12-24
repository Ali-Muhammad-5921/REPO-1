const mongoose = require("mongoose")
let categorySchema = new mongoose.Schema({
    categoryName : String
})
let Category = mongoose.model("Category",categorySchema)
module.exports = Category
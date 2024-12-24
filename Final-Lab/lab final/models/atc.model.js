const mongoose = require("mongoose")
let atcSchema = new mongoose.Schema({
    name : String,
    description : String,
    price : Number,
    size : String,
    quantity : Number,
    image : String
})
let ATC = mongoose.model("ATC",atcSchema)
module.exports = ATC
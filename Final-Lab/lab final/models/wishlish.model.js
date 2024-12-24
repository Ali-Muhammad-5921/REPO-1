const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;

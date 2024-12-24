const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/khaas', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.log("Failed to connect to MongoDB", err);
  });

// Schema and Model
const cartSchema = new mongoose.Schema({
  description: String,
  price: Number,
});

const Cart = mongoose.model('Cart', cartSchema);

// Route to handle form submission
app.post('/add-to-cart', async (req, res) => {
  try {
    const newItem = new Cart({
      description: req.body.description,
      price: req.body.price,
    });

    // Using async/await to save the item
    await newItem.save();
    res.send('Item added to cart!');
  } catch (err) {
    res.status(500).send('Failed to add item.');
    console.error(err);
  }
});

module.exports = app;

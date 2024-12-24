const express = require('express');
const router = express.Router();
const Product = require('../models/products.models'); // Adjust path to your Product schema

// Route to render the main page with products
router.get('/', async (req, res) => {
    try {
        const product = await Product.find(); // Fetch all products from the database
      //  console.log('Products fetched:', product); 
        res.render('pages/main/home', { product }); // Pass products to EJS template
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching products');
    }
});

    



module.exports = router;

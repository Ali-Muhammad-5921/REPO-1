const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const Product = require("../../models/products.models");
const Category = require("../../models/category.model");
const ATC = require("../../models/atc.model");
const wishlist = require("../../models/wishlish.model")
const {restrictToLoggedInUserOnly} = require("../../middlewares/auth");
const mongoose = require('mongoose');


router.use(cookieParser());

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });

// Static folder for uploads
router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

router.get("/admin/products", restrictToLoggedInUserOnly, async (req, res) => {
    try {
        const search = req.query.search || ""; // Search keyword
        const sort = req.query.sort || "title"; // Sort field (default: title)
        const order = req.query.order === "desc" ? -1 : 1; // Sort order (default: ascending)

        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // Current page, default to 1
        const limit = parseInt(req.query.limit) || 2; // Products per page, default to 2
        const skip = (page - 1) * limit; // Calculate how many products to skip

        // Build search conditions
        const searchRegex = new RegExp(search, "i"); // Case-insensitive search
        const searchConditions = {
            $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
            ],
        };

        // If search is a valid number (e.g., price), apply it to `original_price`
        if (search && !isNaN(search)) {
            searchConditions.$or.push({ original_price: parseFloat(search) });
        }

        // Sort options
        const sortOptions = { [sort]: order }; // Dynamic sorting

        // Fetch total product count for the current search
        const totalProducts = await Product.countDocuments(searchConditions);

        // Validate page existence
        if (skip >= totalProducts && totalProducts > 0) {
            throw new Error("Page not found :(");
        }

        // Fetch products with search, sort, and pagination
        const products = await Product.find(searchConditions)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        // Render products page
        res.render("pages/admin/products", {
            layout: "admin-layout.ejs",
            products,
            search,
            sort,
            order,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
});






// Other Product Routes (Create, Edit, Delete)
router.get("/admin/products/create",restrictToLoggedInUserOnly ,(req, res) => {
    res.render("pages/admin/product-form", { layout: "admin-layout.ejs" });
});

router.post("/admin/products/create", upload.single("image"), async (req, res) => {
    let newProduct = new Product(req.body);
    if (req.file) newProduct.image = req.file.filename;
    newProduct.featured = Boolean(req.body.featured);
    await newProduct.save();
    res.redirect("/admin/products");
});

router.get("/admin/products/edit/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("pages/admin/edit-form", { layout: "admin-layout.ejs", product });
});

router.post("/admin/products/edit/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    product.title = req.body.title;
    product.description = req.body.description;
    product.original_price = req.body.original_price;
    product.discount_price = req.body.discount_price;
    product.featured = Boolean(req.body.featured);
    await product.save();
    res.redirect("/admin/products");
});

router.get("/admin/products/delete/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin/products");
});

// Categories CRUD (No Change)
router.get("/admin/categories", async (req, res) => {
    const categories = await Category.find();
    res.render("pages/admin/category", { layout: "admin-layout.ejs", categories });
});

router.get("/admin/category/create", (req, res) => {
    res.render("pages/admin/category-form", { layout: "admin-layout.ejs" });
});

router.post("/admin/category/create", async (req, res) => {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.redirect("/admin/categories");
});

router.get("/admin/category/edit/:id", async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.render("pages/admin/category-edit-form", { layout: "admin-layout.ejs", category });
});

router.post("/admin/category/edit/:id", async (req, res) => {
    const category = await Category.findById(req.params.id);
    category.categoryName = req.body.categoryName;
    await category.save();
    res.redirect("/admin/categories");
});

router.get("/admin/category/delete/:id", async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect("/admin/categories");
});

router.get("/admin/products/add-to-cart/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = mongoose.Types.ObjectId.isValid(id)
            ? await Product.findById(id)
            : await Product.findOne({ image: id });

        if (!product) {
            return res.status(404).send("Product not found.");
        }

        res.render("pages/admin/add-to-cart-form", { layout: "admin-layout.ejs", product });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error.");
    }
});

function formatPrice(price) {
    const validPrice = parseFloat(price) || 0; // Ensure it's a valid number
    return `$${validPrice.toFixed(2)}`; // Format as currency
}


// Add Product to Cart
router.post("/admin/products/add-to-cart/:id", async (req, res) => {
    try {
        const { size, quantity } = req.body; // Extract size and quantity from the form data
        const product = await Product.findById(req.params.id); // Fetch product details

        if (!product) {
            return res.status(404).send("Product not found.");
        }

        // Check if the product already exists in the cart with the same size
        const existingCartItem = await ATC.findOne({ name: product.name, size: size });
        if (existingCartItem) {
            existingCartItem.quantity += parseInt(quantity, 10);
            await existingCartItem.save();
        } else {
            // Create a new cart item
            const newCartItem = new ATC({
                name: product.name,
                description: product.description,
                price: product.discount_price,
                size: size,
                quantity: parseInt(quantity, 10),
                image: product.image, // Assuming 'product.image' contains the product image URL
            });

            // Save the new item to the ATC collection
            await newCartItem.save();
        }

        // Redirect to the products page or show a success message
        res.redirect("/admin/products");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error.");
    }
});

// View Cart
router.get("/admin/cart", async (req, res) => {
    try {
        const cartItems = await ATC.find(); // Get all cart items
        const cartTotal = cartItems.reduce((total, item) => {
            const itemPrice = parseFloat(item.price) || 0;
            const itemQuantity = parseInt(item.quantity, 10) || 0;
            return total + itemPrice * itemQuantity;
        }, 0);
        
        res.render("pages/admin/atc", {
            layout: "cart-layout.ejs",
            cartItems: cartItems,
            cartTotal: formatPrice(cartTotal) || 0, // Pass formatted cart total
            formatPrice, // Pass the formatPrice function for use in templates
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error.");
    }
});

// Delete Cart Item
router.delete("/admin/cart/:id", async (req, res) => {
    try {
        await ATC.findByIdAndDelete(req.params.id); // Delete the cart item by ID
        res.redirect("/admin/cart"); // Redirect back to the cart page
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error.");
    }
});

// Update Cart Item Quantity
router.post("/admin/cart/update/:id", async (req, res) => {
    try {
        const { action } = req.body;
        const item = await ATC.findById(req.params.id);

        if (!item) {
            return res.status(404).send("Cart item not found.");
        }

        if (action === "increase") {
            item.quantity += 1;
        } else if (action === "decrease" && item.quantity > 1) {
            item.quantity -= 1;
        }

        await item.save(); // Save the updated item
        res.redirect("/admin/cart"); // Redirect back to the cart page
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error.");
    }
});

// Authentication Routes (No Change)
router.get("/admin/signup", (req, res) => {
    res.render("pages/admin/signUp", { layout: "LI.ejs" });
});

router.get("/admin/login", (req, res) => {
    res.render("pages/admin/login", { layout: "LI.ejs" });
});

// Example of login route
router.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    // Check if the username and password are valid
    const user = await User.findOne({ username, password }); // Example logic

    if (!user) {
        return res.status(400).send("Invalid credentials");
    }

    // Set user session using cookies
    res.cookie('uid', user.id, { httpOnly: true }); // Set cookie with user ID
    res.redirect("/admin/products"); // Redirect to products page
});

// wishlist
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));


router.get("/wishlist/add/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = mongoose.Types.ObjectId.isValid(id)
            ? await Product.findById(id)
            : await Product.findOne({ image: id });

        if (!product) {
            return res.status(404).send("Product not found.");
        }

        // Redirect to the wishlist page (or you can modify this based on your design)
        res.render("pages/admin/wishlist", { layout: "l.ejs", product });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error.");
    }
});

// Post route to actually add to wishlist
router.post("/wishlist/add/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send("Product not found.");
        }

        // Check if the product already exists in the wishlist
        const existingWishlistItem = await WishlistItem.findOne({ product: product.id });

        if (existingWishlistItem) {
            return res.redirect('/?message=Product%20already%20in%20wishlist');
        }

        // Add the product to the wishlist
        const newWishlistItem = new Wishlist({
            product: product.id,
            name: product.name,
            description: product.description,
            price: product.original_price,
            image: product.image,
        });

        await newWishlistItem.save(); // Save the new wishlist item

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error.");
    }
});




// View Wishlist
// View Wishlist
// router.get("/wishlist", async (req, res) => {
//     try {
//         // Get all wishlist items from the database
//         const wishlistItems = await Wishlist.find(); 
        
//         // If no items in the wishlist, set wishlistItems to an empty array
//         if (!wishlistItems) {
//             wishlistItems = [];
//         }

//         // Render the wishlist page and pass the wishlistItems to the view
//         res.render("pages/admin/wishlist", {
//             layout: "cart-layout.ejs",
//             wishlistItems: wishlistItems, // Ensure wishlistItems is passed to the view
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error.");
//     }
// });


// // Delete Wishlist Item
// router.delete("/wishlist/:id", async (req, res) => {
//     try {
//         const deletedItem = await Wishlist.findByIdAndDelete(req.params.id); // Delete the wishlist item by ID
//         if (!deletedItem) {
//             return res.status(404).send("Item not found.");
//         }
//         // Redirect back to the wishlist page with a success message
//         res.redirect("/wishlist?message=Product%20removed%20from%20wishlist"); // URL encode the message
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error.");
//     }
// });
// router.get("/add-to-wishlist/:id",(req,res)=>{
//     let wishlist = req.cookies.wishlist; // Read the wishlist cookie
//   console.log("Initial Wishlist:", wishlist);
  
//   if (wishlist && typeof wishlist === 'string') {
//     wishlist = wishlist.trim(); 
//     console.log("Trimmed Wishlist:", wishlist);
//     try {
//       wishlist = JSON.parse(wishlist); // Parse the wishlist JSON
//     } catch (err) {
//       console.error("Error parsing wishlist JSON:", err.message);
//       wishlist = []; // If parsing fails, reset to an empty array
//     }
//   } else {
//     wishlist = []; // Initialize as an empty array if no cookie exists
//   }
  
//   // Check if the product ID is already in the wishlist
//   if (!wishlist.includes(req.params.id)) {
//     wishlist.push(req.params.id); // Add the product ID if it's not already in the wishlist
//   }
  
//   console.log("Updated Wishlist:", wishlist);
//   res.cookie("wishlist", JSON.stringify(wishlist)); // Store the updated wishlist back as a cookie
//   res.redirect("/"); // Redirect back to the homepage or another relevant page
//   });
  
//   router.get("/myWishlist", async (req, res) => {
//     let wishlist = req.cookies.wishlist;
  
//     // Parse the wishlist cookie
//     if (wishlist && typeof wishlist === 'string') {
//       wishlist = wishlist.trim();
//       try {
//         wishlist = JSON.parse(wishlist);
//       } catch (err) {
//         console.error("Error parsing wishlist JSON:", err.message);
//         wishlist = [];
//       }
//     } else {
//       wishlist = [];
//     }
  
//     // Fetch product details from the 'category' collection using the product IDs
//     let products = await Product.find({ _id: { $in: wishlist } });
  
//     // Convert Mongoose objects to plain objects for rendering
//     let wishlistProducts = products.map((product) => {
//       return product.toObject();
//     });
  
//     console.log("Wishlist Products:", wishlistProducts);
  
//     // Render the wishlist page
//     return res.render("wishlist", { products: wishlistProducts });
//   });
  
//   router.get("/remove-from-wishlist/:id", (req, res) => {
//     let wishlist = req.cookies.wishlist;
  
//     if (wishlist && typeof wishlist === 'string') {
//       wishlist = wishlist.trim();
//       try {
//         wishlist = JSON.parse(wishlist);
//       } catch (err) {
//         console.error("Error parsing wishlist JSON:", err.message);
//         wishlist = [];
//       }
//     } else {
//       wishlist = [];
//     }
  
//     // Remove the product from the wishlist
//     wishlist = wishlist.filter(id => id !== req.params.id);
  
//     // Update the cookie
//     res.cookie("wishlist", JSON.stringify(wishlist));
  
//     // Redirect back to the wishlist page
//     res.redirect("/wishlist");
//   });

module.exports = router;

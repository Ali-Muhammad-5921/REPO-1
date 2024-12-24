const express = require("express");
let app = express();

const layout = require("express-ejs-layouts")
app.use(layout);

const app1 = require("./app.js");

const userRoute = require("./routes/user.js")

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(express.static("uploads"))

app.use(express.urlencoded());

const mongoose = require("mongoose");
let connectionString = "mongodb://localhost:27017/khaas";
mongoose.connect(connectionString)
    .then(() => {
        console.log(`Connected To: ${connectionString}`);
    })
    .catch((err) => {
        console.log("Failed to connect to MongoDB:", err);
    });


let productsRouter = require("./routes/admin/products.router");
app.use(productsRouter);

app.get("/contact-us",(req,res)=>{
    res.send("hi in contact us  !") 
})

app.use("/user",userRoute)

const mainRoutes = require('./routes/main.routes.js');
 // Adjust path as needed
app.use('/', mainRoutes);



app.get("/",(req,res)=>{
    res.render("pages/main/home")
})

app.use(app1);

app.listen(5001,()=>{
    console.log("server started at local host 5001")
})
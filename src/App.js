// app.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const advertiserRoutes = require("./Routes/advertiserController"); // Adjust path as necessary
const {
  createTourismGoverner,
  createAdmin,
  createProduct,
  createCategory, 
  getCategory, 
  updateCategory, 
  deleteCategory,
  searchProductAdmin,
} = require("./Routes/adminController");

const {
  getActivities,
  getitineraries,
  filterActivity,
  searchProductTourist,
} = require("../src/Routes/touristController");

const {filterActivityGuest}= require('./Routes/guestController');
const {searchProductSeller}= require('./Routes/sellerController');

// Load environment variables from .env file
dotenv.config();

// App variables
const app = express();
const port = process.env.PORT || 3000;
const MongoURI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use("/api", advertiserRoutes); // Use advertiser routes under '/api'

// MongoDB Connection
mongoose
  .connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.error(err));

// Basic route for testing
app.get("/home", (req, res) => {
  res.status(200).send("You have everything installed!");
});

app.use(express.json());

app.post("/tourism-governor", createTourismGoverner);
app.post("/admin", createAdmin);
app.post("/product", createProduct);
app.get("/activities", getActivities);
app.get("/itineraries", getitineraries);

app.post("/addCategory",createCategory);
app.get("/viewCategory",getCategory);
app.put("/updateCategory/:categoryId",updateCategory);
app.delete("/deleteCategory/:categoryId",deleteCategory);
app.get("/filterActivity",filterActivity);
app.get("/filterActivityGuest",filterActivityGuest);
app.get("/searchProductTourist",searchProductTourist);
app.get("/searchProductAdmin",searchProductAdmin);
app.get("/searchProductSeller",searchProductSeller);
// app.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  createActivity,
  updateActivity,
  deleteActivity,
  getlistActivities,
  viewCreatedActivities,
} = require("./Routes/advertiserController"); // Adjust path as necessary

const itinerary = require("./Models/Itinerary");
const {
  viewAllPlaces,
  createPlaces,
  getPlaces,
  updatePlace,
  deletePlace,
  createTag,
} = require("./Routes/tourismgovernerController");
const {
  filterActivityGuest,
  guestFilterItineraries,
  register,
} = require("./Routes/guestController");
const {
  searchProductSeller,
  getSeller,
  createProductSeller,
  updateProductSeller,
  createSeller,
  updateSeller,
  filterProductSeller,
  getSellerById,
} = require("./Routes/sellerController");
const {
  createPrefTag,
  getPrefTag,
  updatePrefTag,
  deletePrefTag,
  sortProducts,
  gettourism,
} = require("./Routes/adminController");

const {
  createAdmin,
  createProduct,
  updateProduct,
  getProductsAdmin,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  searchProductAdmin,
  deleteAccount,
  createTourismGoverner,
} = require("./Routes/adminController");

const {
  getActivities,
  filterActivity,
  searchProductTourist,
  getProducts,
  filterProducts,
  touristFilterItineraries,
  search,
  createTourist,
  getTouristProfile,
  updateTouristProfile,
  filterHistoricalByTag,
} = require("../src/Routes/touristController");

const {
  createTourGuideProfile,
  getTourGuides,
  readTourGuideProfile,
  createItinerary,
  getItineraries,
  updateItinerary,
  deleteItinerary,
  viewCreatedItineraries,
} = require("../src/Routes/tourguideController");

//tourguide tourist itinerary
const {
  createTouristItinerary,
  readTouristItinerary,
  updateTouristItinerary,
  deleteTouristItinerary,
  getItinerariesByDateRange,
} = require("../src/Routes/tourguideController");

// Load environment variables from .env file
dotenv.config();

// App variables
const app = express();
const cors = require("cors");

const port = process.env.PORT || 3000;
const MongoURI = process.env.MongoURI;

// Middleware
app.use(express.json());

app.use(cors());
//app.use("/api", advertiserRoutes); // Use advertiser routes under '/api'

// MongoDB Connection
mongoose
  .connect(MongoURI)
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

app.post("/addTourist", createTourist);
app.post("/register", register);

app.get("/getTourist", getTouristProfile);
app.put("/updateTourist", updateTouristProfile);

app.post("/addprofiles", createProfile);
app.get("/profiles", getProfile);
app.put("/updateprofiles/:id", updateProfile);
app.delete("/deleteprofiles/:id", deleteProfile);
app.post("/addactivity", createActivity);
app.put("/updateactivity/:id", updateActivity);
app.delete("/deleteactivity/:id", deleteActivity);
app.get("/getactivity", getlistActivities);
app.get("/viewactivity", viewCreatedActivities);

app.put("/updateProduct/:id", updateProduct);

app.get("/activities", getActivities);
app.get("/itineraries", getItineraries);

app.get("/TourGuide", getTourGuides);
app.post("/TourGuideProfile/:tourGuideID", createTourGuideProfile);
app.get("/TourGuideProfile/:tourGuideID", readTourGuideProfile);
app.patch("/TourGuideProfile/:tourGuideID", createTourGuideProfile);

app.get("/products", getProducts);
app.get("/productsAdmin", getProductsAdmin);

app.post("/addCategory", createCategory);
app.get("/viewCategory", getCategory);
app.put("/updateCategory/:categoryId", updateCategory);
app.delete("/deleteCategory/:categoryId", deleteCategory);
app.get("/filterActivity", filterActivity);
app.get("/filterActivityGuest", filterActivityGuest);
app.get("/searchProductTourist", searchProductTourist);
app.get("/searchProductAdmin", searchProductAdmin);

app.get("/viewAllPlaces", viewAllPlaces);
app.post("/addPlace", createPlaces);
app.get("/Places", getPlaces);
app.put("/updatePlace/:id", updatePlace);
app.delete("/deletePlace/:id", deletePlace);
app.post("/addTourismGoverner", createTourismGoverner);
app.post("/addTag", createTag);

app.use(express.json());
app.post("/addItinerary", createItinerary);
app.get("/Itinerary", getItineraries);
app.put("/updateItinerary/:id", updateItinerary);
app.delete("/deleteItinerary/:id", deleteItinerary);
app.get("/listofiternaries", viewCreatedItineraries);

app.use(express.json());
app.post("/addPreferancetag", createPrefTag);
app.get("/getPreferancetag", getPrefTag);
app.put("/updateTags", updatePrefTag);
app.delete("/deletePrefTag", deletePrefTag);
app.get("/search", search);
app.get("/tourist/filter-itineraries", touristFilterItineraries);
app.get("/guest/filter-itineraries", guestFilterItineraries);

app.post("/createTouristItineraries", createTouristItinerary);
app.get("/getTouristItineraries/:id", readTouristItinerary);
app.put("/updateTouristItineraries/:id", updateTouristItinerary);
app.delete("/deleteTouristItineraries/:id", deleteTouristItinerary);
app.get("/tourist-itineraries", getItinerariesByDateRange);
app.get("/filterProducts", filterProducts);
app.get("/filterHistoricalTags", filterHistoricalByTag);

//seller Controller
app.post("/createSeller", createSeller);
app.get("/getSeller", getSeller);
app.put("/updateSeller/:id", updateSeller);
app.get("/searchProductSeller", searchProductSeller);
app.get("/filterProduct", filterProductSeller);
app.get("/sortProducts", sortProducts);
app.post("/createproduct", createProductSeller);
app.put("/editproduct/:id", updateProductSeller);
// Add the new route to fetch seller by username
app.get("/getSellerById/:id", getSellerById);

//Admin Controlleryyy
app.delete("/deleteAccount", deleteAccount);
app.post("/tourismgovernor", createTourismGoverner);
app.post("/admin", createAdmin);

app.get("/get", gettourism);

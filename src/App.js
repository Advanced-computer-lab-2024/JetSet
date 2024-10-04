// app.js


const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const advertiserRoutes = require("./Routes/advertiserController"); // Adjust path as necessary
const itinerary = require('./Models/Itinerary');
const {viewAllPlaces,createPlaces,getPlaces, updatePlace, deletePlace} = require("./Routes/placesController");
const {createTag} = require("./Routes/tourismgovernerController");
const {filterActivityGuest} = require("./Routes/guestController");
const {searchProductSeller} = require("./Routes/sellerController");

const {
  createAdmin,
  createProduct,
  createCategory, 
  getCategory, 
  updateCategory, 
  deleteCategory,
  searchProductAdmin,
  deleteAccount,
} = require("./Routes/adminController");

const {
  getActivities,
  getitineraries,
  filterActivity,
  searchProductTourist,
} = require("../src/Routes/touristController");

const {
  createTourGuideProfile,
  getTourGuides,
  readTourGuideProfile,
  createItinerary,
   getItineraries,
    updateItinerary, 
     deleteItinerary,
     viewCreatedItineraries
} = require("../src/Routes/tourguideController");


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
    })
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

app.get("/TourGuide",getTourGuides)
app.post("/TourGuideProfile/:tourGuideID",createTourGuideProfile);
app.get("/TourGuideProfile/:tourGuideID",readTourGuideProfile);
app.patch("/TourGuideProfile/:tourGuideID",createTourGuideProfile);
app.post("/createTourGuide",createTourGuide)
app.delete("/deleteAccount",deleteAccount);

app.post("/addCategory",createCategory);
app.get("/viewCategory",getCategory);
app.put("/updateCategory/:categoryId",updateCategory);
app.delete("/deleteCategory/:categoryId",deleteCategory);
app.get("/filterActivity",filterActivity);
app.get("/filterActivityGuest",filterActivity);
app.get("/searchProductTourist",searchProductTourist);
app.get("/searchProductAdmin",searchProductAdmin);
app.get("/searchProductSeller",searchProductTourist);



app.get("/viewAllPlaces",viewAllPlaces);
app.post("/addPlace",createPlaces);
app.get("/Places",getPlaces);
app.put("/updatePlace/:id",updatePlace);
app.delete("/deletePlace",deletePlace);
app.post("/addTourismGoverner",createTourismGoverner);
app.post("/addTag",createTag);



app.use(express.json())
app.post("/addItinerary",createItinerary);
app.get("/Itinerary",getItineraries );
app.put("/updateItinerary/:id",updateItinerary );
app.delete("/deleteItinerary/:id", deleteItinerary );
app.get("/listofiternaries",viewCreatedItineraries );


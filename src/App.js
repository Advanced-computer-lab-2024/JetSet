// app.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
require('dotenv').config();



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
  getAdsById,
  changePasswordAdvertiser,
  getadvertiser,
} = require("./Routes/advertiserController"); // Adjust path as necessary

const itinerary = require("./Models/Itinerary");
const {
  viewAllPlaces,
  createPlaces,
  getPlaces,
  AllTags,
  updatePlace,
  deletePlace,
  createTag,
  changePasswordTourismGoverner,
} = require("./Routes/tourismgovernerController");
const {
  filterActivityGuest,
  guestFilterItineraries,
  register,
  getActivitiesByCategoryForGuest
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
  changePasswordSeller,
} = require("./Routes/sellerController");
const {
  createPrefTag,
  getPrefTag,
  updatePrefTag,
  deletePrefTag,
  sortProducts,
  gettourism,
  changePasswordAdmin,
  getadmin,
} = require("./Routes/adminController");

const {
  createAdmin,
  updateProduct,
  getProductsAdmin,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  searchProductAdmin,
  deleteAccount,
  createTourismGoverner,
  viewAllComplaints,
} = require("./Routes/adminController");

const {
  getActivitiesByCategory,
  shareItem,
  SortActivities,
  filterActivity,
  searchProductTourist,
  getProducts,
  filterProducts,
  touristFilterItineraries,
  createTourist,
  getTouristProfile,
  updateTouristProfile,
  filterHistoricalByTag,
  getTourist,
  SortItineraries,
  seacrhPlace,
  searchActivity,
  searchItinerary,
  rateandcommentItinerary,
  rateandcommentactivity,
  addRatingAndComment,
  updateTouristPreferences,
  changePasswordTourist,

  setPreferredCurrency,
  addLoyaltyPoints,
  fileComplaint,
  viewMyComplaints,
  redeemMyPoints,
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
  getItinerariesByDateRange,
  gettourguide,
  activateItinerary,
  deactivateItinerary,
  changePasswordTourGuide,
} = require("../src/Routes/tourguideController");

//tourguide tourist itinerary
const {
  createTouristItinerary,
  readTouristItinerary,
  updateTouristItinerary,
  deleteTouristItinerary,
} = require("../src/Routes/tourguideController");

// Load environment variables from .env file
 dotenv.config();

// App variables
const app = express();

app.use(express.json());

const MongoURI= process.env.MONGO_URI;
const port= process.env.PORT;
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
app.get("/activities/by-category",getActivitiesByCategory);
app.post("/share",shareItem);
app.post("/addTourist", createTourist);
app.post("/register", register);

app.get("/getTourist/:id", getTouristProfile);
app.put("/updateTourist/:id", updateTouristProfile);

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

app.get("/itineraries", getItineraries);

app.get("/TourGuide", getTourGuides);
app.post("/TourGuideProfile", createTourGuideProfile);
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
app.get("/Tags", AllTags);
app.post("/complaints/:touristId", fileComplaint);
app.get("/complaints/:touristId",viewMyComplaints)
app.get("/viewAllComplaints", viewAllComplaints);
// const response = await axios.get('http://localhost:3000/viewAllComplaints');

app.use(express.json());
app.post("/addItinerary", createItinerary);
app.get("/Itineraries", getItineraries);
app.put("/updateItinerary/:id", updateItinerary);
app.delete("/deleteItinerary", deleteItinerary);
app.get("/listofiternaries/:id", viewCreatedItineraries);
app.post("/activateItinerary/:id",activateItinerary);
app.post("/deactivateItinerary/:id",deactivateItinerary);

app.use(express.json());
app.post("/addPreferancetag", createPrefTag);
app.get("/getPreferancetag", getPrefTag);
app.put("/updateTags", updatePrefTag);
app.delete("/deletePrefTag", deletePrefTag);
app.get("/tourist/filter-itineraries", touristFilterItineraries);
app.get("/guest/filter-itineraries", guestFilterItineraries);

app.post("/createTouristItineraries/:id", createTouristItinerary);
app.get("/getTouristItineraries", readTouristItinerary);
app.put("/updateTouristItineraries/:id", updateTouristItinerary);
app.delete("/deleteTouristItineraries/:id", deleteTouristItinerary);

app.get("/tourist-itineraries", getItinerariesByDateRange);
app.get("/filterProducts", filterProducts);
app.get("/filterHistoricalTags", filterHistoricalByTag);
app.get("/activities/category",getActivitiesByCategoryForGuest);


//seller Controller
app.post("/createSeller", createSeller);
app.get("/getSeller", getSeller);
app.put("/updateSeller/:id", updateSeller);
app.get("/searchProductSeller", searchProductSeller);
app.get("/filterProduct", filterProductSeller);
app.get("/sortProducts", sortProducts);
app.post("/createproduct", createProductSeller);
app.put("/editproduct/:id", updateProductSeller); //update rating for product (shahd and habiba)
// Add the new route to fetch seller by username
app.get("/getSellerById/:id", getSellerById);

//Admin Controller
app.delete("/deleteAccount", deleteAccount);
app.post("/tourism-governor", createTourismGoverner);
app.post("/admin", createAdmin);

app.get("/get", gettourism);

app.get("/getTour", gettourguide);

//Tourist Controller
app.get("/sortactivities", SortActivities);
app.get("/SortItineraries", SortItineraries);
app.get("/searchplace", seacrhPlace);
app.get("/searchactivity", searchActivity);
app.get("/searchitinerary", searchItinerary);
app.get("/gets", getTourist);
app.post("/rateandcommentItinerary/:id",rateandcommentItinerary);
app.post("/rateandcommentactivity/:id",rateandcommentactivity);
app.post("/comment/:id", addRatingAndComment);
app.put("/tourist/preferences/:id", updateTouristPreferences);

app.put("/redeemMyPoints/:id",redeemMyPoints);
app.post("/addLoyaltyPoints/:id",addLoyaltyPoints);
app.post("/addLoyaltyPoints/:id",addLoyaltyPoints);






//Advertisor
app.get("/getAdv/:id", getAdsById);

////////////////////////////////////////////
app.put("/cpTourist/:id", changePasswordTourist);
app.put("/cpTourist/:id/currency", setPreferredCurrency);
app.put("/cpAdmin/:id", changePasswordAdmin);
app.get("/getadmin", getadmin);
app.put("/cpAdvertiser/:id", changePasswordAdvertiser);
app.get("/getadvertiser", getadvertiser);
app.put("/cpSeller/:id", changePasswordSeller);
app.put("/cpTourguide/:id", changePasswordTourGuide);
app.put("/cpTourismgoverner/:id", changePasswordTourismGoverner);


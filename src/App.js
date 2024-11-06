// app.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      "D:/GUC/Semester 7/CSEN704 Advanced Computer lab/Virtual Trip Planner/JetSet/src/uploads"
    ); // Set the path where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Create a unique filename
  },
});

const upload = multer({ storage: storage });
const TourGuide = require("./Models/TourGuide.js");
const Itinerary = require("./Models/Itinerary"); // Adjust path as necessary
const Activity = require("./Models/Activity"); // Adjust the path

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
  createTransportation,
  gettransportation,
  updateActivityCreator,
  deleteAdvertiserAccount,
} = require("./Routes/advertiserController"); // Adjust path as necessary

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
  deleteProduct,
  archiveProduct,
  changePasswordSeller,
  deleteSellerAccount,
} = require("./Routes/sellerController");
const {
  createPrefTag,
  getPrefTag,
  updatePrefTag,
  deletePrefTag,
  sortProducts,
  gettourism,
  getguests,
  acceptguest,
  rejectguest,
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
  flagItinerary,
  flagActivity,
} = require("./Routes/adminController");

const {
  SortActivities,
  filterActivity,
  searchProductTourist,
  filterProductsTourist,
  getProducts,
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
  sortProductsTourist,
  createRating,
  createReview,
  getPurchasedProducts,
  rateandcommentItinerary,
  rateandcommentactivity,
  addRatingAndComment,
  updateTouristPreferences,
  changePasswordTourist,
  addLoyaltyPoints,
  fileComplaint,
  viewMyComplaints,
  redeemMyPoints,
  bookActivity,
  bookItinerary,
  cancelActivityBooking,
  cancelItineraryBooking,
  bookTransportation,
  deleteTouristAccount,
  getItineraryTourist,
  getActivityTourist,
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
  updateTourGuideProfile,
  activateItinerary,
  deactivateItinerary,
  changePasswordTourGuide,
  deleteTourGuideAccount,
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

const MongoURI = process.env.MONGO_URI;
const port = process.env.PORT;
app.use(cors());

// app.use(
//   "/uploads",
//   express.static(
//     "D:/GUC/Semester 7/CSEN704 Advanced Computer lab/Virtual Trip Planner/JetSet/src/uploads"
//   )
// );

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//app.use("/api", advertiserRoutes); // Use advertiser routes under '/api'
app.get("/api/tourGuides", async (req, res) => {
  try {
    const tourGuides = await TourGuide.find({}, "username _id"); // Fetch usernames and IDs
    res.json(tourGuides);
  } catch (error) {
    console.error("Error fetching tour guides:", error);
    res.status(500).json({ message: "Error fetching tour guides" });
  }
});

app.get("/api/itineraryIds", async (req, res) => {
  try {
    const itineraryIds = await Itinerary.find({}, "_id name"); // Fetch IDs and names
    res.json(itineraryIds);
  } catch (error) {
    console.error("Error fetching itinerary IDs:", error);
    res.status(500).json({ error: "Failed to fetch itinerary1 IDs" });
  }
});

app.get("/api/activities", async (req, res) => {
  try {
    const activities = await Activity.find({}, "_id title"); // Adjust fields as necessary
    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

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
app.post("/register", upload.array("documents", 5), register); // Adjust maxCount as needed

app.get("/getTourist/:id", getTouristProfile);
app.put("/updateTourist/:id", updateTouristProfile);

app.post("/addprofiles", upload.single("image"), createProfile);
app.get("/profiles", getProfile);
app.put("/updateprofiles/:id", upload.single("image"), updateProfile);
app.delete("/deleteprofiles/:id", deleteProfile);
app.post("/addactivity", createActivity);
app.put("/updateactivity/:id", updateActivity);
app.delete("/deleteactivity/:id", deleteActivity);
app.get("/getactivity", getlistActivities);
app.get("/viewactivity", viewCreatedActivities);

app.put("/updateProduct/:id", updateProduct);

app.get("/itineraries", getItineraries);

app.get("/TourGuide", getTourGuides);
app.post("/TourGuideProfile", upload.single("image"), createTourGuideProfile);
app.get("/TourGuideProfile/:tourGuideID", readTourGuideProfile);
app.put(
  "/updateTourGuide/:tourGuideId",
  upload.single("image"),
  updateTourGuideProfile
);

app.post("/addCategory", createCategory);
app.get("/viewCategory", getCategory);
app.put("/updateCategory/:categoryId", updateCategory);
app.delete("/deleteCategory/:categoryId", deleteCategory);
app.get("/filterActivity", filterActivity);
app.get("/filterActivityGuest", filterActivityGuest);

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
app.get("/complaints/:touristId", viewMyComplaints);
app.get("/viewAllComplaints", viewAllComplaints);
// const response = await axios.get('http://localhost:3000/viewAllComplaints');

app.use(express.json());
app.post("/addItinerary", createItinerary);
app.get("/Itineraries", getItineraries);
app.put("/updateItinerary/:id", updateItinerary);
app.delete("/deleteItinerary", deleteItinerary);
app.get("/listofiternaries/:id", viewCreatedItineraries);
app.post("/activateItinerary/:id", activateItinerary);
app.post("/deactivateItinerary/:id", deactivateItinerary);

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
app.get("/filterHistoricalTags", filterHistoricalByTag);

//seller Controller
app.post("/createSeller", upload.single("image"), createSeller);
app.get("/getSeller", getSeller);
app.put("/updateSeller/:id", upload.single("image"), updateSeller);
app.get("/searchProductSeller", searchProductSeller);
app.get("/filterProduct", filterProductSeller);
app.get("/sortProducts", sortProducts);

app.post("/createproducts", upload.single("image"), createProductSeller);

app.put("/editproduct/:id", upload.single("image"), updateProductSeller);

app.post("/createproduct", createProductSeller);
app.put("/editproduct/:id", updateProductSeller); //update rating for product (shahd and habiba)

// Add the new route to fetch seller by username
app.get("/getSellerById/:id", getSellerById);
app.delete("/deleteproduct/:productId", deleteProduct);

app.get("/products", getProducts);
app.get("/productsAdmin", getProductsAdmin);

app.put("/archieve/:productId", archiveProduct);

//Admin Controller
app.delete("/deleteAccount", deleteAccount);
app.post("/tourism-governor", createTourismGoverner);
app.post("/admin", createAdmin);

app.get("/get", gettourism);

app.get("/guest", getguests);

app.get("/getTour", gettourguide);

app.post("/acceptguest/:id", acceptguest);
app.get("/rejectguest/:id", rejectguest);

app.put("/flagItinerary/:id", flagItinerary);
app.put("/flagActivity/:id", flagActivity);
//Tourist Controller
app.get("/sortactivities", SortActivities);
app.get("/SortItineraries", SortItineraries);
app.get("/searchplace", seacrhPlace);
app.get("/searchactivity", searchActivity);
app.get("/searchitinerary", searchItinerary);

app.get("/gettourist", getTourist);
app.get("/sortproductTourist", sortProductsTourist);
app.get("/searchProductTourist", searchProductTourist);
app.get("/filterProductTourist", filterProductsTourist);
app.put("/rate/:productId", createRating);
app.put("/review/:productId", createReview);
app.get("/purchased-products/:touristId", getPurchasedProducts);

app.get("/itinerariesTourist", getItineraryTourist);
app.get("/Activities", getActivityTourist);

const Tourist = require("../src/Models/Tourist");
const Product = require("../src/Models/Product");

app.put("/buyProduct/:touristId", async (req, res) => {
  const { touristId } = req.params; // Get the tourist ID from the route parameters
  const { productId, purchaseQuantity } = req.body; // Get product ID and quantity to purchase from the request body

  try {
    // Find the tourist by ID
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if there is enough stock
    if (product.quantity < purchaseQuantity) {
      return res.status(400).json({ message: "Insufficient product quantity" });
    }

    // Update the product's quantity and sales
    product.quantity -= purchaseQuantity;
    product.sales += purchaseQuantity;
    await product.save(); // Save the updated product document

    // Add the product ID to the tourist's products array
    tourist.products.push(productId);
    await tourist.save(); // Save the updated tourist document

    res.status(200).json({
      message: "Product purchased successfully",
      tourist,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error purchasing product" });
  }
});

app.get("/gets", getTourist);
app.post("/rateandcommentItinerary/:id", rateandcommentItinerary);
app.post("/rateandcommentactivity/:id", rateandcommentactivity);
app.post("/comment/:id", addRatingAndComment);
app.put("/tourist/preferences/:id", updateTouristPreferences);

app.put("/redeemMyPoints/:id", redeemMyPoints);
app.post("/addLoyaltyPoints/:id", addLoyaltyPoints);
app.post("/addLoyaltyPoints/:id", addLoyaltyPoints);

//Advertisor
app.get("/getAdv/:id", getAdsById);

////////////////////////////////////////////
app.put("/cpTourist/:id", changePasswordTourist);
app.put("/cpAdmin/:id", changePasswordAdmin);
app.get("/getadmin", getadmin);
app.put("/cpAdvertiser/:id", changePasswordAdvertiser);
app.get("/getadvertiser", getadvertiser);
app.put("/cpSeller/:id", changePasswordSeller);
app.put("/cpTourguide/:id", changePasswordTourGuide);
app.put("/cpTourismgoverner/:id", changePasswordTourismGoverner);

app.post("/book/:touristId/activity/:activityId", bookActivity);
app.post("/book/:touristId/itinerary/:itineraryId", bookItinerary);
app.delete("/cancelActivity/:touristId/:activityId", cancelActivityBooking);
app.delete("/cancelItinerary/:touristId/:itineraryId", cancelItineraryBooking);
app.post(
  "/bookTransportation/:touristId/:transportationId",
  bookTransportation
);
app.post("/transportation", createTransportation);
app.get("/gettrans", gettransportation);
app.delete("/deleteAccTourist/:id", deleteTouristAccount);
app.delete("/deleteAccTourguide/:id", deleteTourGuideAccount);
app.put("/cr/:id", updateActivityCreator);
app.delete("/deleteAccAdvertiser/:id", deleteAdvertiserAccount);
app.delete("/deleteAccSeller/:id", deleteSellerAccount);

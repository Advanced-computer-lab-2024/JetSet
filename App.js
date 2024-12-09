// app.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const router = express.Router();

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
const Place = require("./Models/Historical.js");

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
  loginAdv,
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
  loginTourism,
  getTourismbyid,
} = require("./Routes/tourismgovernerController");
const {
  filterActivityGuest,
  guestFilterItineraries,
  register,
  registerAST,
  deleteGuest,
  getActivitiesByCategoryForGuest,
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
  loginSeller,
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
  updateComplaintStatus,
  addReplyToComplaint,
  getComplaintsSortedByDate,
  getComplaintsByStatus,
  loginAdmin,
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
  getAdminbyid,
  forgetPass,
  restPass,
  createPromoCode,
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
  buyProduct,
  getActivitiesByCategory,
  shareItem,
  setPreferredCurrency,
  searchFlights,
  bookFlight,
  searchHotels,
  bookHotel,
  viewFlight,
  viewHotel,
  getBookedItinerary,
  getBookedActivities,
  loginTourist,
  getCartItems,
  addToCart,
  removeFromCart,
  batchFetchProducts,
  getProductQuantity,
  checkout,
  payByWallet,
  payByWalletAct,
  payByWalletIti,
  payByWalletProduct,
  paidUpcoming,
  paidHistory,
  addToWishlist,
  viewMyWishlist,
  removeFromMyWishlist,
  payByCardAct,
  payByCardIti,
  viewOrders,
  viewOrderDetails,
  cancelOrder,
  viewRefundAmount,
  addTouristAddress,

  getAddress,

  payByCardPro,
  getActivitiesBasedOnPreferences,

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
  loginTourGuide,
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

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running.");
});

const MongoURI = process.env.MONGO_URI;
const port = process.env.PORT;
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

const {
  bookmarkActivity,
  unbookmarkActivity,
  bookmarkItinerary,
  unbookmarkItinerary,
} = require("../src/Routes/touristController"); // Adjust this path
app.post("/api/bookmarkActivity", async (req, res) => {
  const { touristId, activityId } = req.body;

  try {
    const result = await bookmarkActivity(touristId, activityId);
    if (result.message) {
      return res.json({ message: result.message });
    }
    return res.status(400).json({ error: result.error });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to bookmark activity" });
  }
});
app.post("/api/unbookmarkActivity", async (req, res) => {
  const { touristId, activityId } = req.body;

  try {
    const result = await unbookmarkActivity(touristId, activityId);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(200).json({ message: result.message, tourist: result.tourist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/bookmarkItinerary", async (req, res) => {
  const { touristId, itineraryId } = req.body;

  try {
    const result = await bookmarkItinerary(touristId, itineraryId);
    if (result.message) {
      return res.json({ message: result.message });
    }
    return res.status(400).json({ error: result.error });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to bookmark itinerary" });
  }
});
app.post("/api/unbookmarkItinerary", async (req, res) => {
  const { touristId, itineraryId } = req.body;

  try {
    const result = await unbookmarkItinerary(touristId, itineraryId);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(200).json({ message: result.message, tourist: result.tourist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Basic route for testing
app.get("/home", (req, res) => {
  res.status(200).send("You have everything installed!");
});

app.post("/addTourist", createTourist);
app.post("/register", upload.array("documents", 5), register); // Adjust maxCount as needed
app.post("/login", registerAST);
app.delete("/deleteGuest/:user", deleteGuest);

app.post("/loginTourist", loginTourist);
app.post("/loginAdv", loginAdv);
app.post("/loginTourGuide", loginTourGuide);
app.post("/loginSeller", loginSeller);
app.post("/loginTourism", loginTourism);
app.post("/loginAdmin", loginAdmin);

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

app.get("/getorders/:touristId", viewOrders);
app.get("/vieworder/:touristId/:orderId", viewOrderDetails);
app.delete("/cancelorder/:touristId/:orderId", cancelOrder);
app.get("/viewRefundAmount/:touristId/:orderId", viewRefundAmount);

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

app.get("/getadminbyId/:id", getAdminbyid);
app.get("/getTourismbyId/:id", getTourismbyid);

app.post("/createPromoCode/:id", createPromoCode);
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

app.get("/itiTour", getItineraryTourist);
app.get("/Acttour", getActivityTourist);

const Tourist = require("../src/Models/Tourist");
const Product = require("../src/Models/Product");

app.put("/buyProduct/:touristId", buyProduct);

app.get("/gets", getTourist);
app.post("/rateandcommentItinerary/:id", rateandcommentItinerary);
app.post("/rateandcommentactivity/:id", rateandcommentactivity);
app.put("/comment/:id", addRatingAndComment);
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
app.post("/payByWallet/:touristId/:itemId", payByWallet);
app.post("/payWalletAct/:touristId/:activityId", payByWalletAct);
app.post("/payCardAct/:touristId/:activityId", payByCardAct);
app.post("/payCardIti/:touristId/:iteniraryId", payByCardIti);
app.post("/payWalletIti/:touristId/:iteniraryId", payByWalletIti);
app.post("/payWalletPro/:touristId", payByWalletProduct);
app.post("/payCardPro/:touristId", payByCardPro);
app.get("/paidUpcoming/:touristId", paidUpcoming);
app.get("/paidHistory/:touristId", paidHistory);
app.post("/transportation", createTransportation);
app.get("/gettrans", gettransportation);
app.delete("/deleteAccTourist/:id", deleteTouristAccount);
app.delete("/deleteAccTourguide/:id", deleteTourGuideAccount);
app.put("/cr/:id", updateActivityCreator);
app.delete("/deleteAccAdvertiser/:id", deleteAdvertiserAccount);
app.delete("/deleteAccSeller/:id", deleteSellerAccount);

app.post("/Wishlist/:touristID", addToWishlist);
app.get("/Wishlist/:touristID", viewMyWishlist);
app.delete("/Wishlist/:touristID", removeFromMyWishlist);

app.put("/touristwallet/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { wallet } = req.body;

    // Update the wallet field only
    const updatedTourist = await Tourist.findByIdAndUpdate(
      id,
      { wallet },
      { new: true, runValidators: true }
    );

    if (!updatedTourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.json(updatedTourist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/addToCart/:id", addToCart);
app.post("/removeFromCart/:id", removeFromCart);
app.get("/cart/:id", getCartItems);
app.post("/productQuantity/:id", getProductQuantity);
app.post("/addTouristAddress/:id", addTouristAddress);

app.post("/batchFetch", batchFetchProducts);

app.get("/activities/by-category", getActivitiesByCategoryForGuest);
app.get("/activities/by-category", getActivitiesByCategory);
app.post("/share", shareItem);

app.put("/cpTourist/:touristId/currency", setPreferredCurrency);

app.put("/complaints/:id/state", updateComplaintStatus);
app.put("/complaints/:id/reply", addReplyToComplaint);
app.get("/complaintSort", getComplaintsSortedByDate);
app.get("/complaintfilter", getComplaintsByStatus);

app.post("/search-flights", searchFlights);
app.post("/book-flight/:touristId", bookFlight);

app.post("/search-hotels", searchHotels);
app.post("/book-hotel/:touristId", bookHotel);

app.get("/flight", viewFlight);
app.get("/hotel", viewHotel);

const Category = require("./Models/Category.js");

app.get("/category", async (req, res) => {
  try {
    const tags = await Category.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

app.get("/bookedIti/:touristId", getBookedItinerary);
app.get("/bookedAct/:touristId", getBookedActivities);

app.get("/address/:id", getAddress);

// Route to get tourist's preferred currency and conversion rate
app.get("/tourist/:id/preferredCurrency", async (req, res) => {
  const { id } = req.params;

  try {
    const tourist = await Tourist.findById(id, "preferredCurrency");
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    const preferredCurrency = tourist.preferredCurrency;

    // Hardcode conversion rates or fetch from an API
    const conversionRates = {
      USD: 1 / 49.2,
      EGP: 1,
      EUR: 1 / 52.6,
      SAR: 1 / 13.1,
      AED: 1 / 13.4,
      KWD: 1 / 160.4,
      TRY: 1 / 1.4,
      GBP: 1 / 63.5,
    };

    res.json({
      preferredCurrency,
      conversionRate: conversionRates[preferredCurrency] || 1,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching currency data", error });
  }
});
app.post("/checkout/:touristId", checkout);

// Import necessary modules and models
const Admin = require("../src/Models/Admin.js"); // Replace with your Admin model's path

app.delete("/deleteAdmin/:id", async (req, res) => {
  const { id } = req.params; // Get admin ID from route parameters

  try {
    // Find and delete the admin
    const deletedAdmin = await Admin.findByIdAndDelete(id);

    // Check if the admin was found and deleted
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting admin" });
  }
});

module.exports = router;
app.post("/forgot-password", forgetPass);
app.post("/reset-password", restPass);

const Notification = require("../src/Models/Notification.js");
app.get("/notification", async (req, res) => {
  try {
    const { recipient, role } = req.query; // Pass recipient's username to get notifications
    const notifications = await Notification.find({ recipient, role });

    if (!notifications.length) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.get("/not", async (req, res) => {
  try {
    const notifications = await Notification.find();

    if (!notifications.length) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.get("/unread", async (req, res) => {
  const { recipient, role } = req.query;
  try {
    // Get the count of unread notifications
    const unreadCount = await Notification.countDocuments({
      read: false,
      recipient,
      role,
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.put("/read/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ message: "Missing notification ID in request" });
  }

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error marking notification as read" });
  }
});

app.get("/activity/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/itinerary/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.json(itinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/historical/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/preferences/:touristId",getActivitiesBasedOnPreferences);
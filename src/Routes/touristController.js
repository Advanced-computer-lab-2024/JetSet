const Product = require("../Models/Product");
const Activity = require("../Models/Activity");
const Itinerary = require("../Models/Itinerary");
const Historical = require("../Models/Historical");
const Tourist = require("../Models/Tourist.js");
const Category = require("../Models/Category.js");
const Transportation = require("../Models/Transportation");
const { default: mongoose } = require("mongoose");

const createTourist = async (req, res) => {
  const { username, password, email, mobile, nationality, dob, job } = req.body;
  try {
    const user = await Tourist.create({
      username: username,
      password: password,
      email: email,
      mobile_number: mobile,
      nationality: nationality,
      DOB: dob,
      job: job,
    });
    res.status(200).json({ msg: "Tourist created" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getTourist = async (req, res) => {
  try {
    const users = await Tourist.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

const getTouristProfile = async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.status(200).json(tourist);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error retrieving tourist profile", error });
  }
};

const updateTouristProfile = async (req, res) => {
  const { username, wallet, ...rest } = req.body;
  try {
    const updatedTourist = await Tourist.findByIdAndUpdate(
      req.params.id,
      {
        $set: { ...rest },
      },
      { new: true }
    );
    if (!updatedTourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    // Prevent updating username and wallet
    updatedTourist.username = username;
    updatedTourist.wallet = wallet;
    await updatedTourist.save();
    res.status(200).json(updatedTourist);
  } catch (error) {
    res.status(400).json({ message: "Error updating tourist profile", error });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("reviews.userId", "name");
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Sort products by ratings
const sortProducts = async (req, res) => {
  const { sortBy = "ratings", sortOrder = -1 } = req.body; // Default to sort by ratings in descending order

  try {
    // Validate sortBy and ensure it's either 'ratings' or 'price'
    if (!["ratings", "price"].includes(sortBy)) {
      return res
        .status(400)
        .json({ error: 'Invalid sort parameter. Use "ratings" or "price".' });
    }

    // Sorting logic
    const sortOption = {};
    sortOption[sortBy] = sortOrder; // Use the dynamic field for sorting

    // Find and sort the products
    const sortedProducts = await Product.find().sort(sortOption);

    // Return the sorted products
    res.json(sortedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
const getlistActivities = async (req, res) => {
  try {
    const today = new Date(); // Get today's date
    const activities = await Activity.find({
      date: { $gt: today }, // Find activities with a date greater than today
    });

    res.status(200).json(activities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Methods for tourists and guests
const SortActivities = async (req, res) => {
  const { sortBy, sortOrder } = req.query;
  const validSortOrder = sortOrder == 1 ? 1 : -1;
  try {
    let sortOption = {};
    if (sortBy && (validSortOrder === 1 || validSortOrder === -1)) {
      sortOption[sortBy] = validSortOrder;
    }

    const upcomingActivities = await Activity.find().sort(sortOption);

    res.json(upcomingActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

//need to change it as the activity
const SortItineraries = async (req, res) => {
  const { sortBy = "budget", sortOrder = "asc" } = req.query;

  try {
    let sortOption = {};

    const validSortOrder = sortOrder == 1 ? 1 : -1;
    if (sortBy && (validSortOrder === 1 || validSortOrder === -1)) {
      sortOption[sortBy] = validSortOrder; // Assign the correct sorting value
    }
    const upcomingItineraries = await Itinerary.find({}).sort(sortOption);

    res.status(200).json(upcomingItineraries);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getItineraries = async (req, res) => {
  const {
    sortBy = "budget",
    sortOrder = "asc",
    budget,
    startDate,
    endDate,
    tag,
    language,
  } = req.query;

  try {
    let sortOption = {};
    sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;

    const currentDate = new Date();
    const query = {
      startDate: { $gte: currentDate }, // Ensure upcoming itineraries only
    };

    // Apply filters if present
    if (budget) {
      query.budget = { $lte: Number(budget) }; // Filter by budget
    }
    if (startDate) {
      query.startDate = { $gte: new Date(startDate) }; // Filter by start date
    }
    if (endDate) {
      query.endDate = { $lte: new Date(endDate) }; // Filter by end date
    }
    if (tag && tag.length > 0) {
      query.tags = { $in: tag.split(",").map((t) => t.trim()) }; // Split tags by comma and trim whitespace
    }
    if (language) {
      query.language = language; // Filter by language
    }

    // Fetch and sort itineraries based on the query and sort options
    const itineraries = await Itinerary.find(query).sort(sortOption);

    // Format the output
    const formattedItineraries = Itinerary.map((itinerary) => ({
      title: itinerary.title,
      locations: itinerary.locations,
      timeline: itinerary.timeline,
      duration: itinerary.duration,
      language: itinerary.language,
      price: itinerary.price,
      availability_dates: itinerary.availability_dates,
      pickup_location: itinerary.pickup_location,
      dropoff_location: itinerary.dropoff_location,
      accessibility: itinerary.accessibility,
      budget: itinerary.budget,
      tags: itinerary.tags || [], // Ensure tags is an array
      created_by: itinerary.created_by,
      createdAt: itinerary.createdAt,
      updatedAt: itinerary.updatedAt,
    }));

    res.status(200).json(formattedItineraries);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const filterActivity = async (req, res) => {
  const { budget, date, category, rating } = req.query;

  // Initialize an empty query object
  let query = {};

  // Add filters to the query object only if they are provided in the request body
  if (budget) query.budget = budget;
  if (date) query.date = date;
  if (category) query.category = category;
  if (rating) query.rating = rating;

  // Add condition to only return upcoming activities based on date
  // const currentDate = new Date();
  // query.date = { ...query.date, $gte: currentDate };

  try {
    // Perform the query with dynamic filters
    const activity = await Activity.find(query);

    if (activity.length === 0) {
      return res.status(404).json({ message: "No activity found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const seacrhPlace = async (req, res) => {
  const { name, category, tags } = req.query;
  let query = {}; // Initialize an empty query object

  // Dynamically add filters to the query object based on the provided query parameters
  if (name) {
    query.Name = name;
  }
  if (category) {
    query.category = category;
  }
  if (tags) {
    query.tags = tags;
  }

  try {
    const place = await Historical.find(query); // Perform the query based on the dynamically constructed query object
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving place", error });
  }
};

const searchActivity = async (req, res) => {
  const { name, category, tags } = req.query;
  let query = {}; // Initialize an empty query object

  // Dynamically add filters to the query object based on the provided query parameters
  if (name) {
    query.title = name; // Case-insensitive search for the title
  }
  if (category) {
    query.category = category; // Case-insensitive search for the category
  }
  if (tags) {
    query.tags = tags; // Case-insensitive search in tags array
  }

  try {
    const activity = await Activity.find(query); // Perform the query based on the dynamically constructed query object
    res.status(200).json(activity);
  } catch (error) {
    // Log the full error to the response for debugging
    res
      .status(500)
      .json({ message: "Error retrieving activity", error: error.message });
  }
};

const searchItinerary = async (req, res) => {
  const { name, category, tags } = req.query;
  let query = {}; // Initialize an empty query object

  // Dynamically add filters to the query object based on the provided query parameters
  if (name) {
    query.name = name; // Case-insensitive search for the name
  }
  if (category) {
    query.category = category; // Case-insensitive search for the category
  }
  if (tags) {
    query.tags = tags;
  } // Case-insensitive search in tags array

  try {
    const itineraries = await Itinerary.find(query); // Perform the query based on the dynamically constructed query object
    res.status(200).json(itineraries);
  } catch (error) {
    // Log the full error to the response for debugging
    res
      .status(500)
      .json({ message: "Error retrieving itineraries", error: error.message });
  }
};

const searchProductTourist = async (req, res) => {
  const { name } = req.query;
  try {
    const product = await Product.find({ name });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

const filterProducts = async (req, res) => {
  const { limit } = req.query; // Use req.query for GET requests
  try {
    const products = await Product.find({ price: { $lte: limit } }).populate(
      "reviews.userId",
      "name"
    );
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const touristFilterItineraries = async (req, res) => {
  try {
    const { budget, startDate, endDate, tag, language } = req.query;

    // Build the query object dynamically
    const query = {};

    // Ensure budget is a number and apply filter
    if (budget) {
      const budgetNumber = Number(budget); // Convert to number
      if (!isNaN(budgetNumber)) {
        query.budget = { $lte: budgetNumber }; // Budget less than or equal to the specified value
      }
    }

    // Date filters
    if (startDate && endDate) {
      query.availability_dates = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Filter by tags
    if (tag) {
      query.tag = { $in: tag.split(",").map((t) => t.trim()) }; // Trim spaces
    }

    // Filter by language
    if (language) {
      query.language = language;
    }

    // Execute the query
    const itineraries = await Itinerary.find(query).populate("tag");

    // Send the filtered itineraries back
    res.status(200).json(itineraries);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ message: "Error fetching itineraries" });
  }
};

const viewAllPlaces = async (req, res) => {
  try {
    const places = await Historical.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const filterHistoricalByTag = async (req, res) => {
  const { tag } = req.query; // Expecting 'tag' from the query parameters

  if (!tag) {
    return res.status(400).json({ error: "Tag is required for filtering." });
  }

  try {
    // Find historical places that contain the specified tag
    const historicalPlaces = await Historical.find({
      tags: tag, // Matches the tag within the tags array (as a string)
    });

    if (historicalPlaces.length === 0) {
      return res.status(404).json({
        message: "No historical places found with the specified tag.",
      });
    }

    res.status(200).json(historicalPlaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
////////////////////////////////////////////////////
const changePasswordTourist = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const touristId = req.params.id;

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Skip password hashing, compare directly
    if (tourist.password !== oldPassword) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Directly assign the new password (plain-text)
    tourist.password = newPassword;
    await tourist.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
};

const bookActivity = async (req, res) => {
  const { touristId, activityId } = req.params;

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the activity
    const activity = await Activity.findById(activityId);
    if (!activity || !activity.booking_open) {
      return res.status(404).json({ message: "Activity not found or not available for booking" });
    }

    // Check if the tourist has already booked this activity
    if (tourist.bookedActivities.includes(activityId)) {
      return res.status(400).json({ message: "Activity already booked" });
    }

    // Update the tourist's bookedActivities and increment bookings count
    tourist.bookedActivities.push(activityId);
   // activity.bookings += 1; // Increment bookings count
    await tourist.save();
   // await activity.save();

    res.status(200).json({ message: "Activity booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error booking activity", error });
  }
};

const bookItinerary = async (req, res) => {
  const { touristId, itineraryId } = req.params;

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the itinerary
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if the tourist has already booked this itinerary
    if (tourist.bookedItineraries.includes(itineraryId)) {
      return res.status(400).json({ message: "Itinerary already booked" });
    }

    // Update the tourist's bookedItineraries and increment bookings count
    tourist.bookedItineraries.push(itineraryId);
   // itinerary.bookings += 1; // Increment bookings count
    await tourist.save();
   // await itinerary.save();

    res.status(200).json({ message: "Itinerary booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error booking itinerary", error });
  }
};

const cancelActivityBooking = async (req, res) => {
  const { touristId, activityId } = req.params;

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the activity
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if the activity is within the 48-hour cancellation period
    const hoursUntilActivity = (new Date(activity.date) - new Date()) / (1000 * 60 * 60);
    if (hoursUntilActivity < 48) {
      return res.status(400).json({ message: "Cannot cancel less than 48 hours before the activity" });
    }

    // Remove the activity ID from tourist's bookedActivities
    tourist.bookedActivities = tourist.bookedActivities.filter(
      (id) => id.toString() !== activityId
    );
    await tourist.save();

    res.status(200).json({ message: "Activity booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling activity booking", error });
  }
};

const cancelItineraryBooking = async (req, res) => {
  const { touristId, itineraryId } = req.params;

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the itinerary
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if the itinerary is within the 48-hour cancellation period
    const hoursUntilItinerary = (new Date(itinerary.start_date) - new Date()) / (1000 * 60 * 60);
    if (hoursUntilItinerary < 48) {
      return res.status(400).json({ message: "Cannot cancel less than 48 hours before the itinerary start date" });
    }

    // Remove the itinerary ID from tourist's bookedItineraries
    tourist.bookedItineraries = tourist.bookedItineraries.filter(
      (id) => id.toString() !== itineraryId
    );
    await tourist.save();

    res.status(200).json({ message: "Itinerary booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling itinerary booking", error });
  }
};

const bookTransportation = async (req, res) => {
  const { touristId, transportationId } = req.params;

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const transportation = await Transportation.findById(transportationId);
    if (!transportation) {
      return res.status(404).json({ message: "Transportation option not found" });
    }

    if (tourist.bookedTransportations.includes(transportationId)) {
      return res.status(400).json({ message: "Transportation already booked" });
    }

    tourist.bookedTransportations.push(transportationId);
    await tourist.save();

    res.status(200).json({ message: "Transportation booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error booking transportation", error });
  }
};

const deleteTouristAccount = async (req, res) => {
  try {
    const { id } = req.params; // Get tourist ID from the URL

    // Find the tourist by ID
    const tourist = await Tourist.findById(id);

    if (!tourist) {
      return res.status(404).json({ success: false, message: "Tourist account not found" });
    }

    // Check if the tourist has any booked activities or itineraries
    if (tourist.bookedActivities.length === 0 && tourist.bookedItineraries.length === 0) {
      // If no activities or itineraries are booked, delete the account
      await Tourist.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: "Tourist account deleted successfully" });
    } else {
      // If there are booked activities or itineraries, deny deletion
      return res.status(403).json({ success: false, message: "Cannot delete account: you have booked activities or itineraries" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while trying to delete the account" });
  }
};


module.exports = {
  getProducts,
  SortActivities,
  getItineraries,
  filterActivity,
  searchProductTourist,
  filterProducts,
  touristFilterItineraries,
  createTourist,
  getTouristProfile,
  updateTouristProfile,
  sortProducts,
  filterHistoricalByTag,
  getlistActivities,
  viewAllPlaces, // Export the new method
  getTourist,
  SortItineraries,
  seacrhPlace,
  searchActivity,
  searchItinerary,
  changePasswordTourist,
  bookActivity,
  bookItinerary,
  cancelActivityBooking,
  cancelItineraryBooking,
  bookTransportation,
  deleteTouristAccount,
};

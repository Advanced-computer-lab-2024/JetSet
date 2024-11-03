const Activity = require("../Models/Activity");
const itinerariesModel = require("../Models/Itinerary.js");

const Guest = require("../Models/Guest.js");
const { default: mongoose } = require("mongoose");

//added
const register = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    const user = await Guest.create({
      username,
      password,
      email,
      role,
    });
    res.status(200).json({ msg: "Account created" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const filterActivityGuest = async (req, res) => {
  const { budget, date, category, rating } = req.body;

  // Initialize an empty query object
  let query = {};

  // Add filters to the query object only if they are provided in the request body
  if (budget) query.budget = budget;
  if (date) query.date = date;
  if (category) query.category = category;
  if (rating) query.rating = rating;

  // Add condition to only return upcoming activities based on date
  const currentDate = new Date();
  query.date = { ...query.date, $gte: currentDate };

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

const guestFilterItineraries = async (req, res) => {
  try {
    const { budget, startDate, endDate, tag, language } = req.body;

    // Build the query object dynamically
    const query = {};

    if (budget) query.budget = budget;
    if (startDate && endDate) {
      query.availability_dates = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    // Filter by preferences (assumes tags reference preferences like 'historic', 'beach', etc.)
    if (tag) {
      query.tag = { $in: tag.split(",") }; // Assumes preferences are sent as comma-separated values
    }

    // Filter by language
    if (language) {
      query.language = language;
    }

    // Execute the query
    const itineraries = await itinerariesModel.find(query).populate("tag");

    // Send the filtered itineraries back
    res.status(200).json(itineraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching itineraries" });
  }
};

const Historical = require("../Models/Historical");

// Filter historical places/museums by tag
const filterHistoricalByTag = async (req, res) => {
  const { tag } = req.body; // Expecting 'tag' from the request body

  if (!tag) {
    return res.status(400).json({ error: "Tag is required for filtering." });
  }

  try {
    // Find historical places that contain the specified tag
    const historicalPlaces = await Historical.find({
      tags: tag, // Matches the tag within the tags array
    }).populate("tags", "type period"); // Optionally populate tag details

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

const getActivitiesByCategoryForGuest = async (req, res) => {
  const { category } = req.query; // Expecting category ID as a query parameter

  if (!category) {
    return res.status(400).json({ error: "Category is required to view activities." });
  }
   // Check if the category is a valid MongoDB ObjectId
   if (!mongoose.Types.ObjectId.isValid(category)) {
    return res.status(400).json({ error: "Invalid category ID format." });
  }

  try {
    // Find activities that belong to the specified category, with populated category data
    const activities = await Activity.find({ category })
      .populate("category", "name") // Populate category with only the name field
      .populate("tags", "name")     // Optional: Populate tags with name field
      .populate("creator", "name"); // Optional: Populate creator with name field

    if (activities.length === 0) {
      return res.status(404).json({ message: "No activities found for this category." });
    }

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities by category:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  filterActivityGuest,
  guestFilterItineraries,
  register,
  filterHistoricalByTag,
  getActivitiesByCategoryForGuest
};

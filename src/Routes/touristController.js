const Product = require("../Models/Product");
const Activity = require("../Models/Activity");
const Itinerary = require("../Models/Itinerary");
const Historical = require("../Models/Historical");
const Tourist = require("../Models/Tourist.js");
const TourGuide=require("../Models/TourGuide.js");
const Category = require("../Models/Category.js");
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


const rateandcommentItinerary = async (req, res) => {
  const {itineraryId ,rating, comment } = req.body; // Expecting these fields in the request body
  const touristId = req.params.id; // Assuming the tourist ID is passed in the URL
  

  try {
    // Validate input
    if (!itineraryId || !rating) {
      return res.status(400).json({ error: "Itinerary ID and rating are required." });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    // Find the itinerary
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found." });
    }

    // Check if the tourist has already rated this itinerary
    // const existingRating = itinerary.ratings.find(r => r.touristId.toString() === touristId);
    // if (existingRating) {
    //   return res.status(400).json({ error: "You have already rated this itinerary." });
    // }

    // Add the rating and comment
    itinerary.ratings.push({ touristId, rating, comment });
    await itinerary.save();

    return res.status(200).json({ message: "Itinerary rated successfully.", itinerary });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error.", details: error.message });
  }
};

// const rateproduct = async (req, res) => {
//   const { productId, rating } = req.body; // Expecting these fields in the request body
//   const touristId = req.params.id; // Assuming the tourist ID is passed in the URL

//   try {
//     // Validate input
//     if (!productId || rating === undefined) {
//       return res.status(400).json({ error: "Product ID and rating are required." });
//     }

//     // Ensure rating is between 0 and 5
//     if (rating < 0 || rating > 5) {
//       return res.status(400).json({ error: "Rating must be between 0 and 5." });
//     }

//     // Find the product
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found." });
//     }

//     // Calculate the new average rating
//     const existingRating = product.ratings || 0; // Default to 0 if no rating exists
//     const newRating = (existingRating + rating) / 2; // Example averaging; adjust logic as needed
//     product.ratings = newRating;

//     // Save the updated product
//     await product.save();

//     return res.status(200).json({ message: "Product rated successfully.", product });
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ error: "Internal server error.", details: error.message });
//   }
// };

const rateandcommentactivity = async (req, res) => {
  const {activityId ,rating, comment } = req.body; // Expecting these fields in the request body
  const touristId = req.params.id; // Assuming the tourist ID is passed in the URL
  

  try {
    // Validate input
    if (!activityId || !rating) {
      return res.status(400).json({ error: "Activity ID and rating are required." });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }
    
    // Find the itinerary
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }
   
    
    // Check if the tourist has already rated this itinerary
    // const existingRating = activity.ratings.find(r => r.touristId.toString() === touristId);
    // if (existingRating) {
    //   return res.status(400).json({ error: "You have already rated this activity." });
    // }

    // Add the rating and comment
    activity.ratings.push({ touristId, rating, comment });
    await activity.save();

    return res.status(200).json({ message: "Activity rated successfully.", activity });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error.", details: error.message });
  }
};

const addRatingAndComment = async (req, res) => {
  const { tourGuideId, rating, comment, touristId } = req.body;

  console.log("Received tourist ID:", touristId);

  // Ensure touristId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(touristId)) {
    return res.status(400).json({ message: "Invalid tourist ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(tourGuideId)) {
    return res.status(400).json({ message: "Invalid tour guide ID" });
  }

  try {
    // Find the tour guide by ID
    const tourGuide = await TourGuide.findById(tourGuideId);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    // Convert touristId to ObjectId for comparisons
    const touristObjectId = new mongoose.Types.ObjectId(touristId);

    // Check if the tourist has already rated this tour guide
    const existingRating = tourGuide.ratings.find(r => r.touristId.equals(touristObjectId));
    
    if (existingRating) {
      // Update existing rating and comment
      existingRating.rating = rating;
      existingRating.comment = comment;
    } else {
      // Create a new rating entry
      const newRating = {
        touristId: touristObjectId, // Use existing touristId here
        rating: rating,
        comment: comment,
      };
      tourGuide.ratings.push(newRating);
    }

    // Save the updated tour guide
    await tourGuide.save();
    
    res.status(200).json({ message: "Rating and comment added successfully", tourGuide });
  } catch (error) {
    console.error("Error details:", error);
    
    // Handle specific error types if necessary
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: "Validation error", error: error.message });
    }

    res.status(500).json({ message: "Error adding rating and comment", error: error.message });
  }
};

const updateTouristPreferences = async (req, res) => {
  const { preferences } = req.body;

  try {
    const updatedTourist = await Tourist.findByIdAndUpdate(
      req.params.id,
      { $set: { preferences } },
      { new: true }
    );

    if (!updatedTourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json(updatedTourist);
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(400).json({ message: "Error updating preferences", error });
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
  rateandcommentItinerary,
  rateandcommentactivity,
  addRatingAndComment,
  updateTouristPreferences
};

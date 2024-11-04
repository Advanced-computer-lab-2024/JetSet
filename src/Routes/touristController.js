const Product = require("../Models/Product");
const Activity = require("../Models/Activity");
const Itinerary = require("../Models/Itinerary");
const Historical = require("../Models/Historical");
const Tourist = require("../Models/Tourist.js");
const TourGuide=require("../Models/TourGuide.js");
const Category = require("../Models/Category.js");
const Complaint = require("../Models/Complaint.js");
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
    res.status(200).json({ msg: "Tourist created", touristId: user._id });
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
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Update fields while keeping username and wallet unchanged
    const updatedTourist = await Tourist.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...rest,
          username: tourist.username, // Keep existing username
          wallet: tourist.wallet, // Keep existing wallet
        },
      },
      { new: true, runValidators: true } // Validate during update
    );

    res.status(200).json(updatedTourist);
  } catch (error) {
    res.status(400).json({ message: "Error updating tourist profile", error });
  }
};

const getProducts = async (req, res) => {
  try {
    // Find products that are not archived
    const products = await Product.find({ archive: false })
      .populate({
        path: "reviews.touristId",
        select: "username", // Only get the username field
      })
      .populate({
        path: "seller_id",
        select: "username",
      });
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Sort products by ratings
const sortProductsTourist = async (req, res) => {
  const { sortBy, sortOrder } = req.query; // Use req.query for GET requests

  // Convert sortOrder to a number and validate it
  const validSortOrder = Number(sortOrder); // Convert to number
  const isSortOrderValid = validSortOrder === 1 || validSortOrder === -1;

  try {
    let sortOption = {};
    if (sortBy === "ratings" && isSortOrderValid) {
      // Ensure sortBy is valid
      sortOption[sortBy] = validSortOrder; // Set sorting option based on valid input
    }

    // Find and sort the products that are not archived
    const sortedProducts = await Product.find({ archive: false }).sort(
      sortOption
    );

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
    // Find products by name and ensure they are not archived
    const products = await Product.find({
      name,
      archive: false,
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

const filterProductsTourist = async (req, res) => {
  const { limit } = req.query; // Use req.query for GET requests
  try {
    // Find products with price less than or equal to limit and ensure they are not archived
    const products = await Product.find({
      price: { $lte: limit },
      archive: false,
    }).populate("reviews.userId", "name");

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


const createRating = async (req, res) => {
  const { productId } = req.params; // Get productId from the URL parameters
  const { rating } = req.body; // Get the rating from the request body

  try {
    // Validate the rating
    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5." });
    }

    const product = await Product.findById(productId); // Find the product by ID
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Calculate new average rating
    const currentTotalRating = product.ratings * (product.reviews.length || 1);
    const newTotalRating = currentTotalRating + rating;
    product.ratings = newTotalRating / (product.reviews.length + 1); // Update average rating

    await product.save(); // Save the updated product

    res.status(200).json({
      message: "Rating added successfully.",
      averageRating: product.ratings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createReview = async (req, res) => {
  const { productId } = req.params; // Get productId from the URL parameters
  const { touristId, reviewText } = req.body; // Get touristId and reviewText from the request body

  try {
    const product = await Product.findById(productId); // Find the product by ID
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Add the review to the product
    product.reviews.push({ touristId, reviewText });
    await product.save(); // Save the updated product

    res.status(200).json({ message: "Review added successfully.", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPurchasedProducts = async (req, res) => {
  const { touristId } = req.params; // Get touristId from the URL parameters

  try {
    const tourist = await Tourist.findById(touristId).populate("products");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    res.status(200).json({ products: tourist.products });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    console.log("Received data:", req.body); // Log the request body
    const { tourGuideId, rating, comment } = req.body;
    const touristId = "672635325490518dc4cd46cc"; // Hard-coded tourist ID
    console.log("Received tourist ID:", touristId);

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(touristId) || !mongoose.Types.ObjectId.isValid(tourGuideId)) {
        return res.status(400).json({ message: "Invalid IDs" });
    }
    if (!tourGuideId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Invalid data" });
    }

    try {
        const tourGuide = await TourGuide.findById(tourGuideId);
        if (!tourGuide) {
            return res.status(404).json({ message: "Tour guide not found" });
        }

        // Check for existing rating
        const existingRatingIndex = tourGuide.ratings.findIndex(r => r.touristId.equals(touristId));
        
        if (existingRatingIndex !== -1) {
            // Update existing rating
            tourGuide.ratings[existingRatingIndex].rating = rating;
            tourGuide.ratings[existingRatingIndex].comment = comment;
        } else {
            // Add new rating
            tourGuide.ratings.push({ touristId, rating, comment });
        }

        await tourGuide.save();
        res.status(200).json({ message: "Rating added successfully" });
    } catch (error) {
        console.error("Error adding rating:", error);
        res.status(500).json({ message: "Error adding rating", error: error.message });
    }
};

module.exports = addRatingAndComment;




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

//Sprint 2 requirements requirement 70 & 71
function calculatePoints(paymentAmount, level) {
  if (level === 1) {
    return paymentAmount * 0.5;
  } else if (level === 2) {
    return paymentAmount * 1;
  } else if (level === 3) {
    return paymentAmount * 1.5;
  }
  return 0;
}
function calculateBadge  (points) {
  if (points <= 100000) {
    return "Bronze";
  } else if (points <= 500000) {
    return "Silver";
  } else {
    return "Gold";
  }
};
function determineLevel(loyaltyPoints) {
  if (loyaltyPoints <= 100000) {
    return 1;
  } else if (loyaltyPoints <= 500000) {
    return 2;
  } else {
    return 3;
  }
}
const addLoyaltyPoints = async (req, res) => {
  try {

    const { paymentAmount } = req.body;
    const touristId = req.params.id;

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist is not found" });
    }

    const pointsEarned = calculatePoints(paymentAmount, tourist.level);
    const badge = calculateBadge(tourist.loyaltyPoints); // Calculate badge based on updated points

    tourist.loyaltyPoints += pointsEarned;
    tourist.level = determineLevel(tourist.loyaltyPoints);
    tourist.badge = badge;

    // await tourist.save();
    // const badge = Tourist.calculateBadge(tourist.loyaltyPoints); 

    await tourist.save();
    res.status(200).json({
      message: "Loyalty points was added successfully",
      loyaltyPoints: tourist.loyaltyPoints,
      level: tourist.level,
      badge: tourist.badge
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add loyalty points" });
  }
};


const fileComplaint= async (req, res) => {
  const { title, body, date } = req.body;
  const {touristId} = req.params;
  try {
    const newComplaint = new Complaint({ title, body, date, userId: touristId });
    await newComplaint.save();
    res.status(201).json({ message: 'Complaint filed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to file the complaint' });
  }
};

const viewMyComplaints= async (req, res) => {
  const touristID = new mongoose.Types.ObjectId(req.params.touristId);
  try {
    const complaints = await Complaint.find({userId: touristID}); 
    res.status(200).json(complaints); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch complaints from database' });
  }
};

const redeemMyPoints= async (req, res) =>{
  const touristID = req.params.id;
  try{
    const tourist= await Tourist.findById(touristID);
  if(tourist.loyaltyPoints>=10000){
    tourist.loyaltyPoints-=10000;
    tourist.wallet+=100;
    await tourist.save();
    return res.status(200).json({ message: 'Points redeemed successfully', tourist });
  }
  else 
    return res.status(400).json({error: 'Not Enough Points'});
  }catch(error){
    console.error(error); 
    return res.status(500).json({ error: 'An error occurred', details: error.message });
  }
}


module.exports = {
  getProducts,
  SortActivities,
  getItineraries,
  filterActivity,
  searchProductTourist,
  filterProductsTourist,
  touristFilterItineraries,
  createTourist,
  getTouristProfile,
  updateTouristProfile,
  sortProductsTourist,
  filterHistoricalByTag,
  getlistActivities,
  viewAllPlaces, // Export the new method
  getTourist,
  SortItineraries,
  seacrhPlace,
  searchActivity,
  searchItinerary,
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

};

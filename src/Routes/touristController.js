const Product = require("../Models/Product");
const Activity = require("../Models/Activity");
const Itinerary = require("../Models/Itinerary");



const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("reviews.userId", "name");
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Methods for tourists and guests
const getActivities = async (req, res) => {
  const { sortBy } = req.body; // Query parameter for sorting: 'price' or 'ratings'

  try {
    let sortOption = {};
    if (sortBy === "price") {
      sortOption.price = 1; // Ascending order
    } else if (sortBy === "ratings") {
      sortOption.ratings = -1; // Descending order
    } else {
      return res
        .status(400)
        .json({ error: 'Invalid sort parameter. Use "price" or "ratings".' });
    }

    const sortedActivities = await Activity.find().sort(sortOption);
    res.json(sortedActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getitineraries = async (req, res) => {
  const { sortBy } = req.body; // Query parameter for sorting: 'price' or 'ratings'

  try {
    let sortOption = {};
    if (sortBy === "price") {
      sortOption.price = 1; // Ascending order
    } else if (sortBy === "ratings") {
      sortOption.ratings = -1; // Descending order
    } else {
      return res
        .status(400)
        .json({ error: 'Invalid sort parameter. Use "price" or "ratings".' });
    }

    const sortedActivities = await Itinerary.find().sort(sortOption);
    res.json(sortedActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const filterActivity = async (req, res) => {
    const { budget, date, category, rating } = req.body;

    // Initialize an empty query object
    let query = {};

    // Add filters to the query object only if they are provided in the request body
    if (budget) query.budget = budget;
    if (date) query.date = date;
    if (category) query.category = category;
    if (rating) query.rating = rating;

    try {
        // Perform the query with dynamic filters
        const activity = await Activity.find(query);

        if (activity.length === 0) {
            return res.status(404).json({ message: 'No activity found' });
        }

        res.status(200).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const searchProductTourist = async (req, res) => {
 
    const { name } = req.body;
    try {
       const product = await Product.find({name});
       res.status(200).json(product);
     } catch (error) {
      
       res.status(500).json({ message: 'Error retrieving product', error });
     }
   }


module.exports = {
  getProducts,
  getActivities,
  getitineraries,
  filterActivity,
  searchProductTourist,
};

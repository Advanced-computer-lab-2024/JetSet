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

    // Add condition to only return upcoming activities based on date
    const currentDate = new Date();
    query.date = { ...query.date, $gte: currentDate };

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

const filterProducts = async (req, res) => {
  const { limit } = req.body;
  try {
    const products = await Product.find({ price: { $lte: limit } }).populate("reviews.userId", "name");
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

   // const search = async (req, res) => {
//   const { name, category, tag } = req.query;

//   try {
//       const query = {};

//       // Exact match for name
//       if (name) {
//           query.name = name;
//       }

//       // Validate category ObjectId
//       if (category) {
//           if (!mongoose.isValidObjectId(category)) {
//               return res.status(400).json({ error: 'Invalid category ID' });
//           }
//           const existingCategory = await Category.findById(category);
//           if (!existingCategory) {
//               return res.status(404).json({ error: 'Category not found' });
//           }
//           query.category = category; // Use the validated ObjectId directly
//       }

//       // Check tags against an array of tags
//       if (tag) {
//           query.tags = { $in: tag.split(',').map(t => t.trim()) };
//       }

//       // Log the query for debugging
//       console.log('Query:', JSON.stringify(query, null, 2));

//       // Query all models concurrently
//       const [historicalPlaces, activities, itineraries] = await Promise.all([
//           Historical.find(query),
//           Activity.find(query),
//           Itinerary.find(query)
//       ]);

//       // Merge all the results
//       const results = [
//           ...historicalPlaces,
//           ...activities,
//           ...itineraries
//       ];

//       // If no results found
//       if (results.length === 0) {
//           return res.status(404).json({ message: 'No results found' });
//       }

//       // Return the merged results
//       res.status(200).json(results);
//   } catch (error) {
//       console.error('Error fetching results:', error);
//       res.status(500).json({ error: 'Failed to fetch results', details: error.message });
//   }
// };
   
   


// const touristFilterItineraries = async (req, res) => {
//     const { budget, availabilitydate, tag, language } = req.query;  // Get budget instead of minBudget/maxBudget

//     try {
//         const query = {};

//         // Filter by Budget
//         if (budget) {
//             query.budget = parseFloat(budget);  // Exact match for budget
//         }

//         // Filter by Date (For upcoming itineraries)
//         if (availabilitydate) {
//             query.availabilitydate = { $gte: new Date(availabilitydate) };  // Greater than or equal to the given date
//         }

//         // Filter by Preferences
//         if (tag) {
//             query.tag = { $in: tag.split(',') };  // Matches any of the given preferences
//         }

//         // Filter by Language
//         if (language) {
//             query.language = { $regex: language, $options: 'i' };  // Case-insensitive match
//         }

//         // Query the database for itineraries matching the criteria
//         const itineraries = await itineraryModel.find(query);

//         if (itineraries.length === 0) {
//             return res.status(404).json({ message: 'No itineraries found' });
//         }

//         res.status(200).json(itineraries);
//     } catch (error) {
//         console.error('Error fetching itineraries:', error);  // Log the error for debugging
//         res.status(500).json({ error: 'Failed to fetch itineraries' });
//     }
// };


module.exports = {
  getProducts,
  getActivities,
  getitineraries,
  filterActivity,
  searchProductTourist,
  filterProducts,
  search,
  touristFilterItineraries
};

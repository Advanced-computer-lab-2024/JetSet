// const Product = require("../Models/Product");
// const Activity = require("../Models/Activity");
// const Itinerary = require("../Models/Itinerary");
// const Historical = require("../Models/Historical");
// const Tourist = require("../Models/Tourist.js");
// const { default: mongoose } = require("mongoose");

// const createTourist = async (req, res) => {
//   const { username, password, email, mobile, nationality, dob, job } = req.body;
//   try {
//     const user = await Tourist.create({
//       username: username,
//       password: password,
//       email: email,
//       mobile_number: mobile,
//       nationality: nationality,
//       DOB: dob,
//       job: job,
//     });
//     res.status(200).json({ msg: "Tourist created" });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// const getTouristProfile = async (req, res) => {
//   try {
//     const tourist = await Tourist.findById(req.params.id);
//     if (!tourist) {
//       return res.status(404).json({ message: "Tourist not found" });
//     }
//     res.status(200).json(tourist);
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Error retrieving tourist profile", error });
//   }
// };

// const updateTouristProfile = async (req, res) => {
//   const { username, wallet, ...rest } = req.body;
//   try {
//     const updatedTourist = await Tourist.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: { ...rest },
//       },
//       { new: true }
//     );
//     if (!updatedTourist) {
//       return res.status(404).json({ message: "Tourist not found" });
//     }
//     // Prevent updating username and wallet
//     updatedTourist.username = username;
//     updatedTourist.wallet = wallet;
//     await updatedTourist.save();
//     res.status(200).json(updatedTourist);
//   } catch (error) {
//     res.status(400).json({ message: "Error updating tourist profile", error });
//   }
// };

// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate("reviews.userId", "name");
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// //Sort products by ratings
// const sortProducts = async (req, res) => {
//   const { sortBy = "ratings", sortOrder = -1 } = req.body; // Default to sort by ratings in descending order

//   try {
//     let sortOption = {};
//     if (sortBy === "ratings") {
//       sortOption.ratings = sortOrder; // -1 for descending, 1 for ascending
//     } else {
//       return res
//         .status(400)
//         .json({ error: 'Invalid sort parameter. Use "ratings".' });
//     }

//     const sortedProducts = await Product.find().sort(sortOption);
//     res.json(sortedProducts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

// // Methods for tourists and guests
// const getActivities = async (req, res) => {
//   const { sortBy, sortOrder = {} } = req.body; // sortOrder for ascending/descending

//   try {
//     // Default sort options (optional)
//     let sortOption = {};

//     // Sorting logic
//     if (sortBy && typeof sortBy === "object") {
//       // For sorting by multiple fields
//       Object.keys(sortBy).forEach((field) => {
//         if (["price", "ratings"].includes(field)) {
//           // Use provided sortOrder or default to 1 (ascending)
//           sortOption[field] = sortOrder[field] || 1;
//         }
//       });
//     } else if (sortBy === "price" || sortBy === "ratings") {
//       // For single field sorting
//       sortOption[sortBy] = sortOrder[sortBy] || 1;
//     } else {
//       return res
//         .status(400)
//         .json({ error: 'Invalid sort parameter. Use "price" or "ratings".' });
//     }

//     // Filter for upcoming activities based on 'startDate' (or similar field)
//     const currentDate = new Date(); // Get current date
//     const upcomingActivities = await Activity.find({
//       startDate: { $gte: currentDate },
//     }).sort(sortOption);

//     res.json(upcomingActivities);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

// const getItineraries = async (req, res) => {
//   const { sortBy, sortOrder = {} } = req.body; // sortOrder for ascending/descending

//   try {
//     let sortOption = {};

//     // Sorting logic
//     if (sortBy && typeof sortBy === "object") {
//       Object.keys(sortBy).forEach((field) => {
//         if (["price", "ratings"].includes(field)) {
//           sortOption[field] = sortOrder[field] || 1; // Default to ascending if not provided
//         }
//       });
//     } else if (sortBy === "price" || sortBy === "ratings") {
//       sortOption[sortBy] = sortOrder[sortBy] || 1;
//     } else {
//       return res
//         .status(400)
//         .json({ error: 'Invalid sort parameter. Use "price" or "ratings".' });
//     }

//     const currentDate = new Date();
//     const upcomingItineraries = await Itinerary.find({
//       startDate: { $gte: currentDate },
//     }).sort(sortOption);

//     res.json(upcomingItineraries);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

// const filterActivity = async (req, res) => {
//   const { budget, date, category, rating } = req.body;

//   // Initialize an empty query object
//   let query = {};

//   // Add filters to the query object only if they are provided in the request body
//   if (budget) query.budget = budget;
//   if (date) query.date = date;
//   if (category) query.category = category;
//   if (rating) query.rating = rating;

//   // Add condition to only return upcoming activities based on date
//   const currentDate = new Date();
//   query.date = { ...query.date, $gte: currentDate };

//   try {
//     // Perform the query with dynamic filters
//     const activity = await Activity.find(query);

//     if (activity.length === 0) {
//       return res.status(404).json({ message: "No activity found" });
//     }

//     res.status(200).json(activity);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const searchProductTourist = async (req, res) => {
//   const { name } = req.body;
//   try {
//     const product = await Product.find({ name });
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving product", error });
//   }
// };

// const filterProducts = async (req, res) => {
//   const { limit } = req.body;
//   try {
//     const products = await Product.find({ price: { $lte: limit } }).populate(
//       "reviews.userId",
//       "name"
//     );
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// //    const search = async (req, res) => {
// //   const { name, category, tag } = req.body;

// //   try {
// //       const query = {};

// //       // Exact match for name
// //       if (name) {
// //           query.name = name;
// //       }

// //       // Validate category ObjectId
// //       // if (category) {
// //       //     if (!mongoose.isValidObjectId(category)) {
// //       //         return res.status(400).json({ error: 'Invalid category ID' });
// //       //     }
// //       //     const existingCategory = await Category.findById(category);
// //       //     if (!existingCategory) {
// //       //         return res.status(404).json({ error: 'Category not found' });
// //       //     }
// //       //     query.category = category; // Use the validated ObjectId directly
// //       // }
// //       if (category) {
// //         query.category = { $in: category.split(',') }; // Assumes preferences are sent as comma-separated values
// //       }

// //       // Check tags against an array of tags
// //       if (tag) {
// //           query.tags = { $in: tag.split(',').map(t => t.trim()) };
// //       }

// //       // Log the query for debugging
// //       console.log('Query:', JSON.stringify(query, null, 2));

// //       // Query all models concurrently
// //       const [historicalPlaces, activities, itineraries] = await Promise.all([
// //           Historical.find(query),
// //           Activity.find(query),
// //           Itinerary.find(query)
// //       ]);

// //       // Merge all the results
// //       const results = [
// //           ...historicalPlaces,
// //           ...activities,
// //           ...itineraries
// //       ];

// //       // If no results found
// //       if (results.length === 0) {
// //           return res.status(404).json({ message: 'No results found' });
// //       }

// //       // Return the merged results
// //       res.status(200).json(results);
// //   } catch (error) {
// //       console.error('Error fetching results:', error);
// //       res.status(500).json({ error: 'Failed to fetch results', details: error.message });
// //   }
// // };

// const search = async (req, res) => {
//   try {
//     const { query, category, tag } = req.body;

//     // Build query object dynamically
//     const searchQuery = {};

//     if (query) {
//       // If the user provides a search term, search by name or description
//       searchQuery.$or = [
//         { Name: { $regex: query, $options: "i" } }, // Case-insensitive search in Historical places
//         { description: { $regex: query, $options: "i" } }, // Search in Activity description or Itinerary timeline
//         { timeline: { $regex: query, $options: "i" } },
//         { "activities.title": { $regex: query, $options: "i" } },
//       ];
//     }

//     if (category) {
//       // Fetch category by name
//       const categoryDoc = await Category.findOne({
//         name: { $regex: category, $options: "i" },
//       });

//       if (categoryDoc) {
//         // If category is found, add it to search query for activities
//         searchQuery.category = categoryDoc._id;
//       } else {
//         // If no matching category found, return empty results
//         return res.status(200).json({ results: [] });
//       }
//     }

//     if (tag) {
//       // If the user provides a tag, match the tag across the models
//       searchQuery.tags = { $in: tag.split(",") };
//     }

//     // Fetch results from Historical, Itinerary, and Activity models
//     const historicalResults = await Historical.find(searchQuery).populate(
//       "tags"
//     );
//     const itineraryResults = await Itinerary.find(searchQuery).populate("tag");
//     const activityResults = await Activity.find(searchQuery)
//       .populate("tags")
//       .populate("category", "name");

//     // Combine results into a single array
//     const results = [
//       ...historicalResults,
//       ...itineraryResults,
//       ...activityResults,
//     ];

//     res.status(200).json(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error during search" });
//   }
// };

// const touristFilterItineraries = async (req, res) => {
//   try {
//     const { budget, startDate, endDate, tag, language } = req.body;

//     // Build the query object dynamically
//     const query = {};

//     if (budget) query.budget = budget;
//     if (startDate && endDate) {
//       query.availability_dates = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     }
//     // Filter by preferences (assumes tags reference preferences like 'historic', 'beach', etc.)
//     if (tag) {
//       query.tag = { $in: tag.split(",") }; // Assumes preferences are sent as comma-separated values
//     }

//     // Filter by language
//     if (language) {
//       query.language = language;
//     }

//     // Execute the query
//     const itineraries = await Itinerary.find(query).populate("tag");

//     // Send the filtered itineraries back
//     res.status(200).json(itineraries);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching itineraries" });
//   }
// };

// // Filter historical places/museums by tag
// const filterHistoricalByTag = async (req, res) => {
//   const { tag } = req.body; // Expecting 'tag' from the request body

//   if (!tag) {
//     return res.status(400).json({ error: "Tag is required for filtering." });
//   }

//   try {
//     // Find historical places that contain the specified tag
//     const historicalPlaces = await Historical.find({
//       tags: tag, // Matches the tag within the tags array
//     }).populate("tags", "type period"); // Optionally populate tag details

//     if (historicalPlaces.length === 0) {
//       return res.status(404).json({
//         message: "No historical places found with the specified tag.",
//       });
//     }

//     res.status(200).json(historicalPlaces);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

// module.exports = {
//   getProducts,
//   getActivities,
//   getItineraries,
//   filterActivity,
//   searchProductTourist,
//   filterProducts,
//   touristFilterItineraries,
//   search,
//   createTourist,
//   getTouristProfile,
//   updateTouristProfile,
//   sortProducts,
//   filterHistoricalByTag, // Export the new method
// };

const Product = require("../Models/Product");
const Activity = require("../Models/Activity");
const Itinerary = require("../Models/Itinerary");
const Historical = require("../Models/Historical");
const Tourist = require("../Models/Tourist.js");
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
const getActivities = async (req, res) => {
  const { sortBy, sortOrder = {} } = req.body; // sortOrder for ascending/descending

  try {
    // Default sort options (optional)
    let sortOption = {};

    // Sorting logic
    if (sortBy && typeof sortBy === "object") {
      // For sorting by multiple fields
      Object.keys(sortBy).forEach((field) => {
        if (["price", "ratings"].includes(field)) {
          // Use provided sortOrder or default to 1 (ascending)
          sortOption[field] = sortOrder[field] || 1;
        }
      });
    } else if (sortBy === "price" || sortBy === "ratings") {
      // For single field sorting
      sortOption[sortBy] = sortOrder[sortBy] || 1;
    } else {
      return res
        .status(400)
        .json({ error: 'Invalid sort parameter. Use "price" or "ratings".' });
    }

    // Filter for upcoming activities based on 'startDate' (or similar field)
    const currentDate = new Date(); // Get current date
    const upcomingActivities = await Activity.find({
      startDate: { $gte: currentDate },
    }).sort(sortOption);

    res.json(upcomingActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// const getItineraries = async (req, res) => {
//   const { sortBy = "price", sortOrder = "asc" } = req.query;

//   try {
//     let sortOption = {};
//     if (["price", "ratings"].includes(sortBy)) {
//       sortOption[sortBy] = sortOrder === "asc" ? 1 : -1; // Ascending or Descending
//     } else {
//       return res.status(400).json({ error: 'Invalid sort parameter. Use "price" or "ratings".' });
//     }

//     const currentDate = new Date();
//     const upcomingItineraries = await Itinerary.find({
//       startDate: { $gte: currentDate },
//     }).sort(sortOption);

//     res.status(200).json(upcomingItineraries);
//   } catch (error) {
//     console.error("Error fetching itineraries:", error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };
const getItineraries = async (req, res) => {
  const {
    sortBy = "price",
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

//    const search = async (req, res) => {
//   const { name, category, tag } = req.body;

//   try {
//       const query = {};

//       // Exact match for name
//       if (name) {
//           query.name = name;
//       }

//       // Validate category ObjectId
//       // if (category) {
//       //     if (!mongoose.isValidObjectId(category)) {
//       //         return res.status(400).json({ error: 'Invalid category ID' });
//       //     }
//       //     const existingCategory = await Category.findById(category);
//       //     if (!existingCategory) {
//       //         return res.status(404).json({ error: 'Category not found' });
//       //     }
//       //     query.category = category; // Use the validated ObjectId directly
//       // }
//       if (category) {
//         query.category = { $in: category.split(',') }; // Assumes preferences are sent as comma-separated values
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

const search = async (req, res) => {
  try {
    const { query, category, tag } = req.query;

    // Build query object dynamically
    const searchQuery = {};

    if (query) {
      // If the user provides a search term, search by name or description
      searchQuery.$or = [
        { Name: { $regex: query, $options: "i" } }, // Case-insensitive search in Historical places
        { description: { $regex: query, $options: "i" } }, // Search in Activity description or Itinerary timeline
        { timeline: { $regex: query, $options: "i" } },
        { "activities.title": { $regex: query, $options: "i" } },
      ];
    }

    if (category) {
      // Fetch category by name
      const categoryDoc = await Category.findOne({
        name: { $regex: category, $options: "i" },
      });

      if (categoryDoc) {
        // If category is found, add it to search query for activities
        searchQuery.category = categoryDoc._id; // This will filter activities by category
      } else {
        // If no matching category found, return empty results
        return res.status(200).json({ results: [] });
      }
    }

    if (tag) {
      // If the user provides a tag, match the tag across the models
      searchQuery.tags = { $in: tag.split(",").map((t) => t.trim()) }; // Trim whitespace from tags
    }

    // Fetch results from Historical, Itinerary, and Activity models
    const historicalResults = await Historical.find(searchQuery).populate(
      "tags"
    );
    const activityResults = await Activity.find(searchQuery)
      .populate("tags")
      .populate("category", "name"); // Populate category name

    // Prepare an array of activity IDs to search for itineraries
    const activityIds = activityResults.map((activity) => activity._id);

    // Now search for itineraries that reference those activities
    const itineraryResults = await Itinerary.find({
      activities: { $in: activityIds }, // Filter itineraries based on the found activities
    })
      .populate("tag") // Populate tags if needed
      .populate("activities") // Populate activities to get their details
      .populate("activities.category", "name"); // Populate categories for activities

    // Combine results into a single array
    const results = [
      ...historicalResults,
      ...itineraryResults,
      ...activityResults,
    ];

    // If no results are found, return a default message
    if (results.length === 0) {
      return res.status(200).json({ message: "No results available." });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error during search" });
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

// // Filter historical places/museums by tag
// const filterHistoricalByTag = async (req, res) => {
//   const { tag } = req.body; // Expecting 'tag' from the request body

//   if (!tag) {
//     return res.status(400).json({ error: "Tag is required for filtering." });
//   }

//   try {
//     // Find historical places that contain the specified tag
//     const historicalPlaces = await Historical.find({
//       tags: tag, // Matches the tag within the tags array
//     }).populate("tags", "type period"); // Optionally populate tag details

//     if (historicalPlaces.length === 0) {
//       return res.status(404).json({
//         message: "No historical places found with the specified tag.",
//       });
//     }

//     res.status(200).json(historicalPlaces);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };
// const filterHistoricalByTag = async (req, res) => {
//   const { tag } = req.query; // Expecting 'tag' from the request body

//   if (!tag) {
//     return res.status(400).json({ error: "Tag is required for filtering." });
//   }

//   try {
//     // Ensure the tag is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(tag)) {
//       return res.status(400).json({ error: "Invalid tag format." });
//     }

//     // Find historical places that contain the specified tag
//     const historicalPlaces = await Historical.find({
//       tags: tag, // Matches the tag within the tags array
//     }).populate("tags", "type period"); // Optionally populate tag details

//     if (historicalPlaces.length === 0) {
//       return res.status(404).json({
//         message: "No historical places found with the specified tag.",
//       });
//     }

//     res.status(200).json(historicalPlaces);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

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

module.exports = {
  getProducts,
  getActivities,
  getItineraries,
  filterActivity,
  searchProductTourist,
  filterProducts,
  touristFilterItineraries,
  search,
  createTourist,
  getTouristProfile,
  updateTouristProfile,
  sortProducts,
  filterHistoricalByTag,
  getlistActivities,
  viewAllPlaces, // Export the new method
  getTourist,
};

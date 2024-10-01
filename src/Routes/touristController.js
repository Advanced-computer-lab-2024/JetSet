const Product = require("../Models/Product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("reviews.userId", "name");
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Methods for tourists and guests
app.get("/activities", async (req, res) => {
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
});

app.get("/itineraries", async (req, res) => {
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
});

module.exports = {
  getProducts,
};

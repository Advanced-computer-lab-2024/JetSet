const Activity = require("../Models/Activity");
const TourGuide = require("../Models/TourGuide.js");

const filterActivityGuest = async (req, res) => {
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

const createTourGuide = async (req, res) => {
    const { email, username , password } = req.body;
    
    try {
      await TourGuide.create({
        email: email,
        username: username,
        password: password
      });
      res.status(200).json({ msg: "tour guide is created" });
    } catch (error) {
      res.status(400).json({
        message: "Error creating Tour Guide",
        error: error.message || error,
      });
    }
  };


module.exports = { filterActivityGuest , createTourGuide};
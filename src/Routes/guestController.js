const Activity = require("../Models/Activity");
const itinerariesModel = require('../Models/Itinerary.js');

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
            return res.status(404).json({ message: 'No activity found' });
        }

        res.status(200).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// const guestFilterItineraries = async (req, res) => {
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
//         const itineraries = await itinerariesModel.find(query);

//         if (itineraries.length === 0) {
//             return res.status(404).json({ message: 'No itineraries found' });
//         }

//         res.status(200).json(itineraries);
//     } catch (error) {
//         console.error('Error fetching itineraries:', error);  // Log the error for debugging
//         res.status(500).json({ error: 'Failed to fetch itineraries' });
//     }
// };
module.exports = { filterActivityGuest,guestFilterItineraries};
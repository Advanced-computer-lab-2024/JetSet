const Activity = require("../Models/Activity");
const Product = require("../Models/Product");



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


module.exports = { filterActivity,searchProductTourist };
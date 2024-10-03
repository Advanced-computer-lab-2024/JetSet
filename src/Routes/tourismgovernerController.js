const TourismGoverner = require('../Models/TourismGoverner'); // Adjust the path as needed
const Tag = require('../Models/Tag'); // Adjust the path as needed

const createTourismGoverner = async (req, res) => {
  const { Username, Password } = req.body; // Extract username and password from the request body

  try {
    // Create a new tourism governor
    const newGoverner = await TourismGoverner.create({
      Username,
      Password
    });
    res.status(201).json(newGoverner); // Return the newly created governor with a 201 status
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(400).json({ error: error.message }); // Return any other error
  }
};
const createTag = async (req, res) => {
    const { name, type, period } = req.body;

    try {
        // Check if the tag already exists
        const existingTag = await Tag.findOne({ name });
        if (existingTag) {
            return res.status(400).json({ error: "Tag already exists" });
        }

        // Create a new tag with the new fields
        const newTag = new Tag({ name, type, period });
        const savedTag = await newTag.save();

        // Send response with the created tag
        res.status(201).json(savedTag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTourismGoverner,createTag };

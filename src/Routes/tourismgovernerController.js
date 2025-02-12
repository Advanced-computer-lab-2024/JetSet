const TourismGoverner = require("../Models/TourismGoverner"); // Adjust the path as needed
const Tag = require("../Models/HistoricalTags.js"); // Adjust the path as needed
const Historical = require("../Models/Historical.js");

const { default: mongoose } = require("mongoose");

const loginTourism = async (req, res) => {
  const { user, password } = req.body;

  try {
    // Find the guest by username, password, and role
    const Tourism = await TourismGoverner.findOne({ username: user, password });

    // If guest not found or password does not match, return error
    if (!Tourism) {
      return res.status(404).json({ message: "Regiesterd First" });
    }

    res.status(200).json({
      message: `Welcome ${user}`,
      Tourism,
    });
  } catch (error) {
    res.status(500).json({ message: "Error during authentication.", error });
  }
};

const getTourismbyid = async (req, res) => {
  const { id } = req.params;
  try {
    const tourism = await TourismGoverner.findById(id);

    if (!tourism) {
      return res.status(404).json({ message: "Tourism Governer not found." });
    }
    await tourism.save();
    res.status(200).json({ username: tourism.username });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error retrieving Tourism Governer profile.", error });
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
const createPlaces = async (req, res) => {
  const {
    Name,
    Description,
    location,
    Pictures,
    opening_hours,
    tags,
    TicketPricesF,
    TicketPricesN,
    TicketPricesS,
    managed_by,
  } = req.body;

  try {
    const Place = await Historical.create({
      Name,
      Description,
      location,
      Pictures,
      opening_hours,
      tags,
      TicketPricesF,
      TicketPricesN,
      TicketPricesS,
      managed_by,
    });
    res.status(200).json(Place);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPlaces = async (req, res) => {
  try {
    const places = await Historical.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const AllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePlace = async (req, res) => {
  const { id } = req.params;
  const {
    Name,
    Description,
    location,
    Pictures,
    opening_hours,
    tags,
    TicketPricesF,
    TicketPricesN,
    TicketPricesS,
    managed_by,
  } = req.body;

  try {
    const existingPlace = await Historical.findById(id);

    if (!existingPlace) {
      return res.status(404).json({ error: "Place not found" });
    }

    const updatedPlace = await Historical.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        Name,
        Description,
        location,
        Pictures,
        opening_hours,
        tags,
        TicketPricesF,
        TicketPricesN,
        TicketPricesS,
        managed_by,
      },
      { new: true }
    );

    res.status(200).json(updatedPlace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePlace = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPlace = await Historical.findByIdAndDelete(id);

    if (!deletedPlace) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
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

const changePasswordTourismGoverner = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const tourismgovernerId = req.params.id;

  try {
    const tourismgoverner = await TourismGoverner.findById(tourismgovernerId);
    if (!tourismgoverner) {
      return res.status(404).json({ message: "Tourismgoverner not found" });
    }

    // Skip password hashing, compare directly
    if (tourismgoverner.password !== oldPassword) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Directly assign the new password (plain-text)
    tourismgoverner.password = newPassword;
    await tourismgoverner.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
};
module.exports = {
  viewAllPlaces,
  createPlaces,
  getPlaces,
  AllTags,
  updatePlace,
  deletePlace,
  createTag,
  changePasswordTourismGoverner,
  loginTourism,
  getTourismbyid,
};

const TourismGoverner = require('../Models/TourismGoverner'); // Adjust the path as needed
const Tag = require('../Models/Tag'); // Adjust the path as needed
const Historical = require("../Models/Historical.js");

const { default: mongoose } = require('mongoose');


const viewAllPlaces = async (req, res) => {
  try {
      const places = await Historical.find();
      res.status(200).json(places);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}
const createPlaces = async (req, res) => {
    const { Name, Description, location, Pictures, opening_hours, tags , TicketPricesF, TicketPricesN, TicketPricesS, managed_by } = req.body;

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
            managed_by 
        });
        res.status(200).json(Place);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getPlaces = async (req, res) => {
    try {
        const places = await Historical.find();
        res.status(200).json(places);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const AllTags = async (req, res) => {
    try {
        const tags = await Tag.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



const updatePlace = async (req, res) => {
    const { id } = req.params; 
    const { Name, Description, location, Pictures, opening_hours, tags , TicketPricesF, TicketPricesN, TicketPricesS, managed_by } = req.body;
  
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
          managed_by
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
        const deletedPlace = await Historical.findByIdAndDelete( id );

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
module.exports = { viewAllPlaces , createPlaces, getPlaces,AllTags, updatePlace, deletePlace, createTag };


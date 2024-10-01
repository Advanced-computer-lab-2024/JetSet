const Historical = require('../Models/Historical.js');
const { default: mongoose } = require('mongoose');

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

//const updatePlace = async (req, res) => {
//     const { Name } = req.body; // Extract Name from the body
//     const updates = { ...req.body }; // Copy the entire request body

//     delete updates.Name; // Remove Name from the updates object
//     console.log("Looking for place with Name:", Name);
//     console.log("Request Body:", req.body); // Log the request body
//     console.log("Updates Object:", updates); // Log the updates object

//     try {
//         const updatedPlace = await Historical.updateOne(
//             { Name ,  // Find the place by Name
//             updates }// Return the updated document
//         );
//         console.log("Updated Place:", updatedPlace); // Log the updates object

//         if (!updatedPlace.nModified) { // Check if anything was modified
//             return res.status(404).json({ error: "Place not found or no changes made" });
//         }

//         res.status(200).json(updatedPlace);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
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
    const { Name } = req.body;

    try {
        const deletedPlace = await Historical.findOneAndDelete({ Name });

        if (!deletedPlace) {
            return res.status(404).json({ error: "Place not found" });
        }

        res.status(200).json({ message: "Place deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createPlaces, getPlaces, updatePlace, deletePlace };

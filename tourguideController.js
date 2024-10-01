

const itineraryModel = require('../Models/Itinerary.js'); 
const mongoose = require('mongoose');
const bookingModel = require('../Models/Activity.js'); 

const validateObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id)&& id.length === 24;
};
const createItinerary = async (req, res) => {
    const {
        activities,
        locations,
        timeline,
        duration,
        language,
        price,
        availability_dates,
        pickup_location,
        dropoff_location,
        accessibility,
        budget,
        created_by,
        tags
    } = req.body;

    try {
        const itinerary = await itineraryModel.create({
            activities,
            locations,
            timeline,
            duration,
            language,
            price,
            availability_dates,
            pickup_location,
            dropoff_location,
            accessibility,
            budget,
            created_by,
            tags
        });
        res.status(201).json({ msg: "Itinerary created", itinerary });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getItineraries = async (req, res) => {
    try {
        const itineraries = await itineraryModel.find();
        res.status(200).json(itineraries);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const updateItinerary = async (req, res) => {
    const { id } = req.params; 
    console.log("Received ID for update:", id); // Log the ID

    if (!validateObjectId(id)) {
        return res.status(400).json({ error: "Invalid itinerary ID format" });
    }

    // Extracting fields from the request body
    const {
        activities,
        locations,
        timeline,
        duration,
        language,
        price,
        availability_dates,
        pickup_location,
        dropoff_location,
        accessibility,
        budget,
        created_by,
        tags
    } = req.body;

    try {
        const itinerary = await itineraryModel.findByIdAndUpdate(
            id,
            {
                activities,
                locations,
                timeline,
                duration,
                language,
                price,
                availability_dates,
                pickup_location,
                dropoff_location,
                accessibility,
                budget,
                created_by,
                tags
            },
            { new: true }
        );

        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }
        res.status(200).json(itinerary);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({ error: err.message });
    }
};


const deleteItinerary = async (req, res) => {
    const { id } = req.params;
    console.log("Received ID for deletion:", id); // Log the ID

    if (!validateObjectId(id)) {
        return res.status(400).json({ error: "Invalid itinerary ID format" });
    }
    const {
        activities,
        locations,
        timeline,
        duration,
        language,
        price,
        availability_dates,
        pickup_location,
        dropoff_location,
        accessibility,
        budget,
        created_by,
        tags
    } = req.body;

    try {
        // Check if there are existing bookings for this itinerary
        const hasBookings = await bookingModel.findOne({ itineraryId: id });
        if (hasBookings) {
            return res.status(400).json({ error: "Cannot delete itinerary with existing bookings" });
        }

        // Attempt to delete the itinerary
        const itinerary = await itineraryModel.findByIdAndDelete(
            id,
            {
                activities,
                locations,
                timeline,
                duration,
                language,
                price,
                availability_dates,
                pickup_location,
                dropoff_location,
                accessibility,
                budget,
                created_by,
                tags
            },
            { new: true }
        );
        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }

        // Send a 204 No Content response
        res.status(200).json((itinerary));
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({ error: err.message });
    }
};


module.exports = {
    createItinerary,
    getItineraries,
    updateItinerary,
    deleteItinerary
};

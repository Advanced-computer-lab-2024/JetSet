const TourGuide = require("../Models/TourGuide.js");
const itineraryModel = require("../Models/Itinerary.js");
const mongoose = require("mongoose");
const bookingModel = require("../Models/Activity.js");
//TOURIST ITINERARY
const TouristItinerary = require("../Models/TouristsItinerary.js");
const Tag = require("../Models/Tag.js"); // Assuming tags are stored here

const createTourGuideProfile = async (req, res) => {
  const { mobile_number, years_of_experience, previous_work } = req.body;
  const tourGuideID = req.params.tourGuideID;
  try {
    await TourGuide.findByIdAndUpdate(tourGuideID, {
      mobile_number: mobile_number,
      years_of_experience: years_of_experience,
      previous_work: previous_work,
    });
    res.status(200).json({ msg: "profile is created" });
  } catch (error) {
    res.status(400).json({
      message: "Error creating Tour Guide profile",
      error: error.message || error,
    });
  }
};

const readTourGuideProfile = async (req, res) => {
  const { mobile_number, years_of_experience, previous_work } = req.body;
  const tourGuideID = req.params.tourGuideID;
  try {
    const myProfile = await TourGuide.findById(tourGuideID);
    res.status(200).json({
      username: myProfile.username,
      email: myProfile.email,
      mobile_number: myProfile.mobile_number,
      years_of_experience: myProfile.years_of_experience,
      previous_work: myProfile.previous_work,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating Tour Guide profile",
      error: error.message || error,
    });
  }
};

const getTourGuides = async (req, res) => {
  const { mobile_number, years_of_experience, previous_work } = req.body;
  const tourGuideID = req.params.tourGuideID;
  try {
    const result = await TourGuide.find({});
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: "Error getting Tour Guides",
      error: error.message || error,
    });
  }
};
const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && id.length === 24;
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
    tags,
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
      tags,
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
    tags,
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
        tags,
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
  const { id } = req.body;
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
    tags,
  } = req.body;

  try {
    // Check if there are existing bookings for this itinerary
    const hasBookings = await bookingModel.findOne({ itineraryId: id });
    if (hasBookings) {
      return res
        .status(400)
        .json({ error: "Cannot delete itinerary with existing bookings" });
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
        tags,
      },
      { new: true }
    );
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    // Send a 204 No Content response
    res.status(200).json(itinerary);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(400).json({ error: err.message });
  }
};
const viewCreatedItineraries = async (req, res) => {
  const { id } = req.params;
  try {
    const itineraries = await itineraryModel
      .find({ created_by: id })
      .populate("activities");
    const Tourist = await TouristItinerary.find({ created_by: id }).populate(
      "activities"
    );

    res.status(200).json({
      itineraries: itineraries,
      touristItineraries: Tourist,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createTouristItinerary = async (req, res) => {
  const createdBy = req.params.id;
  const { activities, locations, dateRange, tags } = req.body;

  try {
    const itinerary = await TouristItinerary.create({
      activities,
      locations,
      dateRange,
      tags,
      createdBy,
    });
    res.status(201).json({ msg: "Tourist Itinerary created", itinerary });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const readTouristItinerary = async (req, res) => {
  try {
    const itineraries = await TouristItinerary.find()
      .populate("tags", "name type period")
      .populate("created_by", "name email"); // Adjust fields as needed

    if (!itineraries || itineraries.length === 0) {
      return res.status(404).json({ error: "No itineraries found" });
    }

    res.status(200).json(itineraries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const updateTouristItinerary = async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ error: "Invalid Itinerary ID format" });
  }

  const { activities, locations, dateRange, tags } = req.body;

  try {
    const updatedItinerary = await TouristItinerary.findByIdAndUpdate(
      id,
      {
        activities,
        locations,
        dateRange,
        tags,
      },
      { new: true }
    );

    if (!updatedItinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    res.status(200).json(updatedItinerary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const deleteTouristItinerary = async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ error: "Invalid Itinerary ID format" });
  }

  try {
    const deletedItinerary = await TouristItinerary.findByIdAndDelete(id);
    if (!deletedItinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    res.status(200).json({ message: "Itinerary deleted", deletedItinerary });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getItinerariesByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const itineraries = await TouristItinerary.find({
      "availability_dates.start": { $gte: new Date(startDate) },
      "availability_dates.end": { $lte: new Date(endDate) },
    }).populate("tags", "name type period");

    if (itineraries.length === 0) {
      return res.status(404).json({
        message: "No itineraries found for the specified date range.",
      });
    }

    res.status(200).json(itineraries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createTourGuideProfile,
  getTourGuides,
  readTourGuideProfile,
  createItinerary,
  getItineraries,
  updateItinerary,
  deleteItinerary,
  viewCreatedItineraries,
  createTouristItinerary,
  readTouristItinerary,
  updateTouristItinerary,
  deleteTouristItinerary,
  getItinerariesByDateRange,
};

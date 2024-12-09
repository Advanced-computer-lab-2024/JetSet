const TourGuide = require("../Models/TourGuide.js");
const itineraryModel = require("../Models/Itinerary.js");
const Itinerary = require("../Models/Itinerary.js");
const mongoose = require("mongoose");
const bookingModel = require("../Models/Activity.js");
//TOURIST ITINERARY
const TouristItinerary = require("../Models/TouristsItinerary.js");
const Tourist = require("../Models/Tourist.js");
const Tag = require("../Models/Tag.js"); // Assuming tags are stored here

const path = require("path");
const createTourGuideProfile = async (req, res) => {
  const {
    username,
    password,
    email,
    mobile_number,
    years_of_experience,
    previous_work,
  } = req.body;
  try {
    const imageFilename = req.file ? path.basename(req.file.path) : "";
    const user = await TourGuide.create({
      email: email,
      username: username,
      password: password,
      mobile_number: mobile_number,
      years_of_experience: years_of_experience,
      previous_work: previous_work,
      images: imageFilename,
    });
    res.status(200).json({ msg: "profile is created", user });
  } catch (error) {
    res.status(400).json({
      message: "Error creating Tour Guide profile",
      error: error.message || error,
    });
  }
};

const updateTourGuideProfile = async (req, res) => {
  const { mobile_number, years_of_experience, previous_work } = req.body;
  const tourGuideId = req.params.tourGuideId; // Ensure this matches your route definition
  console.log("Tour Guide ID:", tourGuideId);

  try {
    // Find the tour guide by ID
    const tourGuide = await TourGuide.findById(tourGuideId);

    // If the tour guide does not exist, return an error response
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour Guide not found" });
    }

    // Update the tour guide's profile with provided fields
    if (mobile_number) tourGuide.mobile_number = mobile_number;
    if (years_of_experience)
      tourGuide.years_of_experience = years_of_experience;
    if (previous_work) tourGuide.previous_work = previous_work;

    // Update the image filename if a new image is uploaded
    if (req.file) {
      const imageFilename = path.basename(req.file.path);
      tourGuide.images = imageFilename;
    }

    await tourGuide.save(); // Save the updated profile
    res.status(200).json({ msg: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating Tour Guide profile:", error); // Log the error for debugging
    res.status(400).json({
      message: "Error updating Tour Guide profile",
      error: error.message || error,
    });
  }
};

const readTourGuideProfile = async (req, res) => {
  const tourGuideID = req.params.tourGuideID;
  try {
    const myProfile = await TourGuide.findById(tourGuideID);
    res.status(200).json({
      myProfile,
      username: myProfile.username,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating Tour Guide profile",
      error: error.message || error,
    });
  }
};

const getTourGuides = async (req, res) => {
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

const loginTourGuide = async (req, res) => {
  const { user, password } = req.body;

  try {
    // Find the guest by username, password, and role
    const tourGuide = await TourGuide.findOne({ username: user, password });

    // If guest not found or password does not match, return error
    if (!tourGuide) {
      return res.status(404).json({ message: "Regiesterd First" });
    }

    res.status(200).json({
      message: `Welcome ${user}`,
      tourGuide,
    });
  } catch (error) {
    res.status(500).json({ message: "Error during authentication.", error });
  }
};

const createItinerary = async (req, res) => {
  const {
    name,
    activities,
    budget,
    locations,
    timeline,
    duration,
    language,
    availability_dates,
    pickup_location,
    dropoff_location,
    accessibility,
    tags,
    created_by,
  } = req.body;

  try {
    const itinerary = await itineraryModel.create({
      name,
      activities,
      budget,
      locations,
      timeline,
      duration,
      language,
      availability_dates,
      pickup_location,
      dropoff_location,
      accessibility,
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
    const itineraries = await itineraryModel.find().populate();
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
    name,
    activities,
    budget,
    locations,
    timeline,
    duration,
    language,
    availability_dates,
    pickup_location,
    dropoff_location,
    accessibility,
    created_by,
    tags,
  } = req.body;

  try {
    const itinerary = await itineraryModel.findByIdAndUpdate(
      id,
      {
        name,
        activities,
        budget,
        locations,
        timeline,
        duration,
        language,
        availability_dates,
        pickup_location,
        dropoff_location,
        accessibility,
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
    name,
    activities,
    budget,
    locations,
    timeline,
    duration,
    language,
    availability_dates,
    pickup_location,
    dropoff_location,
    accessibility,
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
        name,
        activities,
        budget,
        locations,
        timeline,
        duration,
        language,
        availability_dates,
        pickup_location,
        dropoff_location,
        accessibility,
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

const gettourguide = async (req, res) => {
  try {
    const users = await TourGuide.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

const changePasswordTourGuide = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const tourguideId = req.params.id;

  try {
    const tourguide = await TourGuide.findById(tourguideId);
    if (!tourguide) {
      return res.status(404).json({ message: "Tourguide not found" });
    }

    // Skip password hashing, compare directly
    if (tourguide.password !== oldPassword) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Directly assign the new password (plain-text)
    tourguide.password = newPassword;
    await tourguide.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
};

const activateItinerary = async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ error: "Invalid itinerary ID format" });
  }

  try {
    const itinerary = await itineraryModel.findById(id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    if (itinerary.booked > 0) {
      return res.status(400).json({ error: "Cannot activate itinerary" });
    }

    // Activate the itinerary
    itinerary.status = "active";
    await itinerary.save();

    res
      .status(200)
      .json({ message: "Itinerary activated successfully", itinerary });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deactivateItinerary = async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ error: "Invalid itinerary ID format" });
  }

  try {
    const itinerary = await itineraryModel.findById(id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    // Check if there are any bookings

    if (itinerary.status === "inactive") {
      return res
        .status(400)
        .json({ error: "Cannot deactivate itinerary already inactive" });
    }

    // Deactivate the itinerary
    itinerary.status = "inactive";
    await itinerary.save();

    res.status(200).json({ message: "Itinerary deactivated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTourGuideAccount = async (req, res) => {
  try {
    const { id } = req.params; // Get tour guide ID from the URL

    // Find the tour guide by ID
    const tourGuide = await TourGuide.findById(id);
    if (!tourGuide) {
      return res
        .status(404)
        .json({ success: false, message: "Tour guide account not found" });
    }

    // Find itineraries created by the tour guide
    const itineraries = await itineraryModel.find({
      created_by: tourGuide._id,
    });

    // Collect all itinerary IDs created by the tour guide
    const itineraryIds = itineraries.map((itinerary) => itinerary._id);

    // Check if any tourists have booked these itineraries
    const touristsWithBookings = await Tourist.find({
      bookedItineraries: { $in: itineraryIds },
    });

    if (touristsWithBookings.length > 0) {
      // If any tourist has booked the itineraries, deny deletion
      return res.status(403).json({
        success: false,
        message: "Cannot delete account: you have booked itineraries",
      });
    }

    // If no tourists have booked the itineraries, delete the tour guide account and their itineraries
    await itineraryModel.deleteMany({ created_by: tourGuide._id }); // Delete itineraries

    await TourGuide.findByIdAndDelete(id); // Delete tour guide account

    return res.status(200).json({
      success: true,
      message: "Tour guide account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while trying to delete the account",
    });
  }
};
const getTourGuideSalesReport = async (req, res) => {
  const { id } = req.query; // Tour Guide's ID passed as a query parameter

  try {
    // Check if the Tour Guide exists
    const tourGuide = await TourGuide.findById(id);
    if (!tourGuide) {
      return res.status(404).json({ error: "Tour Guide not found in the database." });
    }

    let totalRevenue = 0;
    const itineraryDetails = [];

    // Fetch itineraries created by the Tour Guide
    const itineraries = await Itinerary.find({ created_by: tourGuide._id }).exec();

    // Fetch tourists who booked these itineraries
    const bookedItineraryIds = itineraries.map(itinerary => itinerary._id);
    const tourists = await Tourist.find({ bookedItineraries: { $in: bookedItineraryIds } }).exec();

    // Loop through the itineraries and calculate revenue
    itineraries.forEach((itinerary) => {
      const itineraryTourists = tourists.filter(tourist => tourist.bookedItineraries.includes(itinerary._id));

      // Add itinerary details including budget and bookings
      itineraryDetails.push({
        name: itinerary.name,
        budget: itinerary.budget,
        locations: itinerary.locations,
        availability_dates: itinerary.availability_dates,
        bookings: itineraryTourists.map(tourist => ({
          touristId: tourist._id,
          touristName: tourist.username,
          bookingDate: tourist.updatedAt, // Assuming the booking date is the last updated timestamp
        }))
      });

      // Calculate total revenue from the booked itineraries
      itineraryTourists.forEach(tourist => {
        if (itinerary.budget) {
          totalRevenue += itinerary.budget - (itinerary.budget * 0.1); // Assume 10% revenue from itinerary budget
        }
      });
    });

    return res.json({ totalRevenue, itineraryDetails });
  } catch (error) {
    console.error("Error generating Tour Guide sales report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const filterTourGuideSalesReport = async (req, res) => {
  const { id, itinerary, date, month } = req.query; // Include filters in query parameters

  try {
    // Check if the Tour Guide exists
    const tourGuide = await TourGuide.findById(id);
    if (!tourGuide) {
      return res.status(404).json({ error: "Tour Guide not found in the database." });
    }

    // Fetch itineraries created by the Tour Guide
    let itineraries = await itineraryModel.find({ created_by: tourGuide._id }).exec();

    // Apply itinerary filter and ensure it belongs to the Tour Guide
    if (itinerary) {
      itineraries = itineraries.filter(it => it.name === itinerary && it.created_by.equals(tourGuide._id));
    }

    // Fetch tourists who booked these itineraries
    const bookedItineraryIds = itineraries.map(it => it._id);
    let tourists = await Tourist.find({ bookedItineraries: { $in: bookedItineraryIds } }).exec();

    // Apply date and month filters
    if (date || month) {
      const filterDate = date ? new Date(date) : null;
      const filterMonth = month ? parseInt(month) : null;

      tourists = tourists.filter(tourist => {
        return tourist.bookedItineraries.some(bookingId => {
          const bookingItinerary = itineraries.find(it => it._id.equals(bookingId));
          if (!bookingItinerary) return false;

          const bookingDate = new Date(tourist.updatedAt); // Assuming this is the booking date
          if (filterDate && bookingDate.toDateString() !== filterDate.toDateString()) return false;
          if (filterMonth && bookingDate.getMonth() + 1 !== filterMonth) return false;

          return true;
        });
      });
    }

    let totalRevenue = 0;
    const itineraryDetails = [];

    // Loop through the filtered itineraries and calculate revenue
    itineraries.forEach((itinerary) => {
      const itineraryTourists = tourists.filter(tourist => tourist.bookedItineraries.includes(itinerary._id));

      itineraryDetails.push({
        name: itinerary.name,
        budget: itinerary.budget,
        locations: itinerary.locations,
        availability_dates: itinerary.availability_dates,
        bookings: itineraryTourists.map(tourist => ({
          touristId: tourist._id,
          touristName: tourist.username,
          bookingDate: tourist.updatedAt,
        })),
      });

      // Calculate total revenue
      itineraryTourists.forEach(tourist => {
        if (itinerary.budget) {
          totalRevenue += itinerary.budget - (itinerary.budget * 0.1); // Assume 10% revenue
        }
      });
    });

    return res.json({ totalRevenue, itineraryDetails });
  } catch (error) {
    console.error("Error filtering Tour Guide sales report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getTourGuideTouristReport = async (req, res) => {
  const { id } = req.query; // Tour Guide's ID passed as a query parameter

  try {
    // Find the tour guide by ID
    const tourGuide = await TourGuide.findById(id);
    if (!tourGuide) {
      return res.status(404).json({ error: "Tour Guide not found in the database." });
    }

    // Find itineraries created by the tour guide
    const itineraries = await Itinerary.find({ created_by: tourGuide._id }).exec();

    // Initialize total tourists and itinerary details
    let totalTourists = 0;
    const itineraryDetails = [];

    // Loop through each itinerary to calculate tourist data
    for (const itinerary of itineraries) {
      // Find tourists who booked the itinerary
      const tourists = await Tourist.find({ bookedItineraries: itinerary._id }).exec();
      const touristsCount = tourists.length;
      totalTourists += touristsCount;

      itineraryDetails.push({
        name: itinerary.name,
        totalTourists: touristsCount,
        budget: itinerary.budget,
        locations: itinerary.locations,
        availability_dates: itinerary.availability_dates,
        tourists: tourists.map(tourist => ({
          touristId: tourist._id,
          touristName: tourist.username,
          touristEmail: tourist.email,
          touristMobile: tourist.mobile_number,
          bookingDate: tourist.updatedAt, // Assuming the booking date is the last updated timestamp
        }))
      });
    }

    // Respond with the total number of tourists and itinerary details
    res.json({ totalTourists, itineraryDetails });
  } catch (error) {
    console.error("Error generating Tour Guide tourist report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const filterTourGuideTouristReportByMonth = async (req, res) => {
  const { id, month } = req.query; // Tour Guide's ID and filter month as query parameters

  try {
    // Find the tour guide by ID
    const tourGuide = await TourGuide.findById(id);
    if (!tourGuide) {
      return res.status(404).json({ error: "Tour Guide not found in the database." });
    }

    // Find itineraries created by the tour guide
    const itineraries = await Itinerary.find({ created_by: tourGuide._id }).exec();

    if (itineraries.length === 0) {
      return res.status(404).json({ error: "No itineraries found for the Tour Guide." });
    }

    // Validate month input
    const filterMonth = month ? parseInt(month, 10) : null;
    if (filterMonth && (filterMonth < 1 || filterMonth > 12)) {
      return res.status(400).json({ error: "Invalid month provided. Must be between 1 and 12." });
    }

    // Initialize total tourists and filtered itinerary details
    let totalTourists = 0;
    const filteredItineraryDetails = [];

    // Loop through each itinerary to calculate tourist data
    for (const itinerary of itineraries) {
      // Find tourists who booked the itinerary
      let tourists = await Tourist.find({ bookedItineraries: itinerary._id }).exec();

      // Apply month filter
      if (filterMonth) {
        tourists = tourists.filter(tourist => {
          const bookingDate = new Date(tourist.updatedAt); // Using updatedAt as the booking date
          return bookingDate.getMonth() + 1 === filterMonth;
        });
      }

      const touristsCount = tourists.length;
      totalTourists += touristsCount;

      if (touristsCount > 0) {
        filteredItineraryDetails.push({
          name: itinerary.name,
          totalTourists: touristsCount,
          budget: itinerary.budget,
          locations: itinerary.locations,
          availability_dates: itinerary.availability_dates,
          tourists: tourists.map(tourist => ({
            touristId: tourist._id,
            touristName: tourist.username,
            touristEmail: tourist.email,
            touristMobile: tourist.mobile_number,
            bookingDate: tourist.updatedAt, // Using updatedAt for the booking date
          })),
        });
      }
    }

    if (filteredItineraryDetails.length === 0) {
      return res.status(404).json({ error: "No tourists found matching the filter criteria." });
    }

    // Respond with the filtered total number of tourists and itinerary details
    res.json({ totalTourists, filteredItineraryDetails });
  } catch (error) {
    console.error("Error filtering Tour Guide tourist report by month:", error);
    res.status(500).json({ error: "Internal server error" });
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
  gettourguide,
  updateTourGuideProfile,
  activateItinerary,
  deactivateItinerary,
  changePasswordTourGuide,
  deleteTourGuideAccount,
  loginTourGuide,
  getTourGuideSalesReport,
  getTourGuideTouristReport,
  filterTourGuideTouristReportByMonth,
  filterTourGuideSalesReport
};

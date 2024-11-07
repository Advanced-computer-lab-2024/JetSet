const advertiserModel = require("../Models/Advertiser.js");
const Activity = require("../Models/Activity.js");
const Tourist = require("../Models/Tourist.js");
const Transportation = require("../Models/Transportation.js");

const path = require("path");

const createProfile = async (req, res) => {
  const {
    email,
    username,
    password,
    company_name,
    website,
    hotline,
    companyDescription,
  } = req.body;

  try {
    const imageFilename = req.file ? path.basename(req.file.path) : "";

    const profile = await advertiserModel.create({
      email,
      username,
      password,
      company_name,
      website,
      hotline,
      companyDescription,
      images: imageFilename,
    });

    res.status(201).json(profile);
  } catch (err) {
    console.error("Error creating  the profile:", err); // Log the error for debugging
    res.status(400).json({ error: err.message });
  }
};

const getAdsById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Advertiser ID is required." });
  }

  const sanitizedId = id.replace(/:/g, "");
  try {
    const adv = await advertiserModel.findById(sanitizedId); // Use findById to find by MongoDB ID

    if (!adv) {
      return res.status(404).json({ message: "Advertiser not found." });
    }

    // No need to save the document if we are just retrieving it
    res.status(200).json({ adv });
  } catch (error) {
    console.error("Error retrieving Advertisor profile:", error); // Debug log
    // Check for validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation Error", error });
    }
    res
      .status(500)
      .json({ message: "Error retrieving Advertisor profile.", error });
  }
};

const getProfile = async (req, res) => {
  try {
    const profiles = await advertiserModel.find();
    res.status(200).json(profiles);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { company_name, website, hotline, companyDescription } = req.body;

  // Dynamically build the update object
  const updateData = {};

  if (company_name) updateData.company_name = company_name;
  if (website) updateData.website = website;
  if (hotline) updateData.hotline = hotline;
  if (companyDescription) updateData.companyDescription = companyDescription;

  // Conditionally add the image filename if a new file is uploaded
  if (req.file) {
    const imageFilename = path.basename(req.file.path);
    updateData.images = imageFilename;
  }

  try {
    const profile = await advertiserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await advertiserModel.findByIdAndDelete(id);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createActivity = async (req, res) => {
  const {
    title,
    budget,
    date,
    time,
    location,
    category,
    special_discount,
    bookingOpen,
    tags,
  } = req.body;

  try {
    const activity = await Activity.create({
      title, // Add title here
      budget, // Add budget here
      date,
      time,
      location,
      category,
      special_discount,
      bookingOpen,
      tags,
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateActivity = async (req, res) => {
  const { id } = req.params;
  const {
    date,
    time,
    location,
    category,
    special_discount,
    booking_open,
    tags,
  } = req.body;
  const sanitizedId = id.replace(/:/g, "");
  try {
    const activity = await Activity.findByIdAndUpdate(
      sanitizedId,
      {
        date,
        time,
        location,
        category,
        special_discount,
        booking_open,
        tags,
      },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getlistActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const viewCreatedActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const changePasswordAdvertiser = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const advertiserId = req.params.id;

  try {
    const advertiser = await advertiserModel.findById(advertiserId);
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    // Skip password hashing, compare directly
    if (advertiser.password !== oldPassword) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Directly assign the new password (plain-text)
    advertiser.password = newPassword;
    await advertiser.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
};

const getadvertiser = async (req, res) => {
  try {
    const users = await advertiserModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

const createTransportation = async (req, res) => {
  const {
    type,
    company,
    price,
    availability,
    pickup_location,
    dropoff_location,
    creator,
  } = req.body;

  try {
    const transportation = await Transportation.create({
      type,
      company,
      price,
      availability,
      pickup_location,
      dropoff_location,
      creator,
    });

    res
      .status(200)
      .json({ message: "Transportation created successfully", transportation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const gettransportation = async (req, res) => {
  try {
    const transportation = await Transportation.find();
    res.status(200).json({ transportation });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving transpotations", error });
  }
};

const updateActivityCreator = async (req, res) => {
  const { id } = req.params;
  const { creator } = req.body;
  const sanitizedId = id.replace(/:/g, "");
  try {
    const activity = await Activity.findByIdAndUpdate(
      sanitizedId,
      {
        creator,
      },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const deleteAdvertiserAccount = async (req, res) => {
  try {
    const { id } = req.params; // Get advertiser ID from the URL
    console.log(`Request to delete advertiser account with ID: ${id}`);

    // Find the advertiser by ID
    const advertiser = await advertiserModel.findById(id);
    if (!advertiser) {
      console.log(`Advertiser account not found for ID: ${id}`);
      return res
        .status(404)
        .json({ success: false, message: "Advertiser account not found" });
    }
    console.log(`Found advertiser: ${advertiser.username}`);

    // Find activities created by the advertiser
    const activities = await Activity.find({ creator: advertiser._id });
    console.log(`Found activities created by advertiser: ${activities.length}`);

    // Collect all activity IDs created by the advertiser
    const activityIds = activities.map((activity) => activity._id);
    console.log(`Activity IDs: ${activityIds}`);

    // Check if any tourists have booked these activities
    const touristsWithBookings = await Tourist.find({
      bookedActivities: { $in: activityIds },
    });
    console.log(
      `Tourists with bookings for these activities: ${touristsWithBookings.length}`
    );

    if (touristsWithBookings.length > 0) {
      // If any tourist has booked the activities, deny deletion
      console.log(
        "Cannot delete account: there are tourists who have booked activities."
      );
      return res
        .status(403)
        .json({
          success: false,
          message: "Cannot delete account: you have booked activities",
        });
    }

    // If no tourists have booked the activities, delete the advertiser account and their activities
    await Activity.deleteMany({ creator: advertiser._id }); // Delete activities
    console.log(
      `Deleted activities created by advertiser: ${advertiser.username}`
    );

    await advertiserModel.findByIdAndDelete(id); // Delete advertiser account
    console.log(`Deleted advertiser account: ${advertiser.username}`);

    return res
      .status(200)
      .json({
        success: true,
        message: "Advertiser account deleted successfully",
      });
  } catch (error) {
    console.error("Error occurred while deleting advertiser account:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while trying to delete the account",
      });
  }
};
module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  createActivity,
  updateActivity,
  deleteActivity,
  getlistActivities,
  viewCreatedActivities,
  getAdsById,
  changePasswordAdvertiser,
  getadvertiser,
  createTransportation,
  gettransportation,
  updateActivityCreator,
  deleteAdvertiserAccount,
};

const advertiserModel = require("../Models/Advertiser.js");
const Activity = require("../Models/Activity.js");

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
    const profile = await advertiserModel.create({
      email,
      username,
      password,
      company_name,
      website,
      hotline,
      companyDescription,
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
    //console.log("Fetched seller:", seller); // Debug log

    if (!adv) {
      return res.status(404).json({ message: "Advertiser not found." });
    }
    await adv.save();
    res.status(200).json({ adv });
  } catch (error) {
    console.error("Error retrieving Advertisor profile:", error); // Debug log
    res
      .status(400)
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

  try {
    const profile = await advertiserModel.findByIdAndUpdate(
      id,
      { company_name, website, hotline, companyDescription },
      { new: true }
    );

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
};

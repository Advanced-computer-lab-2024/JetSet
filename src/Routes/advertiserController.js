const advertiserModel = require("../Models/Advertiser.js");
const Advertiser = require("../Models/Advertiser.js");
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
    res.status(200).json({ adv, username: adv.username });
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

const loginAdv = async (req, res) => {
  const { user, password } = req.body;

  try {
    // Find the guest by username, password, and role
    const adv = await advertiserModel.findOne({ username: user, password });

    // If guest not found or password does not match, return error
    if (!adv) {
      return res.status(404).json({ message: "Regiesterd First" });
    }

    res.status(200).json({
      message: `Welcome ${user}`,
      adv,
    });
  } catch (error) {
    res.status(500).json({ message: "Error during authentication.", error });
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
    advertiserId,
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
      creator: advertiserId,
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateActivity = async (req, res) => {
  const { id } = req.params;
  const {
    budget,
    date,
    time,
    location,
    category,
    special_discount,
    booking_open,
    tags,
    advertiserId,
  } = req.body;

  const sanitizedId = id.replace(/:/g, ""); // This may be unnecessary depending on your route

  const updatedData = {};

  // Conditionally add fields to the updatedData object if they're provided in the request
  if (budget) updatedData.budget = budget;
  if (date) updatedData.date = date;
  if (time) updatedData.time = time;
  if (location) updatedData.location = location;
  if (category) updatedData.category = category;
  if (special_discount) updatedData.special_discount = special_discount;
  if (booking_open !== undefined) updatedData.booking_open = booking_open;
  if (tags) updatedData.tags = tags;
  if (advertiserId) updatedData.creator = advertiserId;

  try {
    const activity = await Activity.findByIdAndUpdate(
      sanitizedId,
      updatedData,
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
      return res.status(403).json({
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

    return res.status(200).json({
      success: true,
      message: "Advertiser account deleted successfully",
    });
  } catch (error) {
    console.error("Error occurred while deleting advertiser account:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while trying to delete the account",
    });
  }
};

const getAdvertiserSalesReport = async (req, res) => {
  const { id } = req.query; // Advertiser's ID passed as a query parameter

  try {
    // Check if the Advertiser exists
    const advertiser = await Advertiser.findById(id);
    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found in the database." });
    }

    let totalRevenue = 0;
    const activityDetails = [];

    // Fetch activities created by the Advertiser
    const activities = await Activity.find({ creator: advertiser._id }).exec();

    // Fetch tourists who booked these activities
    const bookedActivityIds = activities.map(activity => activity._id);
    const tourists = await Tourist.find({ bookedActivities: { $in: bookedActivityIds } }).exec();

    // Loop through the activities and calculate revenue
    activities.forEach((activity) => {
      const activityTourists = tourists.filter(tourist => tourist.bookedActivities.includes(activity._id));

      // Add activity details including budget and bookings
      activityDetails.push({
        name: activity.title,
        budget: activity.budget,
        location: activity.location,
        date: activity.date,
        bookings: activityTourists.map(tourist => ({
          touristId: tourist._id,
          touristName: tourist.username,
          bookingDate: tourist.updatedAt, // Assuming the booking date is the last updated timestamp
        }))
      });

      // Calculate total revenue from the booked activities
      activityTourists.forEach(tourist => {
        if (activity.budget) {
          totalRevenue += activity.budget - (activity.budget * 0.1); // Assume 10% revenue from activity budget
        }
      });
    });

    return res.json({ totalRevenue, activityDetails });
  } catch (error) {
    console.error("Error generating Advertiser sales report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const filterAdvertiserSalesReport = async (req, res) => {
  const { id, month, date, activity } = req.query; // Added activity to query parameters

  try {
    // Check if the Advertiser exists
    const advertiser = await Advertiser.findById(id);
    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found in the database." });
    }

    let totalRevenue = 0;
    const activityDetails = [];

    // Fetch activities created by the Advertiser
    let activities = await Activity.find({ creator: advertiser._id }).exec();

    // Filter activities by activity title if provided
    if (activity) {
      activities = activities.filter(act => act.title.toLowerCase().includes(activity.toLowerCase()));
    }

    // Loop through each activity and apply month and date filters
    for (const act of activities) {
      const activityMonth = new Date(act.date).getMonth() + 1; // getMonth returns a zero-based month
      const activityDate = new Date(act.date).toDateString(); // Activity date string for comparison

      let applyFilters = true;

      // Apply month filter
      if (month && activityMonth !== parseInt(month)) {
        applyFilters = false;
      }

      // Apply date filter
      if (date && activityDate !== new Date(date).toDateString()) {
        applyFilters = false;
      }

      if (!applyFilters) continue; // Skip the activity if it doesn't pass filters

      // Fetch tourists who booked the activity
      const tourists = await Tourist.find({ bookedActivities: act._id }).exec();

      const activityTouristsCount = tourists.length;
      let activityRevenue = 0;

      if (activityTouristsCount > 0) {
        activityRevenue = act.budget * 0.9; // 90% of the budget is the revenue
        totalRevenue += activityRevenue * activityTouristsCount;
      }

      activityDetails.push({
        name: act.title,
        totalTourists: activityTouristsCount,
        budget: act.budget,
        location: act.location,
        date: act.date,
        revenue: activityRevenue * activityTouristsCount, // Revenue for this specific activity
        tourists: tourists.map(tourist => ({
          touristId: tourist._id,
          touristName: tourist.username,
          touristEmail: tourist.email,
          touristMobile: tourist.mobile_number,
          bookingDate: tourist.updatedAt,
        })),
      });
    }

    // Respond with the total revenue and filtered activity details
    res.json({ totalRevenue, activityDetails });
  } catch (error) {
    console.error("Error filtering Advertiser sales report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAdvertiserTouristReport = async (req, res) => {
  const { id } = req.query; // Advertiser's ID passed as a query parameter

  try {
    // Check if the Advertiser exists
    const advertiser = await Advertiser.findById(id);
    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found in the database." });
    }

    let totalTourists = 0;
    const activityDetails = [];

    // Fetch activities created by the Advertiser
    const activities = await Activity.find({ creator: advertiser._id }).exec();

    // Loop through each activity to calculate tourist data
    for (const activity of activities) {
      // Find tourists who booked the activity
      const tourists = await Tourist.find({ bookedActivities: activity._id }).exec();
      const touristsCount = tourists.length;
      totalTourists += touristsCount;

      activityDetails.push({
        name: activity.title,
        totalTourists: touristsCount,
        budget: activity.budget,
        location: activity.location,
        date: activity.date,
        tourists: tourists.map(tourist => ({
          touristId: tourist._id,
          touristName: tourist.username,
          touristEmail: tourist.email,
          touristMobile: tourist.mobile_number,
          bookingDate: tourist.updatedAt, // Assuming the booking date is the last updated timestamp
        }))
      });
    }

    // Respond with the total number of tourists and activity details
    res.json({ totalTourists, activityDetails });
  } catch (error) {
    console.error("Error generating Advertiser tourist report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const filterAdvertiserTouristReportByMonth = async (req, res) => {
  const { id, month } = req.query; // Advertiser's ID and month filter

  try {
    // Check if the Advertiser exists
    const advertiser = await advertiserModel.findById(id);
    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found in the database." });
    }

    let totalTourists = 0;
    const activityDetails = [];

    // Fetch activities created by the Advertiser
    const activities = await Activity.find({ creator: advertiser._id }).exec();

    // Loop through each activity and apply month filter
    for (const activity of activities) {
      // Filter tourists who booked the activity
      let tourists = await Tourist.find({
        bookedActivities: activity._id,
      }).exec();

      // Apply month filter on activity's date
      const activityMonth = new Date(activity.date).getMonth() + 1; // getMonth returns a zero-based month
      if (activityMonth !== parseInt(month)) {
        continue; // Skip this activity if it doesn't match the requested month
      }

      // Filter tourists based on the activity's booking date
      tourists = tourists.filter(tourist => {
        const bookingMonth = new Date(tourist.updatedAt).getMonth() + 1;
        return bookingMonth === parseInt(month); // Ensure tourist booking is in the same month
      });

      const touristsCount = tourists.length;
      totalTourists += touristsCount;

      activityDetails.push({
        name: activity.title,
        totalTourists: touristsCount,
        budget: activity.budget,
        location: activity.location,
        date: activity.date,
        tourists: tourists.map((tourist) => ({
          touristId: tourist._id,
          touristName: tourist.username,
          touristEmail: tourist.email,
          touristMobile: tourist.mobile_number,
          bookingDate: tourist.updatedAt,
        })),
      });
    }

    // Respond with the total number of tourists and filtered activity details
    res.json({ totalTourists, activityDetails });
  } catch (error) {
    console.error("Error filtering Advertiser tourist report:", error);
    res.status(500).json({ error: "Internal server error" });
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
  loginAdv,
  getAdvertiserSalesReport,
  getAdvertiserTouristReport,
  filterAdvertiserTouristReportByMonth,
  filterAdvertiserSalesReport
};

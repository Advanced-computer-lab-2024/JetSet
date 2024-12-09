const nodemailer = require("nodemailer");
require("dotenv").config();
const TourismGoverner = require("../Models/TourismGoverner");
const Tourist = require("../Models/Tourist");
const TourGuide = require("../Models/TourGuide");
const Seller = require("../Models/Seller");
const Advertiser = require("../Models/Advertiser");
const Admin = require("../Models/Admin");
const Product = require("../Models/Product");
const Category = require("../Models/Category");
const tagModel = require("../Models/Tag");
const Guest = require("../Models/Guest.js");
const Complaint = require("../Models/Complaint");
const itineraryModel = require("../Models/Itinerary.js");
const Activity = require("../Models/Activity.js");
const Notification = require("../Models/Notification.js");
const PromoCode = require("../Models/PromoCode");
const mongoose = require("mongoose");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const roleModelMap = {
  tourismgovernor: TourismGoverner,
  admin: Admin,
  tourist: Tourist,
  tourguide: TourGuide,
  seller: Seller,
  advertisor: Advertiser,
};

const forgetPass = async (req, res) => {
  const { username, role } = req.body;

  if (!roleModelMap[role]) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const UserModel = roleModelMap[role]; // Get the model dynamically based on role
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Construct the reset password link
    const resetLink = `${
      process.env.FRONTEND_URL
    }/reset-password?username=${encodeURIComponent(
      username
    )}&role=${encodeURIComponent(role)}&otp=${otp}`;

    // Send OTP and reset link via email
    const mailOptions = {
      from: {
        name: "JetSet",
        address: process.env.EMAIL_USER, // Corrected to reference the environment variable
      },
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.username},</p>
        <p>You have requested to reset your password. Use the button below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you,</p>
        <p>Admin</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Store OTP in the user's document
    user.resetOtp = otp;
    await user.save();

    res.status(200).json({ message: "Reset password link sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending reset password link", error });
  }
};

const restPass = async (req, res) => {
  const { username, role, otp, newPassword } = req.body;

  if (!roleModelMap[role]) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const UserModel = roleModelMap[role]; // Get the model dynamically based on role
    const user = await UserModel.findOne({ username });

    if (!user || user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Hash the new password
    user.password = newPassword;
    user.resetOtp = null; // Clear OTP after reset
    await user.save();

    res.status(200).json({ message: "Password successfully updated" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error });
  }
};

const getAdminbyid = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "admin not found." });
    }
    await admin.save();
    res.status(200).json({ admin, username: admin.username });
  } catch (error) {
    console.error("Error retrieving admin profile:", error); // Debug log
    res.status(400).json({ message: "Error retrieving admin profile.", error });
  }
};

const loginAdmin = async (req, res) => {
  const { user, password } = req.body;

  try {
    // Find the guest by username, password, and role
    const admin = await Admin.findOne({ username: user, password });

    // If guest not found or password does not match, return error
    if (!admin) {
      return res.status(404).json({ message: "Regiesterd First" });
    }

    res.status(200).json({
      message: `Welcome ${user}`,
      admin,
    });
  } catch (error) {
    res.status(500).json({ message: "Error during authentication.", error });
  }
};

//Tourism Governer
const createTourismGoverner = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if the Username already exists
    const existingGovernor = await TourismGoverner.findOne({ username });
    if (existingGovernor) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create the new Tourism Governor (without password hashing)
    const newGovernor = await TourismGoverner.create({
      username: username,
      password: password,
      email: email,
    });

    res
      .status(200)
      .json({ message: "Tourism Governor created", data: newGovernor });
  } catch (error) {
    res.status(400).json({
      message: "Error creating Tourism Governor",
      error: error.message || error,
    });
  }
};

const gettourism = async (req, res) => {
  try {
    const users = await TourismGoverner.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

//Admin
const createAdmin = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    await Admin.create({
      username,
      password,
      email,
    });
    res.status(200).json({ msg: "Admin created" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating Admin", error: error.message || error });
  }
};
const viewAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find(); // Fetch all complaints from the database
    res.status(200).json(complaints); // Send complaints in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch complaints from database" });
  }
};
//Product
const createProduct = async (req, res) => {
  const { name, desciption, price, quantity, seller_id, admin_id } = req.body;
  try {
    await Product.create({
      name: name,
      price: price,
      description: desciption,
      quantity: quantity,
      seller_id: seller_id,
      admin_id: admin_id,
    });
    res.status(200).json({ msg: "Product created" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating Admin", error: error.message || error });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, quantity, seller_id } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        quantity,
        seller_id,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ msg: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(400).json({
      message: "Error updating product",
      error: error.message || error,
    });
  }
};

const getProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: "reviews.touristId",
        select: "username", // Only get the username field
      })
      .populate({
        path: "seller_id",
        select: "username",
      });
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Sort products by ratings
const sortProducts = async (req, res) => {
  const { sortBy = "ratings", sortOrder = -1 } = req.body; // Default to sort by ratings in descending order

  try {
    let sortOption = {};
    if (sortBy === "ratings") {
      sortOption.ratings = sortOrder; // -1 for descending, 1 for ascending
    } else {
      return res
        .status(400)
        .json({ error: 'Invalid sort parameter. Use "ratings".' });
    }

    const sortedProducts = await Product.find().sort(sortOption);
    res.json(sortedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const category = await Category.create({ name });
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.find({});
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories", error });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(deletedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};

const searchProductAdmin = async (req, res) => {
  const { name } = req.body;
  try {
    const product = await Product.find({ name });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

const deleteAccount = async (req, res) => {
  const { accountUsername, accountType } = req.body;

  let model;
  switch (accountType) {
    case "Tourist":
      model = Tourist;
      break;
    case "Tour Guide":
      model = TourGuide;
      break;
    case "Seller":
      model = Seller;
      break;
    case "Advertiser":
      model = Advertiser;
      break;
    case "Tourism Governor":
      model = TourismGoverner;
      break;
    default:
      return res.status(400).json({ message: "Invalid account type" });
  }

  const deletedAccount = await model.findOneAndDelete({
    username: accountUsername,
  });
  if (!deletedAccount) {
    return res.status(404).json({ message: "Account not found" });
  }

  res.status(200).json({
    message: `${accountType} deleted successfully`,
    deletedAccount: deletedAccount,
  });
};

const createPrefTag = async (req, res) => {
  const { name, type, period } = req.body;

  try {
    const newTag = new tagModel({ name, type, period });
    await newTag.save();
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ error: "Failed to create tag" });
  }
};
// Get all tags
const getPrefTag = async (req, res) => {
  try {
    const tags = await tagModel.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

// Update a tag
const updatePrefTag = async (req, res) => {
  const { id } = req.query;
  const { name, type, period } = req.body;

  try {
    const updatedTag = await tagModel.findByIdAndUpdate(
      id,
      { name, type, period },
      { new: true }
    );
    if (!updatedTag) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(500).json({ error: "Failed to update tag" });
  }
};

// Delete a tag
const deletePrefTag = async (req, res) => {
  const { id } = req.query;

  try {
    const deletedTag = await tagModel.findByIdAndDelete(id);
    if (!deletedTag) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tag" });
  }
};

const getguests = async (req, res) => {
  try {
    const users = await Guest.find({ flag: false });
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

const getadmin = async (req, res) => {
  try {
    const users = await Admin.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

const acceptguest = async (req, res) => {
  const guestId = req.params.id;
  try {
    const guest = await Guest.findById(guestId);

    if (!guest) {
      return res.status(404).json({ message: "Guest not found." });
    }

    // Set the flag to true
    guest.flag = true;
    await guest.save();

    res.status(200).json({
      message: `${guest.role} accepted and added to their respective collection.`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error accepting guest.", error });
  }
};

// Reject Guest and Remove from Guest Schema
const rejectguest = async (req, res) => {
  const guestId = req.params.id;

  try {
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found." });
    }

    // Remove the guest from the Guest collection
    await Guest.findByIdAndDelete(guestId);

    res.status(200).json({ message: "Guest has been rejected and removed." });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting guest.", error });
  }
};

const changePasswordAdmin = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const adminId = req.params.id;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Skip password hashing, compare directly
    if (admin.password !== oldPassword) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Directly assign the new password (plain-text)
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
};

const sendMail = async (transporter, mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

const flagItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const { flag } = req.body; // Expecting true for flag, false for unflag

    // Find the itinerary by ID and update the flag status
    const updated = await itineraryModel.findByIdAndUpdate(
      id,
      { flag: flag }, // Set flag field based on the passed status
      { new: true } // Return the updated document
    );

    if (!updated) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Find the tour guide who created the itinerary
    const tourGuide = await TourGuide.findById(updated.created_by);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    // Send an email notification to the tour guide
    const mailOptions = {
      from: {
        name: "JetSet",
        address: process.env.EMAIL_USER, // Corrected to reference the environment variable
      },
      to: tourGuide.email,
      subject: flag
        ? "Your Itinerary Has Been Flagged as Inappropriate"
        : "Your Itinerary Has Been Unflagged",
      text: flag
        ? `Dear ${tourGuide.username},\n\nYour itinerary "${updated.name}" has been flagged as inappropriate by the admin.\n\nBest Regards,\nAdmin Team`
        : `Dear ${tourGuide.username},\n\nYour itinerary "${updated.name}" has been reviewed and unflagged.\n\nBest Regards,\nAdmin Team`,
    };

    sendMail(transporter, mailOptions);

    // Create a notification for the tour guide
    const notification = new Notification({
      recipient: tourGuide.username,
      role: "Tour Guide", // Assuming the role is Tour Guide
      message: flag
        ? `Your itinerary "${updated.name}" has been flagged as inappropriate by the admin.`
        : `Your itinerary "${updated.name}" has been unflagged.`,
    });

    // Save the notification to the database
    await notification.save();

    // Return the response
    const statusMessage = flag ? "Itinerary flagged" : "Itinerary unflagged";
    res.status(200).json({ message: statusMessage, itinerary: updated });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

const flagActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { flag } = req.body; // Expecting true for archive, false for unarchive

    // Find product by ID and update the archive status
    const updated = await Activity.findByIdAndUpdate(
      id,
      { flag: flag }, // Set archive field based on the passed status
      { new: true } // Return the updated document
    );

    if (!updated) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const adv = await Advertiser.findById(updated.creator);
    if (!adv) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    const mailOptions = {
      from: {
        name: "JetSet",
        address: process.env.EMAIL_USER, // Corrected to reference the environment variable
      },
      to: adv.email,
      subject: flag
        ? "Your Event Has Been Flagged as Inappropriate"
        : "Your Event Has Been Unflagged",
      text: flag
        ? `Dear ${adv.username},\n\nYour Event "${updated.title}" has been flagged as inappropriate by the admin.\n\nBest Regards,\nAdmin Team`
        : `Dear ${adv.username},\n\nYour Event "${updated.title}" has been reviewed and unflagged.\n\nBest Regards,\nAdmin Team`,
    };

    sendMail(transporter, mailOptions);

    const notification = new Notification({
      recipient: adv.username,
      role: "Advertiser", // Assuming the role is Tour Guide
      message: flag
        ? `Your Activity "${updated.title}" has been flagged as inappropriate by the admin.`
        : `Your Activity "${updated.title}" has been unflagged.`,
    });

    // Save the notification to the database
    await notification.save();

    const statusMessage = flag ? "Activity flagged" : "Activity unflagged";
    res.status(200).json({ message: statusMessage, itinerary: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating archive status", error });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    // Validate status value
    if (!["pending", "resolved"].includes(state)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { state },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint status updated", complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const addReplyToComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { reply },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Reply added to complaint", complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get complaints sorted by date
const getComplaintsSortedByDate = async (req, res) => {
  try {
    const { order = "desc" } = req.query; // Default to descending order
    const complaints = await Complaint.find().sort({
      date: order === "asc" ? 1 : -1,
    });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getComplaintsByStatus = async (req, res) => {
  try {
    const { state } = req.query; // Get status from query parameter
    if (!state) {
      return res.status(400).json({ message: "Status is required" });
    }

    const complaints = await Complaint.find({ state }); // Filter complaints by status
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const createPromoCode = async (req, res) => {
  const { discount, expirationDate } = req.body; // Discount percentage/fixed value & expiry date
  const adminId = req.adminId; // Assuming admin's ID is passed via middleware

  try {
    // Generate a unique promo code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase(); // Example: 8-character alphanumeric code

    // Create a new promo code in the database
    const newPromoCode = await PromoCode.create({
      code,
      discount,
      expirationDate,
      createdBy: adminId,
    });

    res
      .status(201)
      .json({ message: "Promo code created", promoCode: newPromoCode });
  } catch (error) {
    res.status(500).json({ message: "Error creating promo code", error });
  }
};

const getSalesReport = async (req, res) => {
  const { id: adminId } = req.query;  // Accessing adminId from the query parameter

  // Check if adminId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({
      message: "Invalid admin ID format",
    });
  }

  try {
    // Fetch all tourists
    const tourists = await Tourist.find()
      .populate("bookedActivities")
      .populate("bookedItineraries");

    // Fetch all products belonging to the admin, including purchase records
    const products = await Product.find({ seller_id: new mongoose.Types.ObjectId(adminId) })
      .populate("purchaseRecords"); // Assuming purchaseRecords is a field in Product

    // Filter activities booked and paid for online by tourists
    const bookedActivities = [];
    const bookedItineraries = [];

    tourists.forEach((tourist) => {
      if (tourist.bookedActivities.length > 0) {
        bookedActivities.push(...tourist.bookedActivities);
      }
      if (tourist.bookedItineraries.length > 0) {
        bookedItineraries.push(...tourist.bookedItineraries);
      }
    });

    // Remove duplicates
    const uniqueBookedActivities = Array.from(
      new Set(bookedActivities.map((activity) => activity._id.toString()))
    ).map((id) => bookedActivities.find((activity) => activity._id.toString() === id));

    const uniqueBookedItineraries = Array.from(
      new Set(bookedItineraries.map((itinerary) => itinerary._id.toString()))
    ).map((id) => bookedItineraries.find((itinerary) => itinerary._id.toString() === id));

    // Calculate revenues for activities and itineraries
    const activityRevenue = uniqueBookedActivities.reduce(
      (total, activity) => total + (activity.budget || 0) * 0.1,
      0
    );

    const itineraryRevenue = uniqueBookedItineraries.reduce(
      (total, itinerary) => total + (itinerary.budget || 0) * 0.1,
      0
    );

    // Calculate revenues for products based on purchase records
    const productRevenue = products.reduce(
      (total, product) => {
        const productRevenue = product.purchaseRecords.reduce((revenue, record) => {
          return revenue + (record.quantity * product.price - (record.quantity * product.price * 0.1));
        }, 0);
        return total + productRevenue;
      },
      0
    );

    // Total revenue
    const totalRevenue = activityRevenue + itineraryRevenue + productRevenue;

    // Response with overall and individual reports
    res.status(200).json({
      message: "Sales Report",
      totalRevenue,
      breakdown: {
        activityRevenue,
        itineraryRevenue,
        productRevenue,
      },
      individualReports: {
        activities: uniqueBookedActivities.map((activity) => ({
          id: activity._id,
          title: activity.title,
          budget: activity.budget,
          revenue: (activity.budget || 0) * 0.1,
        })),
        itineraries: uniqueBookedItineraries.map((itinerary) => ({
          id: itinerary._id,
          name: itinerary.name,
          budget: itinerary.budget,
          revenue: (itinerary.budget || 0) * 0.1,
        })),
        products: products.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          sales: product.sales,
          revenue: product.purchaseRecords.reduce((revenue, record) => {
            return revenue + (record.quantity * product.price - (record.quantity * product.price * 0.1));
          }, 0),
          purchaseRecords: product.purchaseRecords.map((record) => ({
            touristUsername: record.touristUsername,
            touristEmail: record.touristEmail,
            quantity: record.quantity,
            purchaseDate: record.purchaseDate,
          })),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating sales report",
      error: error.message || error,
    });
  }
};

const getFilteredSalesReport = async (req, res) => {
  const { id, product, date, month } = req.query; // Extract filters from query

  // Validate admin ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }

  try {
    // Fetch admin by ID
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // Fetch all products belonging to the admin, including purchase records
    const productFilter = { seller_id: new mongoose.Types.ObjectId(id) };
    if (product) {
      productFilter.name = { $regex: new RegExp(product, 'i') }; // Filter by product name using regex (case-insensitive)
    }

    const products = await Product.find(productFilter)
      .populate("purchaseRecords") // Assuming purchaseRecords is a field in Product
      .exec();

    // Filter purchase records based on date or month
    const filteredProductDetails = products
      .map((product) => {
        // Filter purchase records based on date or month
        const filteredPurchaseRecords = product.purchaseRecords.filter((record) => {
          const purchaseDate = new Date(record.purchaseDate);

          // Apply date filter if provided
          const isDateMatch = date ? purchaseDate.toISOString().split('T')[0] === date : true;

          // Apply month filter if provided
          const isMonthMatch = month
            ? purchaseDate.getMonth() + 1 === parseInt(month) // Months are 0-indexed
            : true;

          // Include records matching both filters or all records if no filters
          return isDateMatch && isMonthMatch;
        });

        const productRevenue = filteredPurchaseRecords.reduce((total, record) => {
          return total + (record.quantity * product.price - (record.quantity * product.price * 0.1));
        }, 0);
        
        return {
          productId: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity, // Remaining stock
          ratings: product.ratings,
          sales: product.sales || 0,
          revenue: productRevenue,
          purchaseRecords: filteredPurchaseRecords.map((record) => ({
            touristId: record.tourist?._id,
            touristUsername: record.tourist?.username,
            touristEmail: record.tourist?.email,
            purchaseDate: record.purchaseDate,
            quantity: record.quantity,
          })),
        };
      })
      .filter((product) => product.purchaseRecords.length > 0 || (!date && !month)); // Only include products with matching records or all if no filters

    // Calculate total revenue for filtered products
    let totalRevenue = 0;
    filteredProductDetails.forEach((product) => {
      totalRevenue += product.revenue;
    });

    // Send response with filtered details
    res.status(200).json({
      message: `Filtered sales report for admin: ${admin.username}`,
      adminDetails: {
        id: admin._id,
        name: admin.username,
        email: admin.email,
        images: admin.images,
      },
      totalRevenue,
      products: filteredProductDetails,
    });
  } catch (error) {
    console.error("Error filtering sales report:", error);
    res.status(500).json({
      message: "Error filtering sales report",
      error: error.message || error,
    });
  }
};

const getAllUserStatistics = async (req, res) => {
  try {
    // Count total users for each model
    const totalTourists = await Tourist.countDocuments();
    const totalTourGuides = await TourGuide.countDocuments();
    const totalAdvertisers = await Advertiser.countDocuments();
    const totalGovernors = await TourismGoverner.countDocuments();
    const totalSellers = await Seller.countDocuments();

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Count new users per month for each model
    const monthlyTourists = await Tourist.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          "_id.year": currentYear,
        },
      },
      {
        $project: {
          month: "$_id.month",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const monthlyTourGuides = await TourGuide.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          "_id.year": currentYear,
        },
      },
      {
        $project: {
          month: "$_id.month",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const monthlyAdvertisers = await Advertiser.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          "_id.year": currentYear,
        },
      },
      {
        $project: {
          month: "$_id.month",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const monthlyGovernors = await TourismGoverner.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          "_id.year": currentYear,
        },
      },
      {
        $project: {
          month: "$_id.month",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const monthlySellers = await Seller.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          "_id.year": currentYear,
        },
      },
      {
        $project: {
          month: "$_id.month",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      totalUsers: {
        tourists: totalTourists,
        tourGuides: totalTourGuides,
        advertisers: totalAdvertisers,
        governors: totalGovernors,
        sellers: totalSellers,
      },
      monthlyUsers: {
        tourists: monthlyTourists,
        tourGuides: monthlyTourGuides,
        advertisers: monthlyAdvertisers,
        governors: monthlyGovernors,
        sellers: monthlySellers,
      },
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createTourismGoverner,
  createAdmin,
  createProduct,
  updateProduct,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  searchProductAdmin,
  deleteAccount,
  createPrefTag,
  getPrefTag,
  updatePrefTag,
  deletePrefTag,
  getProductsAdmin,
  sortProducts,
  gettourism,
  getguests,
  acceptguest,
  rejectguest,
  changePasswordAdmin,
  getadmin,
  viewAllComplaints,
  flagItinerary,
  flagActivity,
  updateComplaintStatus,
  addReplyToComplaint,
  getComplaintsSortedByDate,
  getComplaintsByStatus,
  loginAdmin,
  getAdminbyid,
  forgetPass,
  restPass,
  createPromoCode,
  getAllUserStatistics,
  getSalesReport,
  getFilteredSalesReport
};

# JetSet

## Table of Contents
1. [🌍 JetSet](#-JetSet)
2. [🚀 Motivation](#-motivation)
3. [🛠️ Build Status](#-build-status)
4. [🎨 Code Style](#-code-style)
5. [📸 Screenshots](#screenshots)
6. [⚒️ Tech and Framework used](#-tech-and-framework-used)
7. [✨ Features](#features)
8. [💻 Code Examples](#-code-examples)
9. [🪛 Installation](#-installation)
10. [📚 API Reference](#-api-reference)
11. [🧪 Tests](#-tests)
12. [❓ How to Use](#-how-to-use)
13. [🤝 Contribute](#-contribute)
14. [🏆 Credits](#-credits)
15. [📜 License](#-license)

## 🌍 JetSet
Introducing JetSet the all-in-one travel platform, designed to make your vacation planning effortless
and exciting! Whether you’re dreaming of historic landmarks, relaxing beaches,
or family-friendly adventures, our app brings everything together for the perfect trip.

## 🚀 Motivation
We created this project to make travel planning very simple and exciting. Our aim is to make a simple and user-friendly app inorder to make trip planning enjoyable and accessible for everyone.

## 🛠️ Build Status
Routing between frontend and backend was difficult at the beginning because if the method name is not the same in both,due to a spelling mistake it wont't work.
Booking third party flights and notifications to show up on the app took a huge amount of time.
Conflicts arise when merging on github.
Mongoodb connections, as it doesn't work at all if the internet is orange.

## 🎨 Code Style
We have used ESLint and Prettier styles.

## 📸 Screenshots
### **Register**
![Register](https://github.com/user-attachments/assets/b1662e3e-3c42-4fdf-9538-63e9a0eca3dc)
### **Login**
![Login](https://github.com/user-attachments/assets/9da521fe-e33a-4fea-9ab6-8aa1b5429631)
### **Advertiser Profile**
![Advertiser profile](https://github.com/user-attachments/assets/8e866ed3-9746-4dbf-82c1-e5d28bec5304)
### **Tourist Profile**
![tourist profile](https://github.com/user-attachments/assets/f24000e6-1359-4045-90db-6a46174f851e)

## ⚒️ Tech and Framework used

- [NodeJs](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [ReactJs](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Postman](https://www.postman.com/)

## ✨ Features 

1. **Personalized Travel Planning:** Tailor your trips based on preferences like beaches, shopping, and more.  
2. **Seamless Booking:** Book flights, hotels, and transport directly through trusted services.  
3. **Smart Budgeting:** Activity suggestions within your budget after considering major expenses.  
4. **Discover Local Gems:** Explore curated attractions, complete with ticket prices and directions.  
5. **Real-Time Notifications:** Get updates on bookings and activities.  
6. **Tour Guide Itineraries:** Create custom itineraries or join guided tours.  
7. **In-App Gift Shop:** Buy products directly from the app.  

## 💻 Code Examples
### **Model HistoricalTag**
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const historicalTagSchema = new Schema({
    type: {
      type: String,
      required: true
    },
    period: {
        type: String,
        required: true
      }

  }, { timestamps: true });
  
  const Tag = mongoose.model('HistoricalTags', historicalTagSchema);
  module.exports = Tag;
So, in model you write all your attributes that you will use.

### **Route Admin**
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
        name: "Admin",
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
};
So, in route you write the functions you will to perform and test.

### **Frontend**
import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoryAndActivity = ({ touristId }) => {
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);
  // Fetch categories from the backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/category")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

  const fetchConversionRate = async (currency) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tourist/${touristId}/preferredCurrency`
      );
      setSelectedCurrency(response.data.preferredCurrency); // Set the currency

      setConversionRate(response.data.conversionRate); // Set the conversion rate
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  useEffect(() => {
    fetchConversionRate(selectedCurrency);
  }, [selectedCurrency]);

  // Fetch activities based on selected category
  const fetchActivities = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/activities/by-category?category=${categoryId}`
      );
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    }
  };

  // Handle category selection
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    fetchActivities(categoryId); // Fetch activities when category changes
  };

  return (
    <div>
      <h1>Select a Category</h1>
      <select onChange={handleCategoryChange} value={selectedCategory}>
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <h2>Activities</h2>
      {activities.length > 0 ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity._id}>
              <h3>{activity.title}</h3>
              <p>
                <strong>Budget:</strong>{" "}
                {(activity.budget * conversionRate).toFixed(2)}
                {selectedCurrency}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(activity.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {activity.time}
              </p>
              <p>
                <strong>Location:</strong> {activity.location}
              </p>
              <p>
                <strong>Special Discount:</strong> {activity.special_discount}
              </p>
              <p>
                <strong>Booking Open:</strong>{" "}
                {activity.bookingOpen ? "Yes" : "No"}
              </p>
              {activity.ratings.length > 0 ? (
                <div>
                  <h4>Ratings:</h4>
                  {activity.ratings.map((rating, index) => (
                    <p key={index}>
                      {rating.touristId} - {rating.rating} stars -{" "}
                      {rating.comment}
                    </p>
                  ))}
                </div>
              ) : (
                <p>No ratings yet.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities found for this category.</p>
      )}
    </div>
  );
};

export default CategoryAndActivity;
This is how to make your frontend and connect it with your backend. Using same test name written the app.js in the backend.

## 🪛 Installation

- You need to have [Node](https://nodejs.org/en) and [Visual Studio Code](https://code.visualstudio.com/download) installed and you also need to have [MongoDB](https://www.mongodb.com/atlas/database) and [Postman](https://www.postman.com/downloads/)downloaded.
Install those packages[Nodemon,Axios,git,React,Mongoose,Express](https://www.npmjs.com/).
For MongoDB (https://www.youtube.com/watch?v=s0anSjEeua8&list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE&index=4)check this video from 1:00 - 2:40 will help you use it.
And later on check it from 3:20 - 6:10 will help you connect to your database in your code. 

Steps to Run:
Make a folder for JetSet
In the terminal write git clone https://github.com/Advanced-computer-lab-2024/JetSet.git

# Run the backend
cd JetSet
cd src
npm install 
node app
 
# Run the frontend
cd JetSet
cd JetSet
cd src
npm install
npm start


## 📚 API Reference

### **Places**

- **POST** `/addPlace` - Create a new Place
  - **Request body:**  
    - `Name`: `string`  
    - `Description`: `string`  
    - `Location`: {- `address`: `string` 
                   - `coordinates`:{- `lat`: `number` 
                                    - `lng`: `number` }
                      }
    - `Pictures`: `string[]` 
    - `opening_hours`: `string` 
    - `TicketPricesF`: `number` 
    - `TicketPricesN`: `number` 
    - `TicketPricesS`: `number` 
    - `managed_by`: `TourismGovernor`  
  - **Response:** The created place

- **GET** `/Places` - Get all places  
  - **Response:** A list of all places
    ```json
    [
    {
        "_id": "6703b76ffa4603592f12f6cd",
        "Name": "museum",
        "Description": "educational",
        "Pictures": [],
        "opening_hours": "8 am",
        "tags": [],
        "TicketPricesF": 300,
        "TicketPricesN": 200,
        "TicketPricesS": 100,
        "createdAt": "2024-10-07T10:26:55.409Z",
        "updatedAt": "2024-10-07T10:26:55.409Z",
        "__v": 0
    }
    ]
    ```
- **PUT** `/updatePlace/id` - Update a Place by it's id
- **DELETE** `/deletePlace/id` - Delete a Place by it's id


---

### **Tag**

  - **POST** `/createTag` - Creates a new tag
    - **Request body:**  
      - `name`: `string`  
      - `type`: `string`  
      - `period`: `string`  
    - **Response:** The created tag

## 🧪 Tests

We use `Postman` to manually test all our api references to make sure we get the expected output.

Here is an example:
![Tests](https://github.com/user-attachments/assets/259461f2-cef1-4619-bcac-ea88476375bb)
We choose from the dropdown list whether(get) to retrieve date or (post) to add data or (put) to update data or (delete) to delete the data.
You add you localhost:(Your Port)/your method name. 
If id is needed you do this localhost:(Your Port)/your method name/id.
Once you press send you receive your output.


## ❓ How to Use

- Make sure to follow the [Installation](#-installation) steps first

- Add a `.env` in the `src` in the `backend` like this:

MONGO_URI="<Your Mongo Connection String>"
PORT=3000

Once you run as shown in the installation process, you are able to:
 
Create an Account: Whether login or signup.
Plan Your Trip: Use the app to select destinations, book flights, and accommodations.
Get Notifications: Stay informed about bookings and events.

You will also find a step-by-step guide on how to use the app.


## 🤝 Contribute

We welcome contributions to JetSet. Follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b my-branch`) or any branch name 
3. Do modifications
4. Commit your changes (`git commit -am 'Add some feature'`) or any other name
5. Push to the branch (`git push origin my-branch`)
6. Create a new Pull Request

## 🏆 Credits

### Documents
[useState vs useEffect](https://codedamn.com/news/reactjs/usestate-and-useeffect-hooks)

### YouTube Videos

- [NodeJs](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY)
- [Express](https://www.youtube.com/watch?v=fgTGADljAeg)
- [ReactJs Hook](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH8EtggFGERCwMY5u5hOjf-h)
- [React](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK)
- [Introduction](https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA)


## 📜 License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT),to allow anyone to do modifications.
It also uses [Apache-2.0 License](https://opensource.org/licenses/Apache-2.0), for protection.
Another license is [ISC License](https://opensource.org/licenses/ISC), similar to MIT but it is used to protect Node.js.
Licence [BSD 2-Clause License](https://opensource.org/licenses/BSD-2-Clause) is found, for freely usage and modification.
Finally the licence [CC0-1.0 License](https://creativecommons.org/publicdomain/zero/1.0/) is found for no restriction on modification.



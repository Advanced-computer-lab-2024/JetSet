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

const getAdminbyid = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "admin not found." });
    }
    await admin.save();
    res.status(200).json({ username: admin.username });
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
  const { username, password } = req.body;

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
  const { name, desciption, price, quantity, seller_id } = req.body;
  try {
    await Product.create({
      name: name,
      price: price,
      description: desciption,
      quantity: quantity,
      seller_id: seller_id,
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
    const { flag } = req.body; // Expecting true for archive, false for unarchive

    // Find product by ID and update the archive status
    const updated = await itineraryModel.findByIdAndUpdate(
      id,
      { flag: flag }, // Set archive field based on the passed status
      { new: true } // Return the updated document
    );

    if (!updated) {
      return res.status(404).json({ message: "itinerary not found" });
    }

    const tourGuide = await TourGuide.findById(updated.created_by);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    const mailOptions = {
      from: {
        name: "Admin",
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
        name: "Admin",
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
};

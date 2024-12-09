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

//added
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
  const { username, password } = req.body;

  try {
    await Admin.create({
      username,
      password,
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

    const statusMessage = flag ? "Itinerary flagged" : "Itinerary unflagged";
    res.status(200).json({ message: statusMessage, itinerary: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating archive status", error });
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

    const statusMessage = flag ? "Activity flagged" : "Activity unflagged";
    res.status(200).json({ message: statusMessage, Activity: updated });
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

//VIew admin sales report 
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

    // Calculate revenues
    const activityRevenue = uniqueBookedActivities.reduce(
      (total, activity) => total + (activity.budget || 0) * 0.1,
      0
    );

    const itineraryRevenue = uniqueBookedItineraries.reduce(
      (total, itinerary) => total + (itinerary.budget || 0) * 0.1,
      0
    );

    const productRevenue = products.reduce(
      (total, product) => total + (product.sales || 0) * (product.price || 0),
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
          revenue: (product.sales || 0) * (product.price || 0),
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

//filter admin sales
const getFilteredSalesReport = async (req, res) => {
  const { id: adminId, product, startDate, endDate, month } = req.query;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({
      message: "Invalid admin ID format",
    });
  }

  try {
    let dateFilter = {};

    // Apply date or month filters
    if (startDate && endDate) {
      dateFilter = {
        purchaseDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else if (month) {
      const [year, monthIndex] = month.split("-"); // Format: YYYY-MM
      const start = new Date(year, monthIndex - 1, 1);
      const end = new Date(year, monthIndex, 0);
      dateFilter = {
        purchaseDate: {
          $gte: start,
          $lte: end,
        },
      };
    }

    // Fetch products with optional product name filter
    const productFilter = product ? { name: new RegExp(product, "i") } : {};
    const products = await Product.find({
      seller_id: new mongoose.Types.ObjectId(adminId),
      ...productFilter,
    })
      .populate({
        path: "purchaseRecords",
        match: dateFilter, // Apply date filter to purchase records
      });

    const filteredProducts = products.map((prod) => ({
      id: prod._id,
      name: prod.name,
      price: prod.price,
      sales: prod.sales,
      revenue: prod.purchaseRecords.reduce(
        (total, record) => total + record.quantity * prod.price,
        0
      ),
      purchaseRecords: prod.purchaseRecords.map((record) => ({
        touristUsername: record.touristUsername,
        touristEmail: record.touristEmail,
        quantity: record.quantity,
        purchaseDate: record.purchaseDate,
      })),
    }));

    const totalRevenue = filteredProducts.reduce(
      (total, prod) => total + prod.revenue,
      0
    );

    res.status(200).json({
      message: "Filtered Sales Report",
      totalRevenue,
      filteredProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating filtered sales report",
      error: error.message || error,
    });
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
  getSalesReport,
  getFilteredSalesReport,
};

const Seller = require("../Models/Seller.js");
const Product = require("../Models/Product");
const { default: mongoose } = require("mongoose");

//added
//Create/ Read/ Update my profile with my information as a Seller including name and description.  if accepted as a seller on the system
const createSeller = async (req, res) => {
  const { username, name, password, email, desciption } = req.body;
  try {
    const user = await Seller.create({
      email: email,
      username: username,
      password: password,
      seller_name: name,
      seller_description: desciption,
    });
    await user.save();
    res.status(200).json({ msg: "Seller created" });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

const getSeller = async (req, res) => {
  try {
    const users = await Seller.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

const getSellerById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Seller ID is required." });
  }

  console.log("Fetching seller for ID:", id); // Debug log
  const sanitizedId = id.replace(/:/g, "");
  try {
    const seller = await Seller.findById(sanitizedId); // Use findById to find by MongoDB ID
    //console.log("Fetched seller:", seller); // Debug log

    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }
    await seller.save();
    res.status(200).json({ seller });
  } catch (error) {
    console.error("Error retrieving seller profile:", error); // Debug log
    res
      .status(400)
      .json({ message: "Error retrieving seller profile.", error });
  }
};

const updateSeller = async (req, res) => {
  const { id } = req.params; // Extract ID from the URL
  const { seller_name, seller_description } = req.body; // Extract name and description from the body

  console.log(`Received ID: ${id}`); // Log the received ID

  // Sanitize ID if necessary (remove any unexpected characters)
  const sanitizedId = id.replace(/:/g, "");

  try {
    const profile = await Seller.findByIdAndUpdate(
      sanitizedId, // Use the sanitized ID
      { seller_name, seller_description },
      { new: true } // Return the updated profile
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile); // Respond with the updated profile
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(400).json({ error: err.message });
  }
};

//View a list of all available products(including picture of product, price, description, seller, ratings and reviews)
const getProducts = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .populate("reviews.userId", "name");
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Search for a product based on product name
const searchProductSeller = async (req, res) => {
  const { name } = req.query;
  try {
    const product = await Product.find({ name });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

//Filter product based on price
const filterProductSeller = async (req, res) => {
  const { limit } = req.query; // Use req.query for GET requests
  try {
    const products = await Product.find({ price: { $lte: limit } }).populate(
      "reviews.userId",
      "name"
    );
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Sort products by ratings
const sortProductsSeller = async (req, res) => {
  const { sortBy = "ratings", sortOrder } = req.query;
  // Default to sort by ratings in descending order
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

// Add a product with its details, price, and available quantity
const createProductSeller = async (req, res) => {
  const {
    name,
    description,
    price,
    quantity,
    seller_username,
    images,
    rating,
    reviews,
  } = req.body;
  try {
    // Create a new product
    const newProduct = await Product.create({
      name: name,
      price: price,
      description: description || "", // Default empty string if description is not provided
      quantity: quantity || 0, // Default 0 if quantity is not provided
      seller_username: seller_username,
      images: images || [], // Default to an empty array if no images are provided
      ratings: rating || 0, // Default rating to 0
      reviews: reviews || [], // Default to an empty array if no reviews are provided
    });

    // Return the newly created product along with a success message
    res
      .status(201)
      .json({ msg: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(400).json({
      message: "Error creating product",
      error: error.message || error,
    });
  }
};

//Edit product details and price
const updateProductSeller = async (req, res) => {
  let { id } = req.params;
  const { price, description, ratings, reviews, quantity } = req.body;

  // Strip any unwanted characters (like a leading colon)
  id = id.replace(/^:/, "");

  // Check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    // Prepare the fields to update only if they are provided in the request
    const updateFields = {};

    if (price !== undefined) updateFields.price = price;
    if (description !== undefined) updateFields.description = description;
    if (ratings !== undefined) updateFields.ratings = ratings;
    if (reviews !== undefined) updateFields.reviews = reviews;
    if (quantity !== undefined) updateFields.quantity = quantity;

    // Update the product by ID
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateFields,
      { new: true } // This option returns the updated document
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

const changePasswordSeller = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const sellerId = req.params.id;

  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Skip password hashing, compare directly
    if (seller.password !== oldPassword) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Directly assign the new password (plain-text)
    seller.password = newPassword;
    await seller.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
};

const deleteSellerAccount = async (req, res) => {
  try {
    const { id } = req.params; // Get seller ID from the URL
    console.log(`Request to delete seller account with ID: ${id}`);

    // Find the seller by ID
    const seller = await Seller.findById(id);
    if (!seller) {
      console.log(`Seller account not found for ID: ${id}`);
      return res.status(404).json({ success: false, message: "Seller account not found" });
    }
    console.log(`Found seller: ${seller.username}`);

    // Find products created by the seller
    const products = await Product.find({ seller_id: seller._id });
    console.log(`Found products created by seller: ${products.length}`);

    // If products exist, delete them
    if (products.length > 0) {
      await Product.deleteMany({ seller_id: seller._id }); // Delete all products associated with the seller
      console.log(`Deleted products created by seller: ${seller.username}`);
    }

    // Delete the seller account
    await Seller.findByIdAndDelete(id);
    console.log(`Deleted seller account: ${seller.username}`);

    return res.status(200).json({ success: true, message: "Seller account deleted successfully" });
  } catch (error) {
    console.error("Error occurred while deleting seller account:", error);
    return res.status(500).json({ success: false, message: "An error occurred while trying to delete the account" });
  }
};

module.exports = {
  createSeller,
  getSeller,
  updateSeller,
  createProductSeller,
  getProducts,
  searchProductSeller,
  sortProductsSeller,
  filterProductSeller,
  updateProductSeller,
  getSellerById,
  changePasswordSeller,
  deleteSellerAccount,
};

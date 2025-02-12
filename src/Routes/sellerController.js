const Seller = require("../Models/Seller.js");
const Product = require("../Models/Product");
const { default: mongoose } = require("mongoose");

const path = require("path");

//added
//Create/ Read/ Update my profile with my information as a Seller including name and description.  if accepted as a seller on the system
const createSeller = async (req, res) => {
  const { username, name, password, email, description } = req.body;

  try {
    const imageFilename = req.file ? path.basename(req.file.path) : "";

    const user = await Seller.create({
      email: email,
      username: username,
      password: password,
      seller_name: name,
      seller_description: description,
      images: imageFilename,
    });
    await user.save();
    res.status(200).json({ msg: "Seller created", user });
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

  const sanitizedId = id.replace(/:/g, "");
  try {
    const seller = await Seller.findById(sanitizedId); // Use findById to find by MongoDB ID
    //console.log("Fetched seller:", seller); // Debug log

    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }
    await seller.save();
    res.status(200).json({ seller, username: seller.username });
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

  // Use req.file since we're uploading a single file
  const image = req.file ? path.basename(req.file.path) : null; // Get the filename if an image was uploaded

  // Sanitize ID if necessary (remove any unexpected characters)
  const sanitizedId = id.replace(/:/g, "");

  try {
    // Create an object to hold the updates
    const updateData = {};

    // Only include the fields that are provided
    if (seller_name) {
      updateData.seller_name = seller_name;
    }
    if (seller_description) {
      updateData.seller_description = seller_description;
    }
    if (image) {
      updateData.images = image; // Update images only if there are any new uploads
    }

    const profile = await Seller.findByIdAndUpdate(
      sanitizedId, // Use the sanitized ID
      updateData, // Only update provided fields
      { new: true } // Return the updated profile
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile); // Respond with the updated profile
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginSeller = async (req, res) => {
  const { user, password } = req.body;

  try {
    // Find the guest by username, password, and role
    const seller = await Seller.findOne({ username: user, password });

    // If guest not found or password does not match, return error
    if (!seller) {
      return res.status(404).json({ message: "Regiesterd First" });
    }

    res.status(200).json({
      message: `Welcome ${user}`,
      seller,
    });
  } catch (error) {
    res.status(500).json({ message: "Error during authentication.", error });
  }
};

//View a list of all available products(including picture of product, price, description, seller, ratings and reviews)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("reviews.userId", "name");
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
      "reviews.touristId",
      "username"
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
  const { name, description, price, quantity, seller_id, admin_id } = req.body;

  try {
    // Get the image filename from the uploaded file
    const imageFilename = req.file ? path.basename(req.file.path) : ""; // Ensure we use imageFilename

    // Create a new product with the image filename
    const newProduct = await Product.create({
      name,
      price,
      description: description || "",
      quantity: quantity || 0,
      seller_id: seller_id,
      images: [imageFilename], // Store the filename in an array
      admin_id: admin_id,
    });

    // Return the newly created product along with a success message
    res
      .status(201)
      .json({ msg: "Product created successfully", product: newProduct });
  } catch (error) {
    // Capture and return error details
    res.status(400).json({
      message: "Error creating product",
      error: error.message || error,
    });
  }
};

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
    // Fetch the current product to get existing values
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prepare the fields to update, only updating the fields that are provided
    const updateFields = {
      price: price !== undefined ? price : existingProduct.price,
      description:
        description !== undefined ? description : existingProduct.description,
      ratings: ratings !== undefined ? ratings : existingProduct.ratings,
      reviews: reviews !== undefined ? reviews : existingProduct.reviews,
      quantity: quantity !== undefined ? quantity : existingProduct.quantity,
    };

    // If an image is uploaded, add the image path to updateFields
    if (req.file) {
      updateFields.images = [path.basename(req.file.path)]; // Replaces the current image with the new one
    }

    // Update the product by ID
    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true, // This option returns the updated document
      runValidators: true, // Optional: Ensures that any validation rules are applied
    });

    res.status(200).json({ msg: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(400).json({
      message: "Error updating product",
      error: error.message || error,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

const archiveProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { archiveStatus } = req.body; // Expecting true for archive, false for unarchive

    // Find product by ID and update the archive status
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { archive: archiveStatus }, // Set archive field based on the passed status
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const statusMessage = archiveStatus
      ? "Product archived"
      : "Product unarchived";
    res.status(200).json({ message: statusMessage, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error updating archive status", error });
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
      return res
        .status(404)
        .json({ success: false, message: "Seller account not found" });
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

    return res
      .status(200)
      .json({ success: true, message: "Seller account deleted successfully" });
  } catch (error) {
    console.error("Error occurred while deleting seller account:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while trying to delete the account",
    });
  }
};
const getSellerSalesReport = async (req, res) => {
  const { id } = req.query; // Accessing id directly from the query parameter

  // Validate id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }

  try {
    // Fetch the seller by ID
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    // Fetch all products associated with the seller
    const products = await Product.find({ seller_id: id })
      .populate({
        path: 'purchaseRecords.tourist',  // Ensure we populate the tourist within purchaseRecords
        select: 'username email',
      })
      .exec();  // Make sure the query executes properly

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "No products found for this seller",
      });
    }

    // Initialize total revenue and product details
    let totalRevenue = 0;
    const productDetails = products.map((product) => {
      // Calculate revenue based on purchaseRecords quantity
      const productRevenue = product.purchaseRecords.reduce((total, record) => {
        return total + (record.quantity * product.price);  // Multiply quantity by price
      }, 0);

      totalRevenue += productRevenue;

      return {
        productId: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity, // Remaining stock
        ratings: product.ratings,
        reviews: product.reviews.map((review) => ({
          touristId: review.touristId,
          reviewText: review.reviewText,
          createdAt: review.createdAt,
        })),
        sales: product.sales || 0,
        revenue: productRevenue,
        images: product.images,
        purchaseRecords: product.purchaseRecords.map((record) => ({
          touristId: record.tourist?._id,
          touristUsername: record.tourist?.username,
          touristEmail: record.tourist?.email,
          purchaseDate: record.purchaseDate,
          quantity: record.quantity,
        })),
      };
    });

    // Send the response
    res.status(200).json({
      message: `Sales report for seller: ${seller.seller_name}`,
      sellerDetails: {
        id: seller._id,
        name: seller.seller_name,
        description: seller.seller_description,
        email: seller.email,
        username: seller.username,
        images: seller.images,
      },
      totalRevenue,
      products: productDetails,
    });
  } catch (error) {
    console.error("Error generating seller sales report:", error);
    res.status(500).json({
      message: "Error generating sales report",
      error: error.message || error,
    });
  }
};
const filterSellerSalesReport = async (req, res) => {
  const { id, product, date, month } = req.query; // Extract filters from query

  // Validate seller ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }

  try {
    // Fetch seller by ID
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    // Build the product filter based on product name
    const productFilter = { seller_id: id };
    if (product) {
      productFilter.name = { $regex: new RegExp(product, 'i') }; // Filter by product name using regex (case-insensitive)
    }

    // Fetch products based on filters
    const products = await Product.find(productFilter)
      .populate({
        path: 'purchaseRecords.tourist',
        select: 'username email',
      })
      .exec();

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "No products found for the specified criteria",
      });
    }

    // Initialize total revenue and filtered product details
    let totalRevenue = 0;
    const filteredProductDetails = products
      .map((product) => {
        // Filter purchase records only if date or month filters are provided
        const filteredPurchaseRecords = product.purchaseRecords.filter((record) => {
          const purchaseDate = new Date(record.purchaseDate);

          // Apply date and month filters
          const isDateMatch = date ? purchaseDate.toISOString().split('T')[0] === date : true;
          const isMonthMatch = month
            ? purchaseDate.getMonth() + 1 === parseInt(month) // Months are 0-indexed
            : true;

          // Include records matching both filters or all records if no filters
          return isDateMatch && isMonthMatch;
        });

        // Calculate revenue for filtered purchase records
        const productRevenue = filteredPurchaseRecords.reduce((total, record) => {
          return total + record.quantity * product.price;
        }, 0);

        totalRevenue += productRevenue;

        return {
          productId: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity, // Remaining stock
          ratings: product.ratings,
          reviews: product.reviews.map((review) => ({
            touristId: review.touristId,
            reviewText: review.reviewText,
            createdAt: review.createdAt,
          })),
          sales: product.sales || 0,
          revenue: productRevenue,
          images: product.images,
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

    // Send response with filtered details
    res.status(200).json({
      message: `Filtered sales report for seller: ${seller.seller_name}`,
      sellerDetails: {
        id: seller._id,
        name: seller.seller_name,
        description: seller.seller_description,
        email: seller.email,
        username: seller.username,
        images: seller.images,
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
  deleteProduct,
  archiveProduct,
  changePasswordSeller,
  deleteSellerAccount,
  loginSeller,
  getSellerSalesReport,
  filterSellerSalesReport
};

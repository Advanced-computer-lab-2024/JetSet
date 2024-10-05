const Seller = require("../Models/Seller.js");
const Product = require("../Models/Product");
const { default: mongoose } = require("mongoose");
let user;
const createSeller = async (req, res) => {
  const { username, name, password, email, desciption } = req.body;
  try {
    user = username;
    await Seller.create({
      username: username,
      password: password,
      email: email,
      name: name,
      desciption: desciption,
    });
    res.status(200).json({ msg: "Seller created" });
  } catch {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

const getSeller = async (req, res) => {
  try {
    const users = await Seller.findOne({ user });
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

const updateSeller = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const profile = await Seller.findByIdAndUpdate(
      id,
      { name, description },
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

const searchProductSeller = async (req, res) => {
  const { name } = req.body;
  try {
    const product = await Product.find({ name });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

module.exports = {
  createSeller,
  getSeller,
  updateSeller,
  createProduct,
  getProducts,
  searchProductSeller,
  sortProducts,
};

const TourismGoverner = require("../Models/TourismGoverner");
const Admin = require("../Models/Admin");
const Product = require("../Models/Product");

//Tourism Governer
const createTourismGoverner = async (req, res) => {
  const { username, password } = req.body;

  try {
    await TourismGoverner.create({
      username,
      password,
    });
    res.status(200).json({ msg: "Tourism Governer created" });
  } catch (error) {
    res.status(400).json({
      message: "Error creating Tourism Governer",
      error: error.message || error,
    });
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

module.exports = { createTourismGoverner, createAdmin, createProduct };

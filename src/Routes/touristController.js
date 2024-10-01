const Product = require("../Models/Product");

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

module.exports = {
  getProducts,
};

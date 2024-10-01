const Product = require("../Models/Product");

const searchProductSeller = async (req, res) => {
 
    const { name } = req.body;
    try {
       const product = await Product.find({name});
       res.status(200).json(product);
     } catch (error) {
      
       res.status(500).json({ message: 'Error retrieving product', error });
     }
   }


module.exports = { searchProductSeller };
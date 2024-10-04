const TourismGoverner = require("../Models/TourismGoverner");
const Tourist = require("../Models/Tourist");
const TourGuide = require("../Models/TourGuide");
const Seller = require("../Models/Seller");
const Advertiser = require("../Models/Advertiser");
const Admin = require("../Models/Admin");
const Product = require("../Models/Product");
const Category = require("../Models/Category");
const tagModel = require('../Models/Tag');



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

const getProductsAdmin = async (req, res) => {
    
  try {
      const products = await Product.find().populate('reviews.userId', 'name'); 
      res.status(200).json(products);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
};

const createCategory = async(req,res) => {

  const {name} = req.body;

  try{
    const category = await Category.create({name});
    res.status(200).json(category)
    }catch(error){
    res.status(400).json({error:error.message})
  }

}

const getCategory = async (req, res) => {
 
 try {
    const category = await Category.find({});
    res.status(200).json(category);
  } catch (error) {
   
    res.status(500).json({ message: 'Error retrieving categories', error });
  }
}

const updateCategory = async (req, res) => {

  try { 
     const { categoryId } = req.params;
     const { name } = req.body;
     
     const updatedCategory = await Category.findByIdAndUpdate(categoryId, {name}, { new: true });
 
     if (!updatedCategory) {
       return res.status(404).json({ message: 'Category not found' });
     }
 
     res.status(200).json(updatedCategory);
   } catch (error) {
     res.status(500).json({ message: 'Error updating category', error });
   }
 }
 
 const deleteCategory = async (req, res) => {
  try {
     
    const { categoryId } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
 
    res.status(200).json(deletedCategory);
  } catch (error) {
    
    res.status(500).json({ message: 'Error deleting category', error });
  }
 }

 const searchProductAdmin = async (req, res) => {
 
  const { name } = req.body;
  try {
     const product = await Product.find({name});
     res.status(200).json(product);
   } catch (error) {
    
     res.status(500).json({ message: 'Error retrieving product', error });
   }
 }

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
    default:
      return res.status(400).json({ message: "Invalid account type" });
  }

  const deletedAccount = await model.findOneAndDelete({ username:accountUsername });
  if (!deletedAccount) {
    return res.status(404).json({ message: "Account not found" });
  }

  res.status(200).json({
    message: `${accountType} deleted successfully`,
    deletedAccount: deletedAccount,
  });
  
};
const createPrefTag = async (req, res) => {
  const { name,type,period} = req.body;

  try {
      const newTag = new tagModel({ name , type , period });
      await newTag.save();
      res.status(201).json(newTag);
  } catch (error) {
      res.status(500).json({ error: 'Failed to create tag' });
  }
};
// Get all tags
const getPrefTag = async (req, res) => {
  try {
      const tags = await tagModel.find();
      res.status(200).json(tags);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

// Update a tag
const updatePrefTag = async (req, res) => {
  const { id } = req.query;
  const { name ,type,period} = req.body;
 

  try {
      const updatedTag = await tagModel.findByIdAndUpdate(id, { name, type,period} ,{ new: true });
      if (!updatedTag) {
          return res.status(404).json({ error: 'Tag not found' });
      }
      res.status(200).json(updatedTag);
  } catch (error) {
      res.status(500).json({ error: 'Failed to update tag' });
  }
};

// Delete a tag
const deletePrefTag = async (req, res) => {
  const { id } = req.query;

  try {
      const deletedTag = await tagModel.findByIdAndDelete(id);
      if (!deletedTag) {
          return res.status(404).json({ error: 'Tag not found' });
      }
      res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to delete tag' });
  }
};




module.exports = { createTourismGoverner,
                   createAdmin, 
                   createProduct,
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
                  };

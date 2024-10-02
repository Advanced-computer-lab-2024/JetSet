const TourismGoverner = require("../Models/TourismGoverner");
const Admin = require("../Models/Admin");
const Product = require("../Models/Product");
const Category = require("../Models/Category");


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


module.exports = { createTourismGoverner,
                   createAdmin, 
                   createProduct,
                   createCategory, 
                   getCategory, 
                   updateCategory, 
                   deleteCategory, 
                   searchProductAdmin,
                   };

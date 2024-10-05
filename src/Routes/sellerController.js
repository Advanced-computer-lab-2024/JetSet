const sellerModel = require('../Models/Seller');
const productModel = require('../Models/Product');
const { default: mongoose } = require('mongoose');

const createSeller = async(req,res) => {
    const{email,username,password,seller_name,seller_description} = req.body;
    try{
        const seller = await sellerModel.create({email,username,password,seller_name,seller_description});
        res.status(200).json(seller)
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const createProduct = async(req,res) => {
 
   const{name,price,description,seller_id,ratings,reviews} = req.body;
   try {
    const product = await productModel.create({name,price,description,seller_id,ratings,reviews});
    res.status(200).json(product);
   }
   catch(error){
    res.status(400).json({error:error.message})
   }




}
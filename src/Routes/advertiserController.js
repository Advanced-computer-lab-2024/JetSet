const advertiserModel = require('../Models/Advertiser');

const { default: mongoose } = require('mongoose');

const createAdvertiser = async(req,res) => {
    const{email,username,password,company_name,website,hotline} = req.body;
    try{
        const advertiser = await advertiserModel.create({email,username,password,company_name,website,hotline});
        res.status(200).json(tourGuide)
    }catch(error){
        res.status(400).json({error:error.message})
    }
}
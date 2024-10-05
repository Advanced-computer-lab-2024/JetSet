const tourGuideModel = require('../Models/TourGuide');

const { default: mongoose } = require('mongoose');

const createTourGuide = async(req,res) => {
    const{email,username,password,years_of_experience,previous_work} = req.body;
    try{
        const tourGuide = await tourGuideModel.create({email,username,password,years_of_experience,previous_work});
        res.status(200).json(tourGuide)
    }catch(error){
        res.status(400).json({error:error.message})
    }
}
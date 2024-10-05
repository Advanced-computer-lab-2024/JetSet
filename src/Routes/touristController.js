const touristModel = require('../Models/Seller');

const { default: mongoose } = require('mongoose');

const createTourist = async(req,res) => {
    const{email,username,password,mobile_number,nationality,DOB,job,wallet} = req.body;
    try{
        const ct = new Date();
        let yearc = date.getFullYear();
        let yearb = DOB.getFullYear();
        if (yearc - yearb >= 18){
            const tourist = await touristModel.create({email,username,password,mobile_number,nationality,DOB,job,wallet});
            res.status(200).json(tourist)
        }
        else {
            console.log("You must be over 18 to register as tourist");
        }


       
        
    }catch(error){
        res.status(400).json({error:error.message})
    }
}
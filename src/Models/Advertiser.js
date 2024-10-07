 const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const {ObjectId} = mongoose.Schema;

  const advertiserSchema = new Schema({
      email: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      company_name: {
        type : String, 
        required: true
      },
      website: {
        type:String, 
        required:true
      },
      hotline: {
        type:String,
        required:true
      },
      companyDescription:{
        type:String,
        required:true
  
      }
    },
     { timestamps: true });
    
    const Advertiser = mongoose.model('Advertiser', advertiserSchema);
    module.exports = Advertiser;
const TourGuide = require("../Models/TourGuide.js");

const createTourGuideProfile = async (req, res) => {
    const { mobile_number, years_of_experience , previous_work } = req.body;
    const tourGuideID = req.params.tourGuideID;
    try {
      await TourGuide.findByIdAndUpdate(tourGuideID,{
        mobile_number: mobile_number,
        years_of_experience: years_of_experience,
        previous_work: previous_work
      });
      res.status(200).json({ msg: "profile is created" });
    } catch (error) {
      res.status(400).json({
        message: "Error creating Tour Guide profile",
        error: error.message || error,
      });
    }
  };

  const readTourGuideProfile = async (req, res) => {
    const { mobile_number, years_of_experience , previous_work } = req.body;
    const tourGuideID = req.params.tourGuideID;
    try {
        const myProfile = await TourGuide.findById(tourGuideID);
        res.status(200).json({
            mobile_number: myProfile.mobile_number,
            years_of_experience: myProfile.years_of_experience,
            previous_work:myProfile.previous_work
        });
    } catch (error) {
        res.status(400).json({
        message: "Error creating Tour Guide profile",
        error: error.message || error,
      });
    }
  };

  const getTourGuides = async (req, res) => {
    const { mobile_number, years_of_experience , previous_work } = req.body;
    const tourGuideID = req.params.tourGuideID;
    try {
        const result= await TourGuide.find({ });
        res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        message: "Error getting Tour Guides",
        error: error.message || error,
      });
    }
  };

module.exports = { createTourGuideProfile , getTourGuides , readTourGuideProfile};
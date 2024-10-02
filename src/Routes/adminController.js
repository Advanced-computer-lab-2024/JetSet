const TourismGoverner = require("../Models/TourismGoverner");
const Admin = require("../Models/Admin");

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
    res
      .status(400)
      .json({
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

module.exports = { createTourismGoverner, createAdmin };

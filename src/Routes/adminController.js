//Tourism Governer
const createTourismGoverner = async (req, res) => {
  const { username, password } = req.body;
  username = req.body.username;
  try {
    const user = await userModel.create({
      username,
      password,
    });
    res.status(200).json({ msg: "Tourism Governer created" });
  } catch {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

//Admin
const createAdmin = async (req, res) => {
  const { username, password } = req.body;
  username = req.body.username;
  try {
    const user = await userModel.create({
      username,
      password,
    });
    res.status(200).json({ msg: "Admin created" });
  } catch {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

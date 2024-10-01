// External variables
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
//Make sure to add your MongoDB URI in the .env file as MONGO_URI="your mongodb uri"
//Check db connection links in README file
const MongoURI = process.env.MONGO_URI;
//const {createUser, getUsers, createBlog, filterBlog, editBlog}= require('./Routes/userController')
const {
  createTourismGoverner,
  createAdmin,
  createProduct,
} = require("./Routes/adminController");

//App variables
const app = express();
const port = process.env.PORT || "8000";
//const user = require('./Models/User');
// #Importing the userController

// configurations
// Mongo DB
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));
app.get("/home", (req, res) => {
  res.status(200).send("You have everything installed!");
});

app.use(express.json());

app.post("/tourism-governor", createTourismGoverner);
app.post("/admin", createAdmin);
app.post("/product", createProduct);

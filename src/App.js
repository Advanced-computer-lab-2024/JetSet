/*
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

app.use(express.json())
*/
// app.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const advertiserRoutes = require("./Routes/advertiserController"); // Adjust path as necessary

// Load environment variables from .env file
dotenv.config();

// App variables
const app = express();
const port = process.env.PORT || 3000;
const MongoURI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use('/api', advertiserRoutes); // Use advertiser routes under '/api'

// MongoDB Connection
mongoose.connect(MongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected!");
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})
.catch(err => console.error(err));

// Basic route for testing
app.get("/home", (req, res) => {
  res.status(200).send("You have everything installed!");
});

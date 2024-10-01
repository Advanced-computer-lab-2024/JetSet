// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const {createItinerary, getItineraries, updateItinerary,  deleteItinerary} = require("./Routes/tourguideController");


// Make sure this route matches your request

//Make sure to add your MongoDB URI in the .env file as MONGO_URI="your mongodb uri"
//Check db connection links in README file
const MongoURI = process.env.MONGO_URI;
//const {createUser, getUsers, createBlog, filterBlog, editBlog}= require('./Routes/userController')


//App variables
const app = express();
const port = process.env.PORT || "8000";
const itinerary = require('./Models/Itinerary');

// #Importing the userController


// configurations
// Mongo DB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));
app.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
  });

app.use(express.json())
app.post("/addItinerary",createItinerary);
app.get("/Itinerary",getItineraries );
app.put("/updateItinerary/:id",updateItinerary );
app.delete("/deleteItinerary/:id", deleteItinerary );


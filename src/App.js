// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

require("dotenv").config();
//Make sure to add your MongoDB URI in the .env file as MONGO_URI="your mongodb uri"
//Check db connection links in README file
const {viewAllPlaces,createPlaces,getPlaces, updatePlace, deletePlace} = require("./Routes/placesController");
const {createTourismGoverner,createTag} = require("./Routes/tourismgovernerController");
// const MongoURI ="mongodb+srv://mmjy2003:ACLProject@acl-project.cmpuq.mongodb.net/?retryWrites=true&w=majority&appName=ACL-Project";
//const {createUser, getUsers, createBlog, filterBlog, editBlog}= require('./Routes/userController')
const MongoURI="";



//App variables
const app = express();
const port = process.env.PORT || "3000";
const TourismGoverner = require('./Models/TourismGoverner');
const place = require('./Models/Historical');

//const user = require('./Models/User');
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

app.use(express.json());
app.get("/viewAllPlaces",viewAllPlaces);
app.post("/addPlace",createPlaces);
app.get("/Places",getPlaces);
app.put("/updatePlace/:id",updatePlace);
app.delete("/deletePlace",deletePlace);
app.post("/addTourismGoverner",createTourismGoverner);
app.post("/addTag",createTag);



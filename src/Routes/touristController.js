const Product = require("../Models/Product");
const Activity = require("../Models/Activity");
const Itinerary = require("../Models/Itinerary");
const Historical = require("../Models/Historical");
const Tourist = require("../Models/Tourist.js");
const TourGuide = require("../Models/TourGuide.js");
const Complaint = require("../Models/Complaint.js");
const Category = require("../Models/Category.js"); // Import the Category model
const Transportation = require("../Models/Transportation");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const path = require("path");
const crypto = require("crypto");
const Notification = require("../Models/Notification.js");
const PromoCode = require("../Models/PromoCode.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { default: mongoose } = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

//const { default: mongoose } = require("mongoose");
const FlightBooking = require("../Models/flightBookingSchema.js");
const HotelBooking = require("../Models/hotelBookingSchema.js");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

cron.schedule("41 15 * * *", async () => {
  try {
    const now = new Date();

    // Fetch tourists with any kind of bookings
    const tourists = await Tourist.find({
      $or: [
        { bookedActivities: { $exists: true, $not: { $size: 0 } } },
        { bookedItineraries: { $exists: true, $not: { $size: 0 } } },
        { bookedTransportations: { $exists: true, $not: { $size: 0 } } },
      ],
    }).populate([
      {
        path: "bookedActivities",
        match: { date: { $gte: now } },
      },
      {
        path: "bookedItineraries",
        match: { availability_dates: { $gte: now } },
      },
      {
        path: "bookedTransportations",
        match: { availability: { $gte: now } },
      },
    ]);

    // Loop through each tourist
    for (const tourist of tourists) {
      const reminders = [];

      // Add activities
      tourist.bookedActivities?.forEach((activity) =>
        reminders.push(
          `<li><strong>Activity:</strong> ${
            activity.title
          } on ${activity.date.toDateString()}</li>`
        )
      );

      // Add itineraries
      tourist.bookedItineraries?.forEach((itinerary) => {
        const availabilityStrings = itinerary.availability_dates.map((date) => {
          if (date instanceof Date) {
            return date.toDateString();
          }
          return date;
        });

        reminders.push(
          `<li><strong>Itinerary:</strong> ${
            itinerary.name
          } on ${availabilityStrings.join(", ")}</li>`
        );
      });

      // Add transportations
      tourist.bookedTransportations?.forEach((transport) =>
        reminders.push(
          `<li><strong>Transportation:</strong> From ${
            transport.pickup_location
          } to ${
            transport.dropoff_location
          } on ${transport.availability.toDateString()}</li>`
        )
      );

      // Fetch Hotel Bookings
      const hotelBookings = await HotelBooking.find({
        booked_by: tourist._id,
        checkIn: { $gte: now },
      });
      hotelBookings.forEach((hotel) =>
        reminders.push(
          `<li><strong>Hotel:</strong> ${
            hotel.destinationCode
          } from ${hotel.checkIn.toDateString()} to ${hotel.checkOut.toDateString()}</li>`
        )
      );

      // Fetch Flight Bookings
      const flightBookings = await FlightBooking.find({
        booked_by: tourist._id,
        departureDate: { $gte: now },
      });
      flightBookings.forEach((flight) =>
        reminders.push(
          `<li><strong>Flight:</strong> From ${flight.origin} to ${
            flight.destination
          } on ${flight.departureDate.toDateString()}</li>`
        )
      );

      // Send Email if reminders exist
      if (reminders.length > 0) {
        const emailBody = `
          <p>Hello ${tourist.username},</p>
          <p>You have the following upcoming events:</p>
          <ul>${reminders.join("\n")}</ul>
          <p>We wish you a wonderful experience!</p>
          <p>Best regards,</p>
          <p><strong>JetSet Team</strong></p>
        `;

        await transporter.sendMail({
          from: {
            name: "JetSet",
            address: process.env.EMAIL_USER,
          },
          to: tourist.email,
          subject: "Upcoming Events Reminder",
          html: emailBody,
        });

        console.log(`Reminder sent to ${tourist.email}`);

        const notification = new Notification({
          recipient: tourist.username,
          role: "Tourist",
          message: `<p>You have the following upcoming events:</p>
          <ul>${reminders.join("\n")}</ul>`,
        });

        // Save the notification
        await notification.save();
      }
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
});

const sendPromoCodeToTourist = async (touristId, promoCode) => {
  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return console.log("Tourist not found");
    }

    const imagePath = path.join(__dirname, "../uploads/birthday.jpg");

    // Send the promo code via email
    await transporter.sendMail({
      from: {
        name: "JetSet",
        address: process.env.EMAIL_USER,
      },
      to: tourist.email,
      subject: "Happy Birthday! Here's Your Promo Code",
      html: `
        <h1>Happy Birthday, ${tourist.username}!</h1>
        <p>Use the promo code <strong>${promoCode.code}</strong> to enjoy ${promoCode.discount}% off on any products on our website.</p>
        <img src="cid:promoImage" alt="Promo Image" />
        <p>Enjoy your special day!</p>
      `,
      attachments: [
        {
          filename: "birthday.jpg",
          path: imagePath,
          cid: "promoImage",
        },
      ],
    });

    console.log(`Promo code sent to ${tourist.email}`);
  } catch (error) {
    console.error("Error sending promo code:", error);
  }
};

const checkBirthdaysAndSendPromoCodes = async () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;

  try {
    // Find all tourists with today's birthday
    const tourists = await Tourist.aggregate([
      {
        $addFields: {
          day: { $dayOfMonth: "$DOB" },
          month: { $month: "$DOB" },
        },
      },
      {
        $match: {
          day: day,
          month: month,
        },
      },
    ]);

    if (tourists.length === 0) {
      console.log("No tourists have a birthday today");
      return;
    }

    // Find a valid promo code
    const promoCode = await PromoCode.findOne({
      isActive: true,
      expirationDate: { $gte: today },
    });

    if (!promoCode) {
      console.log("No active promo codes available");
      return;
    }

    // Send promo code and create notifications
    for (const tourist of tourists) {
      // Send promo code email
      await sendPromoCodeToTourist(tourist._id, promoCode);

      await Tourist.findByIdAndUpdate(tourist._id, {
        $push: { promoCodes: promoCode._id }, // Add the PromoCode ID
      });

      // Create a notification
      const notificationMessage = `Happy Birthday, ${tourist.username}! Use promo code ${promoCode.code} to enjoy ${promoCode.discount}% off on any products.`;
      const notification = new Notification({
        recipient: tourist.username,
        role: "Tourist",
        message: notificationMessage,
      });

      await notification.save();
      console.log(`Notification created for ${tourist.username}`);
    }

    console.log(
      `Promo codes and notifications sent to ${tourists.length} tourists today.`
    );
  } catch (error) {
    console.error("Error checking birthdays:", error);
  }
};

// Schedule the job to run daily at 9:15 AM
cron.schedule("41 15 * * *", () => {
  checkBirthdaysAndSendPromoCodes();
});
const createTourist = async (req, res) => {
  const { username, password, email, mobile, nationality, dob, job } = req.body;
  try {
    const user = await Tourist.create({
      username: username,
      password: password,
      email: email,
      mobile_number: mobile,
      nationality: nationality,
      DOB: dob,
      job: job,
    });
    res.status(200).json({ msg: "Tourist created", touristId: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getTourist = async (req, res) => {
  try {
    const users = await Tourist.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving users", error });
  }
};

const getTouristProfile = async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.status(200).json({ tourist, username: tourist.username });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error retrieving tourist profile", error });
  }
};

const updateTouristProfile = async (req, res) => {
  const { username, wallet, ...rest } = req.body;

  try {
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Update fields while keeping username and wallet unchanged
    const updatedTourist = await Tourist.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...rest,
          username: tourist.username, // Keep existing username
          wallet: wallet, // Keep existing wallet
        },
      },
      { new: true, runValidators: true } // Validate during update
    );

    tourist.level = determineLevel(tourist.loyaltyPoints);
    tourist.badge = calculateBadge(tourist.loyaltyPoints);

    res.status(200).json(updatedTourist);
  } catch (error) {
    res.status(400).json({ message: "Error updating tourist profile", error });
  }
};

const loginTourist = async (req, res) => {
  const { user, password } = req.body;

  try {
    // Find the guest by username, password, and role
    const tourist = await Tourist.findOne({ username: user, password });

    // If guest not found or password does not match, return error
    if (!tourist) {
      return res.status(404).json({ message: "Regiesterd First" });
    }

    res.status(200).json({
      message: `Welcome ${user}`,
      tourist,
    });
  } catch (error) {
    res.status(500).json({ message: "Error during authentication.", error });
  }
};

const getProducts = async (req, res) => {
  try {
    // Find products that are not archived
    const products = await Product.find({ archive: false })
      .populate({
        path: "reviews.touristId",
        select: "username", // Only get the username field
      })
      .populate({
        path: "seller_id",
        select: "username",
      });
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Sort products by ratings
const sortProductsTourist = async (req, res) => {
  const { sortBy, sortOrder } = req.query; // Use req.query for GET requests

  // Convert sortOrder to a number and validate it
  const validSortOrder = Number(sortOrder); // Convert to number
  const isSortOrderValid = validSortOrder === 1 || validSortOrder === -1;

  try {
    let sortOption = {};
    if (sortBy === "ratings" && isSortOrderValid) {
      // Ensure sortBy is valid
      sortOption[sortBy] = validSortOrder; // Set sorting option based on valid input
    }

    // Find and sort the products that are not archived
    const sortedProducts = await Product.find({ archive: false }).sort(
      sortOption
    );

    // Return the sorted products
    res.json(sortedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
const getlistActivities = async (req, res) => {
  try {
    const today = new Date(); // Get today's date
    const activities = await Activity.find({
      date: { $gt: today }, // Find activities with a date greater than today
    });

    res.status(200).json(activities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Methods for tourists and guests
const SortActivities = async (req, res) => {
  const { sortBy, sortOrder } = req.query;
  const validSortOrder = sortOrder == 1 ? 1 : -1;
  try {
    let sortOption = {};
    if (sortBy && (validSortOrder === 1 || validSortOrder === -1)) {
      sortOption[sortBy] = validSortOrder;
    }

    const upcomingActivities = await Activity.find().sort(sortOption);

    res.json(upcomingActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

//need to change it as the activity
const SortItineraries = async (req, res) => {
  const { sortBy = "budget", sortOrder = "asc" } = req.query;

  try {
    let sortOption = {};

    const validSortOrder = sortOrder == 1 ? 1 : -1;
    if (sortBy && (validSortOrder === 1 || validSortOrder === -1)) {
      sortOption[sortBy] = validSortOrder; // Assign the correct sorting value
    }
    const upcomingItineraries = await Itinerary.find({ flag: false }).sort(
      sortOption
    );

    res.status(200).json(upcomingItineraries);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getItineraryTourist = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ flag: false, status: "active" });
    res.status(200).json(itineraries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getActivityTourist = async (req, res) => {
  try {
    const activities = await Activity.find({ flag: false });
    res.status(200).json(activities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getItineraries = async (req, res) => {
  const {
    sortBy = "budget",
    sortOrder = "asc",
    budget,
    startDate,
    endDate,
    tag,
    language,
  } = req.query;

  try {
    let sortOption = {};
    sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;

    const currentDate = new Date();
    const query = {
      flag: false,
      startDate: { $gte: currentDate }, // Ensure upcoming itineraries only
    };

    // Apply filters if present
    if (budget) {
      query.budget = { $lte: Number(budget) }; // Filter by budget
    }
    if (startDate) {
      query.startDate = { $gte: new Date(startDate) }; // Filter by start date
    }
    if (endDate) {
      query.endDate = { $lte: new Date(endDate) }; // Filter by end date
    }
    if (tag && tag.length > 0) {
      query.tags = { $in: tag.split(",").map((t) => t.trim()) }; // Split tags by comma and trim whitespace
    }
    if (language) {
      query.language = language; // Filter by language
    }

    // Fetch and sort itineraries based on the query and sort options
    const itineraries = await Itinerary.find(query).sort(sortOption);

    // Format the output
    const formattedItineraries = Itinerary.map((itinerary) => ({
      title: itinerary.title,
      locations: itinerary.locations,
      timeline: itinerary.timeline,
      duration: itinerary.duration,
      language: itinerary.language,
      price: itinerary.price,
      availability_dates: itinerary.availability_dates,
      pickup_location: itinerary.pickup_location,
      dropoff_location: itinerary.dropoff_location,
      accessibility: itinerary.accessibility,
      budget: itinerary.budget,
      tags: itinerary.tags || [], // Ensure tags is an array
      created_by: itinerary.created_by,
      createdAt: itinerary.createdAt,
      updatedAt: itinerary.updatedAt,
    }));

    res.status(200).json(formattedItineraries);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const filterActivity = async (req, res) => {
  const { budget, date, category, rating } = req.query;

  // Initialize an empty query object
  let query = {
    flag: false,
  };

  // Add filters to the query object only if they are provided in the request body
  if (budget) query.budget = budget;
  if (date) query.date = date;
  if (category) query.category = category;
  if (rating) query.rating = rating;

  // Add condition to only return upcoming activities based on date
  // const currentDate = new Date();
  // query.date = { ...query.date, $gte: currentDate };

  try {
    // Perform the query with dynamic filters
    const activity = await Activity.find(query);

    if (activity.length === 0) {
      return res.status(404).json({ message: "No activity found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const seacrhPlace = async (req, res) => {
  const { name, category, tags } = req.query;
  let query = {}; // Initialize an empty query object

  // Dynamically add filters to the query object based on the provided query parameters
  if (name) {
    query.Name = name;
  }
  if (category) {
    query.category = category;
  }
  if (tags) {
    query.tags = tags;
  }

  try {
    const place = await Historical.find(query); // Perform the query based on the dynamically constructed query object
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving place", error });
  }
};

const searchActivity = async (req, res) => {
  const { name, category, tags } = req.query;
  let query = {
    flag: false,
  }; // Initialize an empty query object

  // Dynamically add filters to the query object based on the provided query parameters
  if (name) {
    query.title = name; // Case-insensitive search for the title
  }
  if (category) {
    query.category = category; // Case-insensitive search for the category
  }
  if (tags) {
    query.tags = tags; // Case-insensitive search in tags array
  }

  try {
    const activity = await Activity.find(query); // Perform the query based on the dynamically constructed query object
    res.status(200).json(activity);
  } catch (error) {
    // Log the full error to the response for debugging
    res
      .status(500)
      .json({ message: "Error retrieving activity", error: error.message });
  }
};

const searchItinerary = async (req, res) => {
  const { name, category, tags } = req.query;
  let query = {
    flag: false,
  }; // Initialize an empty query object

  // Dynamically add filters to the query object based on the provided query parameters
  if (name) {
    query.name = name; // Case-insensitive search for the name
  }
  if (category) {
    query.category = category; // Case-insensitive search for the category
  }
  if (tags) {
    query.tags = tags;
  } // Case-insensitive search in tags array

  try {
    const itineraries = await Itinerary.find(query); // Perform the query based on the dynamically constructed query object
    res.status(200).json(itineraries);
  } catch (error) {
    // Log the full error to the response for debugging
    res
      .status(500)
      .json({ message: "Error retrieving itineraries", error: error.message });
  }
};

const searchProductTourist = async (req, res) => {
  const { name } = req.query;
  try {
    // Find products by name and ensure they are not archived
    const products = await Product.find({
      name,
      archive: false,
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

const filterProductsTourist = async (req, res) => {
  const { limit } = req.query; // Use req.query for GET requests
  try {
    // Find products with price less than or equal to limit and ensure they are not archived
    const products = await Product.find({
      price: { $lte: limit },
      archive: false,
    }).populate("reviews.touristId", "username");

    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const touristFilterItineraries = async (req, res) => {
  try {
    const { budget, startDate, endDate, tag, language } = req.query;

    // Build the query object dynamically
    const query = {
      flag: false,
    };

    // Ensure budget is a number and apply filter
    if (budget) {
      const budgetNumber = Number(budget); // Convert to number
      if (!isNaN(budgetNumber)) {
        query.budget = { $lte: budgetNumber }; // Budget less than or equal to the specified value
      }
    }

    // Date filters
    if (startDate && endDate) {
      query.availability_dates = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Filter by tags
    if (tag) {
      query.tag = { $in: tag.split(",").map((t) => t.trim()) }; // Trim spaces
    }

    // Filter by language
    if (language) {
      query.language = language;
    }

    // Execute the query
    const itineraries = await Itinerary.find(query).populate("tag");

    // Send the filtered itineraries back
    res.status(200).json(itineraries);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ message: "Error fetching itineraries" });
  }
};

const viewAllPlaces = async (req, res) => {
  try {
    const places = await Historical.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const filterHistoricalByTag = async (req, res) => {
  const { tag } = req.query; // Expecting 'tag' from the query parameters

  if (!tag) {
    return res.status(400).json({ error: "Tag is required for filtering." });
  }

  try {
    // Find historical places that contain the specified tag
    const historicalPlaces = await Historical.find({
      tags: tag, // Matches the tag within the tags array (as a string)
    });

    if (historicalPlaces.length === 0) {
      return res.status(404).json({
        message: "No historical places found with the specified tag.",
      });
    }

    res.status(200).json(historicalPlaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const createRating = async (req, res) => {
  const { productId } = req.params; // Get productId from the URL parameters
  const { rating } = req.body; // Get the rating from the request body

  try {
    // Validate the rating
    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5." });
    }

    const product = await Product.findById(productId); // Find the product by ID
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Calculate new average rating
    const currentTotalRating = product.ratings * (product.reviews.length || 1);
    const newTotalRating = currentTotalRating + rating;
    product.ratings = newTotalRating / (product.reviews.length + 1); // Update average rating

    await product.save(); // Save the updated product

    res.status(200).json({
      message: "Rating added successfully.",
      averageRating: product.ratings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createReview = async (req, res) => {
  const { productId } = req.params; // Get productId from the URL parameters
  const { touristId, reviewText } = req.body; // Get touristId and reviewText from the request body

  try {
    const product = await Product.findById(productId); // Find the product by ID
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Add the review to the product
    product.reviews.push({ touristId, reviewText });
    await product.save(); // Save the updated product

    res.status(200).json({ message: "Review added successfully.", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPurchasedProducts = async (req, res) => {
  const { touristId } = req.params; // Get touristId from the URL parameters

  try {
    // Find the tourist and populate the products field, which includes the product details
    const tourist = await Tourist.findById(touristId).populate({
      path: "products.productId", // Populate the productId field
      select:
        "_id name price description seller_id ratings reviews quantity sales archive images createdAt updatedAt",
    });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Map through the products and merge product details with purchase quantity
    const productsWithDetails = tourist.products.map((item) => ({
      ...item.productId._doc, // Spread the product details
      purchaseQuantity: item.purchaseQuantity, // Add purchase quantity to the product
    }));

    res.status(200).json({ products: productsWithDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookedItinerary = async (req, res) => {
  const { touristId } = req.params; // Correctly accessing touristId from req.params
  try {
    const tourist = await Tourist.findById(touristId).populate(
      "bookedItineraries"
    );
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    res.status(200).json({ bookedItineraries: tourist.bookedItineraries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookedActivities = async (req, res) => {
  const { touristId } = req.params; // Correctly accessing touristId from req.params
  try {
    const tourist = await Tourist.findById(touristId).populate(
      "bookedActivities"
    );
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    res.status(200).json({ bookedActivities: tourist.bookedActivities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const rateandcommentItinerary = async (req, res) => {
  const { itineraryId, rating, comment } = req.body; // Expecting these fields in the request body
  const touristId = req.params.id; // Assuming the tourist ID is passed in the URL

  try {
    // Validate input
    if (!itineraryId || !rating) {
      return res
        .status(400)
        .json({ error: "Itinerary ID and rating are required." });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    // Find the itinerary
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found." });
    }

    if (itinerary.status !== "active") {
      return res
        .status(400)
        .json({ error: "You can only rate an active itinerary." });
    }

    // Ensure itinerary.rating is a valid number before updating
    if (isNaN(itinerary.rating)) {
      itinerary.rating = 0; // Set it to 0 if it's not a valid number
    }

    // Check if the tourist has already rated this itinerary
    const existingRating = itinerary.ratings.find(
      (r) => r.touristId.toString() === touristId
    );
    if (existingRating) {
      return res
        .status(400)
        .json({ error: "You have already rated this itinerary." });
    }

    // Add the rating and comment
    const newRating = { touristId, rating, comment }; // Ensure rating is passed correctly
    itinerary.ratings.push(newRating);

    // Calculate the new average rating
    const totalRatings = itinerary.ratings.length;
    const sumOfRatings = itinerary.ratings.reduce(
      (sum, r) => sum + r.rating,
      0
    );
    itinerary.rating = sumOfRatings / totalRatings;

    await itinerary.save();

    return res
      .status(200)
      .json({ message: "Itinerary rated successfully.", itinerary });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error.", details: error.message });
  }
};

// const rateproduct = async (req, res) => {
//   const { productId, rating } = req.body; // Expecting these fields in the request body
//   const touristId = req.params.id; // Assuming the tourist ID is passed in the URL

//   try {
//     // Validate input
//     if (!productId || rating === undefined) {
//       return res.status(400).json({ error: "Product ID and rating are required." });
//     }

//     // Ensure rating is between 0 and 5
//     if (rating < 0 || rating > 5) {
//       return res.status(400).json({ error: "Rating must be between 0 and 5." });
//     }

//     // Find the product
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found." });
//     }

//     // Calculate the new average rating
//     const existingRating = product.ratings || 0; // Default to 0 if no rating exists
//     const newRating = (existingRating + rating) / 2; // Example averaging; adjust logic as needed
//     product.ratings = newRating;

//     // Save the updated product
//     await product.save();

//     return res.status(200).json({ message: "Product rated successfully.", product });
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ error: "Internal server error.", details: error.message });
//   }
// };

const rateandcommentactivity = async (req, res) => {
  const { activityId, rating, comment } = req.body; // Expecting these fields in the request body
  const touristId = req.params.id; // Assuming the tourist ID is passed in the URL

  try {
    // Validate input
    if (!activityId || !rating) {
      return res
        .status(400)
        .json({ error: "Activity ID and rating are required." });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    // Find the itinerary
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    if (!activity.booking_open) {
      return res.status(400).json({
        error: "Bookings are closed for this activity. You cannot rate it.",
      });
    }

    // Check if the tourist has already rated this itinerary
    // const existingRating = activity.ratings.find(r => r.touristId.toString() === touristId);
    // if (existingRating) {
    //   return res.status(400).json({ error: "You have already rated this activity." });
    // }

    // Add the rating and comment
    activity.ratings.push({ touristId, rating, comment });
    const currentTotalRating = activity.rating * (activity.ratings.length || 1);
    const newTotalRating = currentTotalRating + rating;
    activity.rating = newTotalRating / (activity.ratings.length + 1); // Update average rating

    await activity.save();

    return res
      .status(200)
      .json({ message: "Activity rated successfully.", activity });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error.", details: error.message });
  }
};

const addRatingAndComment = async (req, res) => {
  console.log("Received data:", req.body); // Log the request body
  const { tourGuideId, rating, comment } = req.body;
  const touristId = req.params.id; // Hard-coded tourist ID
  console.log("Received tourist ID:", touristId);

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(touristId) ||
    !mongoose.Types.ObjectId.isValid(tourGuideId)
  ) {
    return res.status(400).json({ message: "Invalid IDs" });
  }
  if (!tourGuideId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const tourGuide = await TourGuide.findById(tourGuideId);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    // Check for existing rating
    const existingRatingIndex = tourGuide.ratings.findIndex((r) =>
      r.touristId.equals(touristId)
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      tourGuide.ratings[existingRatingIndex].rating = rating;
      tourGuide.ratings[existingRatingIndex].comment = comment;
    } else {
      // Add new rating
      tourGuide.ratings.push({ touristId, rating, comment });
    }

    await tourGuide.save();
    res.status(200).json({ message: "Rating added successfully" });
  } catch (error) {
    console.error("Error adding rating:", error);
    res
      .status(500)
      .json({ message: "Error adding rating", error: error.message });
  }
};

//module.exports = addRatingAndComment;

const updateTouristPreferences = async (req, res) => {
  const { preferences } = req.body;

  try {
    const updatedTourist = await Tourist.findByIdAndUpdate(
      req.params.id,
      { $set: { preferences } },
      { new: true }
    );

    if (!updatedTourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json(updatedTourist);
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(400).json({ message: "Error updating preferences", error });
  }
};

const changePasswordTourist = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const touristId = req.params.id;

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Skip password hashing, compare directly
    if (tourist.password !== oldPassword) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Directly assign the new password (plain-text)
    tourist.password = newPassword;
    await tourist.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
};

//Sprint 2 requirements requirement 70 & 71
function calculatePoints(paymentAmount, level) {
  if (level === 1) {
    return paymentAmount * 0.5;
  } else if (level === 2) {
    return paymentAmount * 1;
  } else if (level === 3) {
    return paymentAmount * 1.5;
  }
  return 0;
}
function calculateBadge(points) {
  if (points <= 100000) {
    return "Bronze";
  } else if (points <= 500000) {
    return "Silver";
  } else {
    return "Gold";
  }
}
function determineLevel(loyaltyPoints) {
  if (loyaltyPoints <= 100000) {
    return 1;
  } else if (loyaltyPoints <= 500000) {
    return 2;
  } else {
    return 3;
  }
}
// const addLoyaltyPoints = async (req, res) => {
//   try {
//     const { paymentAmount, touristId } = req.body;
//     //const touristId = req.params.id;

//     const tourist = await Tourist.findById(touristId);
//     if (!tourist) {
//       return res.status(404).json({ message: "Tourist is not found" });
//     }

//     const pointsEarned = calculatePoints(paymentAmount, tourist.level);
//     const badge = calculateBadge(tourist.loyaltyPoints); // Calculate badge based on updated points

//     tourist.loyaltyPoints += pointsEarned;
//     tourist.level = determineLevel(tourist.loyaltyPoints);
//     tourist.badge = badge;

//     // await tourist.save();
//     // const badge = Tourist.calculateBadge(tourist.loyaltyPoints);

//     await tourist.save();
//     res.status(200).json({
//       message: "Loyalty points was added successfully",
//       loyaltyPoints: tourist.loyaltyPoints,
//       level: tourist.level,
//       badge: tourist.badge,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to add loyalty points" });
//   }
// };

const addLoyaltyPoints = async (paymentAmount, touristId) => {
  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      throw new Error("Tourist not found");
    }

    const pointsEarned = calculatePoints(paymentAmount, tourist.level);
    tourist.loyaltyPoints += pointsEarned;
    tourist.level = determineLevel(tourist.loyaltyPoints);
    tourist.badge = calculateBadge(tourist.loyaltyPoints);

    await tourist.save();
    return {
      loyaltyPoints: tourist.loyaltyPoints,
      level: tourist.level,
      badge: tourist.badge,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add loyalty points");
  }
};

const fileComplaint = async (req, res) => {
  const { title, body, date } = req.body;
  const { touristId } = req.params;
  try {
    const newComplaint = new Complaint({
      title,
      body,
      date,
      userId: touristId,
    });
    await newComplaint.save();
    res.status(201).json({ message: "Complaint filed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to file the complaint" });
  }
};

const viewMyComplaints = async (req, res) => {
  const touristID = req.params.touristId;
  try {
    const complaints = await Complaint.find({ userId: touristID });
    res.status(200).json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch complaints from database" });
  }
};

const redeemMyPoints = async (req, res) => {
  const touristID = req.params.id;
  try {
    const tourist = await Tourist.findById(touristID);
    if (tourist.loyaltyPoints >= 10000) {
      tourist.loyaltyPoints -= 10000;
      tourist.wallet += 100;
      await tourist.save();
      return res
        .status(200)
        .json({ message: "Points redeemed successfully", tourist });
    } else return res.status(400).json({ error: "Not Enough Points" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};
const bookActivity = async (req, res) => {
  const { touristId, activityId } = req.params;

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the activity
    const activity = await Activity.findById(activityId);
    if (!activity || !activity.booking_open) {
      return res
        .status(404)
        .json({ message: "Activity not found or not available for booking" });
    }

    // Check if the tourist has already booked this activity
    if (tourist.bookedActivities.includes(activityId)) {
      return res.status(400).json({ message: "Activity already booked" });
    }

    // Update the tourist's bookedActivities and increment bookings count
    tourist.bookedActivities.push(activityId);
    //tourist.wallet -= activity.budget;
    // activity.bookings += 1; // Increment bookings count
    await tourist.save();
    // await activity.save();

    //const loyaltyUpdate = await addLoyaltyPoints(activity.budget, touristId);

    res.status(200).json({
      message: "Activity booked successfully",
      //loyaltyPoints: loyaltyUpdate.loyaltyPoints,
      //level: loyaltyUpdate.level,
      //badge: loyaltyUpdate.badge,
    });
  } catch (error) {
    res.status(500).json({ message: "Error booking activity", error });
  }
};

const bookItinerary = async (req, res) => {
  const { touristId, itineraryId } = req.params;

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the itinerary
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if the tourist has already booked this itinerary
    if (tourist.bookedItineraries.includes(itineraryId)) {
      return res.status(400).json({ message: "Itinerary already booked" });
    }

    // Update the tourist's bookedItineraries and increment bookings count
    tourist.bookedItineraries.push(itineraryId);
    // itinerary.bookings += 1; // Increment bookings count
    //tourist.wallet -= itinerary.budget;
    itinerary.booked += 1;
    await tourist.save();
    await itinerary.save();

    //const loyaltyUpdate = await addLoyaltyPoints(itinerary.budget, touristId);

    res.status(200).json({
      message: "Itinerary booked successfully",
      //loyaltyPoints: loyaltyUpdate.loyaltyPoints,
      //level: loyaltyUpdate.level,
      //badge: loyaltyUpdate.badge,
    });

    //res.status(200).json({ message: "Itinerary booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error booking itinerary", error });
  }
};

const cancelActivityBooking = async (req, res) => {
  const { touristId, activityId } = req.params;

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the activity
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if the activity is within the 48-hour cancellation period
    const hoursUntilActivity =
      (new Date(activity.date) - new Date()) / (1000 * 60 * 60);
    if (hoursUntilActivity < 48) {
      return res.status(400).json({
        message: "Cannot cancel less than 48 hours before the activity",
      });
    }

    // Check if the activity is in payedActivities
    const isPaid = tourist.payedActivities.includes(activityId);
    if (isPaid) {
      // Refund the activity budget to the tourist's wallet
      tourist.wallet += activity.budget;

      // Remove the activity ID from payedActivities
      tourist.payedActivities = tourist.payedActivities.filter(
        (id) => id.toString() !== activityId
      );
    }

    // Remove the activity ID from tourist's bookedActivities
    tourist.bookedActivities = tourist.bookedActivities.filter(
      (id) => id.toString() !== activityId
    );

    // Save updates
    await tourist.save();

    res.status(200).json({
      message: "Activity booking cancelled successfully",
      wallet: tourist.wallet,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling activity booking", error });
  }
};

const cancelItineraryBooking = async (req, res) => {
  const { touristId, itineraryId } = req.params;

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the itinerary
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if the itinerary is within the 48-hour cancellation period
    const hoursUntilItinerary =
      (new Date(itinerary.start_date) - new Date()) / (1000 * 60 * 60);
    if (hoursUntilItinerary < 48) {
      return res.status(400).json({
        message:
          "Cannot cancel less than 48 hours before the itinerary start date",
      });
    }

    const isPaid = tourist.payedItineraries.includes(itineraryId);
    if (isPaid) {
      // Refund the activity budget to the tourist's wallet
      tourist.wallet += itinerary.budget;

      // Remove the activity ID from payedActivities
      tourist.payedItineraries = tourist.payedItineraries.filter(
        (id) => id.toString() !== itineraryId
      );
    }

    // Remove the itinerary ID from tourist's bookedItineraries
    tourist.bookedItineraries = tourist.bookedItineraries.filter(
      (id) => id.toString() !== itineraryId
    );

    await tourist.save();

    itinerary.booked -= 1;
    await itinerary.save();

    res.status(200).json({
      message: "Itinerary booking cancelled successfully",
      wallet: tourist.wallet,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling itinerary booking", error });
  }
};

const bookTransportation = async (req, res) => {
  const { touristId, transportationId } = req.params;

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const transportation = await Transportation.findById(transportationId);
    if (!transportation) {
      return res
        .status(404)
        .json({ message: "Transportation option not found" });
    }

    if (tourist.bookedTransportations.includes(transportationId)) {
      return res.status(400).json({ message: "Transportation already booked" });
    }

    tourist.bookedTransportations.push(transportationId);
    tourist.wallet -= transportation.price;

    await tourist.save();

    const loyaltyUpdate = await addLoyaltyPoints(
      transportation.price,
      touristId
    );

    res.status(200).json({
      message: "transportation booked successfully",
      loyaltyPoints: loyaltyUpdate.loyaltyPoints,
      level: loyaltyUpdate.level,
      badge: loyaltyUpdate.badge,
    });
  } catch (error) {
    res.status(500).json({ message: "Error booking transportation", error });
  }
};

const deleteTouristAccount = async (req, res) => {
  try {
    const { id } = req.params; // Get tourist ID from the URL

    // Find the tourist by ID
    const tourist = await Tourist.findById(id);

    if (!tourist) {
      return res
        .status(404)
        .json({ success: false, message: "Tourist account not found" });
    }

    // Check if the tourist has any booked activities or itineraries
    if (
      tourist.bookedActivities.length === 0 &&
      tourist.bookedItineraries.length === 0
    ) {
      // If no activities or itineraries are booked, delete the account
      await Tourist.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "Tourist account deleted successfully",
      });
    } else {
      // If there are booked activities or itineraries, deny deletion
      return res.status(403).json({
        success: false,
        message:
          "Cannot delete account: you have booked activities or itineraries",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while trying to delete the account",
    });
  }
};

const sendEmailNotification = async (name, recipientEmail, productName) => {
  try {
    await transporter.sendMail({
      from: {
        name: "JetSet",
        address: process.env.EMAIL_USER,
      },
      to: recipientEmail,
      subject: "Product Out of Stock Alert",
      text: `Dear ${name} \n The product "${productName}" is now out of stock.`,
    });
  } catch (error) {
    console.error("Failed to send email notification:", error);
  }
};

const buyProduct = async (req, res) => {
  const { touristId } = req.params;
  const { productId, purchaseQuantity } = req.body;

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const product = await Product.findById(productId).populate(
      "admin_id seller_id"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < purchaseQuantity) {
      return res.status(400).json({ message: "Insufficient product quantity" });
    }

    const totalCost = product.price * purchaseQuantity;
    if (tourist.wallet < totalCost) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }
    tourist.wallet -= totalCost;

    product.quantity -= purchaseQuantity;
    product.sales += purchaseQuantity;
    await product.save();

    const existingProduct = tourist.products.find(
      (item) => item.productId.toString() === productId
    );

    if (existingProduct) {
      existingProduct.purchaseQuantity += purchaseQuantity;
    } else {
      tourist.products.push({ productId, purchaseQuantity });
    }

    await tourist.save();

    // Notify seller and specific admin if the product is out of stock
    if (product.quantity === 0) {
      // Notify the seller
      const seller = product.seller_id;
      if (seller) {
        await sendEmailNotification(seller.name, seller.email, product.name);
        await Notification.create({
          recipient: seller.username,
          role: "Seller",
          message: `Product "${product.name}" is out of stock.`,
        });
      }

      // Notify the specific admin
      const admin = product.admin_id;
      if (admin) {
        await sendEmailNotification(admin.username, admin.email, product.name);
        await Notification.create({
          recipient: admin.username,
          role: "Admin",
          message: `Product "${product.name}" is out of stock.`,
        });
      }
    }

    // Add loyalty points
    const loyaltyUpdate = await addLoyaltyPoints(product.price, touristId);

    res.status(200).json({
      message: "Product purchased successfully",
      loyaltyPoints: loyaltyUpdate.loyaltyPoints,
      level: loyaltyUpdate.level,
      badge: loyaltyUpdate.badge,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error purchasing product" });
  }
};

const getActivitiesByCategory = async (req, res) => {
  try {
    // Assuming category is passed as a query parameter
    const { categoryId } = req.query;

    // Find activities based on category and flag
    const activities = await Activity.find({
      category: categoryId,
      flag: false,
    });

    // Return activities if found, else return an appropriate message
    if (activities.length > 0) {
      res.status(200).json(activities);
    } else {
      res
        .status(404)
        .json({ message: "No activities found for this category." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const generateShareableLink = (itemType, itemId) => {
  return `${process.env.BASE_URL}/${itemType}/${itemId}`;
};

// Method to share via copy link or email
const shareItem = async (req, res) => {
  const { itemId, itemType } = req.body;

  let item;
  try {
    // Fetch the item based on type and id
    if (itemType === "activity") item = await Activity.findById(itemId);
    else if (itemType === "itinerary") item = await Itinerary.findById(itemId);
    else if (itemType === "historical")
      item = await Historical.findById(itemId);
    else return res.status(400).json({ message: "Invalid item type." });

    if (!item) return res.status(404).json({ message: "Item not found." });

    // Generate the link
    const shareableLink = generateShareableLink(itemType, itemId);

    // Return the shareable link
    res.status(200).json({ link: shareableLink });
  } catch (error) {
    res.status(500).json({ message: "Error generating share link", error });
  }
};

const setPreferredCurrency = async (req, res) => {
  const { currency } = req.body; // Expecting 'currency' in the request body
  const touristId = req.params.touristId; // Correctly access touristId from params

  if (!currency) {
    return res
      .status(400)
      .json({ error: "Currency is required to set preferred currency." });
  }

  try {
    const tourist = await Tourist.findByIdAndUpdate(
      touristId,
      { preferredCurrency: currency }, // Set the preferred currency
      { new: true } // Return the updated document
    );

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    res
      .status(200)
      .json({ message: "Preferred currency updated successfully", tourist });
  } catch (error) {
    console.error("Error updating preferred currency:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const axios = require("axios");

let accessToken = null;
let tokenExpiryTime = null;

const getAccessToken = async () => {
  const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.AMADEUS_API_KEY,
    client_secret: process.env.AMADEUS_API_SECRET,
  });

  try {
    const response = await axios.post(url, body, { headers });
    accessToken = response.data.access_token;
    tokenExpiryTime = Date.now() + response.data.expires_in * 1000; // Set expiry time
    console.log("Access token received");
    return accessToken; // Return the token
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Could not retrieve access token");
  }
};

// Search for Flights
const searchFlights = async (req, res) => {
  const { origin, destination, departureDate, returnDate, adults } = req.body;

  try {
    // Check if token is valid
    if (!accessToken || Date.now() >= tokenExpiryTime) {
      await getAccessToken(); // Get a new token if needed
    }

    const response = await axios.get(
      `https://test.api.amadeus.com/v2/shopping/flight-offers`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate: departureDate,
          returnDate: returnDate,
          adults: adults,
          maxPrice: 500, // Optional
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error searching for flights:", error);
    res.status(500).json({ message: "Error searching for flights." });
  }
};

const bookFlight = async (req, res) => {
  const {
    flightId,
    passengerDetails,
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    maxPrice,
  } = req.body;
  const touristId = req.params.touristId; // Assuming touristId is passed in URL params like /book-flight/:touristId

  // Validate required fields
  if (
    !flightId ||
    !passengerDetails ||
    !origin ||
    !destination ||
    !departureDate ||
    !returnDate ||
    !adults
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Ensure the passenger is a Tourist, and we'll reference the Tourist via the booked_by field
    //const touristId = req.user._id;  // Assuming you're using authentication middleware to set the user's ID (Tourist)

    // Create the flight booking document
    const flightBooking = new FlightBooking({
      booked_by: touristId, // Link the Tourist (passenger) via the touristId
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      maxPrice: maxPrice || 500, // Use the default maxPrice if not provided
      status: "pending", // Initial status is 'pending' until the booking is confirmed
      bookingReference: `BOOK-${Math.floor(Math.random() * 10000)}`,
      passengerDetails, // Store passenger details from frontend
    });

    const tourist = await Tourist.findById(touristId);

    tourist.wallet -= maxPrice;

    await tourist.save();

    const loyaltyUpdate = await addLoyaltyPoints(maxPrice, touristId);

    // Simulate the flight booking process (this would be replaced with actual logic)
    // Here, we're just mocking a successful booking response
    const bookingResponse = {
      bookingId: flightBooking.bookingReference,
      flightId,
      passengerDetails,
      status: "Confirmed",
      message: "Flight booked successfully!",
    };

    // Save the booking response in the database
    flightBooking.response = bookingResponse; // Store the external API response (mocked here)
    flightBooking.status = "booked"; // Update the status to 'booked'

    // Save the flight booking document in the database
    await flightBooking.save();

    // Respond with the booking details
    res.json({
      message: bookingResponse.message,
      bookingDetails: flightBooking,
    });
  } catch (error) {
    console.error("Error booking flight:", error);
    res.status(500).json({ message: "Error booking flight." });
  }
};

const HOTELBEDS_BASE_URL =
  "https://api.test.hotelbeds.com/hotel-api/1.0/hotels";

function generateSignature() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const toHash =
    process.env.HOTELBEDS_API_KEY + process.env.HOTELBEDS_SECRET + timestamp;
  return crypto.createHash("sha256").update(toHash).digest("hex");
}

const searchHotels = async (req, res) => {
  const { checkIn, checkOut, adults, children, destinationCode } = req.body;

  // Validate required parameters
  if (!checkIn || !checkOut || !adults || !destinationCode) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // Create the paxes array dynamically based on adults and children
  const paxes = [];

  // Add adults
  for (let i = 0; i < adults; i++) {
    paxes.push({ type: "AD", age: 30 }); // Assuming adult age is 30, adjust as needed
  }

  // Add children
  for (let i = 0; i < children; i++) {
    paxes.push({ type: "CH", age: 5 }); // Assuming child age is 5, adjust as needed
  }

  // Check that the number of paxes matches the total adults + children
  if (paxes.length !== adults + children) {
    return res.status(400).json({
      error:
        "The number of paxes does not match the number of adults and children.",
    });
  }

  // Prepare request payload
  const payload = {
    stay: {
      checkIn,
      checkOut,
    },
    occupancies: [
      {
        rooms: 1, // You can adjust the number of rooms dynamically if needed
        adults,
        children,
        paxes, // Pass the dynamically created paxes array
      },
    ],
    destination: {
      code: destinationCode,
    },
  };

  const signature = generateSignature();

  const headers = {
    "Api-key": process.env.HOTELBEDS_API_KEY,
    "X-Signature": signature,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(HOTELBEDS_BASE_URL, payload, { headers });
    res.json(response.data); // Send the response back to the client
  } catch (error) {
    console.error(
      "Error from Hotelbeds API:",
      error.response?.data || error.message
    );
    res
      .status(error.response?.status || 500)
      .json({ error: "Error from Hotelbeds API" });
  }
};

const TouristItinerary = require("../Models/TouristsItinerary.js");

const bookHotel = async (req, res) => {
  const { checkIn, checkOut, adults, children, destinationCode, paxes, rooms } =
    req.body;
  const touristId = req.params.touristId; // Assuming touristId is passed in URL params like /book-hotel/:touristId

  // Validate required fields
  if (!checkIn || !checkOut || !adults || !destinationCode || !paxes) {
    return res.status(400).json({
      message:
        "Check-in, check-out, adults, destination code, and paxes are required.",
    });
  }

  // Create a new booking object
  const newBooking = new HotelBooking({
    booked_by: touristId, // Reference to the tourist who booked
    checkIn, // Check-in date
    checkOut, // Check-out date
    adults, // Number of adults
    children, // Number of children
    destinationCode, // Destination code
    paxes: paxes, // Store the passenger details from the frontend
    rooms, // Number of rooms (default is 1 if not passed)
    status: "pending", // Set the initial status as 'pending'
    bookingReference: `BOOK-${Math.floor(Math.random() * 10000)}`, // Generate a unique booking reference
  });

  try {
    // Save the booking to the database
    const savedBooking = await newBooking.save();

    // If there is any external API response you need to store, do so in the response field
    savedBooking.response = {}; // Set this to any API response if necessary, mock or real
    await savedBooking.save(); // Save the booking again with the updated response field

    const tourist = await Tourist.findById(touristId);
    const flightPrice = 500;

    tourist.wallet -= flightPrice;

    await tourist.save();

    const loyaltyUpdate = await addLoyaltyPoints(flightPrice, touristId);

    res.status(201).json({
      message: "Booking successful!",
      bookingId: savedBooking.bookingReference,
      status: "booked",
      bookingReference: savedBooking.bookingReference, // You might also want to return the reference
    });
  } catch (err) {
    console.error("Error saving booking:", err);
    res
      .status(500)
      .json({ message: "Error occurred while saving the booking." });
  }
};

const viewFlight = async (req, res) => {
  try {
    const tags = await FlightBooking.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

const viewHotel = async (req, res) => {
  try {
    const tags = await HotelBooking.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

async function bookmarkActivity(touristId, activityId) {
  try {
    // Check for valid input
    if (!touristId || !activityId) {
      throw new Error("Invalid touristId or activityId");
    }

    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      throw new Error("Tourist not found");
    }

    // Check if the activity is already bookmarked
    if (tourist.bookmarkedActivities.includes(activityId)) {
      throw new Error("Activity already bookmarked");
    }

    // Add the activity to the bookmarkedActivities array
    tourist.bookmarkedActivities.push(activityId);

    // Save the tourist document
    const updatedTourist = await tourist.save();

    // Return a success message with the updated tourist object (if needed)
    return {
      message: "Activity bookmarked successfully!",
      tourist: updatedTourist,
    };
  } catch (error) {
    console.error("Error in bookmarkActivity function:", error); // Log the error details
    return { error: error.message };
  }
}
const removeFromCart = async (req, res) => {
  const { item } = req.body; // The item to remove from the cart
  const touristId = req.params.id; // The tourist's ID from the URL parameters

  if (!item) {
    return res.status(400).json({ error: "Item is required" });
  }

  try {
    const updatedTourist = await Tourist.findByIdAndUpdate(
      touristId,
      { $pull: { cart: item } }, // Remove the item from the cart array
      { new: true } // Return the updated document after modification
    );

    if (!updatedTourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }
    const updatedTourist2 = await Tourist.findByIdAndUpdate(
      touristId,
      { $pull: { cartQuantities: item } }, // Remove the item from the cart array
      { new: true } // Return the updated document after modification
    );

    if (!updatedTourist2) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    res.status(200).json({
      message: "Item removed from cart successfully",
      tourist: updatedTourist,
    });
  } catch (error) {
    console.error("Error removing item from cart:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
const getCartItems = async (req, res) => {
  const touristId = req.params.id;

  try {
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }
    if (tourist.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    res.status(200).json({ cart: tourist.cart });
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
const getProductQuantity = async (req, res) => {
  const touristId = req.params.id; // Extract tourist ID from URL params
  const { productId } = req.body; // Extract product ID from request body

  try {
    // Find the tourist by ID and populate the product details in the cart
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Find the product in the tourist's cart using the productId
    const product = tourist.products.find(
      (item) => item.productId._id.toString() === productId
    );

    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found in tourist cart" });
    }

    // Return the product quantity
    return res.status(200).json({
      productId,
      quantity: product.purchaseQuantity,
    });
  } catch (error) {
    console.error("Error fetching product quantity:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

const addToCart = async (req, res) => {
  const { item } = req.body;
  const touristId = req.params.id;

  if (!item) {
    return res.status(400).json({ error: "Item is required" });
  }

  try {
    const updatedTourist = await Tourist.findByIdAndUpdate(
      touristId,
      { $push: { cart: item } },
      { new: true, runValidators: true }
    );

    if (!updatedTourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    res.status(200).json({
      message: "Item added to cart successfully",
      tourist: updatedTourist,
    });
  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
const batchFetchProducts = async (req, res) => {
  const { ids } = req.body; // Array of product IDs

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid or empty product IDs array" });
  }

  try {
    // Fetch products using the provided IDs
    const products = await Product.find({ _id: { $in: ids } });

    if (!products.length) {
      return res
        .status(404)
        .json({ error: "No products found for the provided IDs" });
    }

    // Return the products
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Checkout route handler
const checkout = async (req, res) => {
  // const rateandcommentItinerary = async (req, res) => {
  // const { itineraryId, rating, comment } = req.body; // Expecting these fields in the request body
  // const touristId = req.params.id; // Assuming the tourist ID is passed in the URL
  // const { activityId, rating, comment } = req.body; // Expecting these fields in the request body
  // const touristId = req.params.id;
  const { updatedCart } = req.body;
  // const {touristId}  = req.params;
  const { touristId } = req.params;
  // const { products } = req.body; // Get the products and quantities from the request body

  try {
    // Find the tourist by ID
    console.log("Products in touristController:", updatedCart);
    console.log("Inside Iteration[0] :", updatedCart[0]);

    const tourist = await Tourist.findById(touristId);
    console.log("Tourist  :", tourist);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Ensure cart is not empty
    if (tourist.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    console.log("Inside Iteration[0] :", updatedCart[0]);
    // Add the products and quantities to the tourist's products field
    for (let i = 0; i < tourist.cart.length; i++) {
      const { productId, quantity } = updatedCart[i];
      console.log("Inside Iteration :", updatedCart[i]);
      if (!productId || !quantity) {
        return res
          .status(400)
          .json({ message: `Invalid product data at index ${i}` });
      }
      // Ensure the product exists in the database
      const product = await Product.findById(productId);
      if (!product) {
        console.log("Product Not found :");

        return res
          .status(404)
          .json({ message: `Product with ID ${productId} not found` });
      }

      // Check if the product has enough stock
      // if (product.quantity < quantity) {
      //   return res.status(400).json({ message: `Not enough stock for product ${productId}` });
      // }

      // Add the product and quantity to the tourist's products array
      tourist.cartQuantities.push({
        productId: product._id,
        purchaseQuantity: quantity,
      });
      // console.log("Cart :",cart);
      // Optionally, decrease the quantity of the product in stock
      // product.quantity -= quantity;
      // await product.save();
    }

    // Clear the cart after checkout
    tourist.cart = [];
    console.log("Cart After emptying:", tourist.cart);

    await tourist.save();
    // await clearCartForTourist(touristId);

    // Respond with a success message
    res.status(200).json({ message: "Checkout successful" });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Error processing checkout" });
  }
};

async function unbookmarkActivity(touristId, activityId) {
  try {
    // Check for valid input
    if (!touristId || !activityId) {
      throw new Error("Invalid touristId or activityId");
    }

    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      throw new Error("Tourist not found");
    }

    // Check if the activity is already bookmarked
    if (!tourist.bookmarkedActivities.includes(activityId)) {
      throw new Error("Activity is not bookmarked");
    }

    // Remove the activity ID from the bookmarkedActivities array
    tourist.bookmarkedActivities = tourist.bookmarkedActivities.filter(
      (id) => id.toString() !== activityId.toString()
    );

    // Save the tourist document
    const updatedTourist = await tourist.save();

    // Return a success message with the updated tourist object (if needed)
    return {
      message: "Activity unbookmarked successfully!",
      tourist: updatedTourist,
    };
  } catch (error) {
    console.error("Error in unbookmarkActivity function:", error); // Log the error details
    return { error: error.message };
  }
}

async function bookmarkItinerary(touristId, itineraryId) {
  try {
    // Check for valid input
    if (!touristId || !itineraryId) {
      throw new Error("Invalid touristId or itineraryId");
    }

    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      throw new Error("Tourist not found");
    }

    // Check if the itinerary is already bookmarked
    if (tourist.bookmarkedIteniraries.includes(itineraryId)) {
      throw new Error("Itinerary already bookmarked");
    }

    // Add the itinerary to the bookmarkedIteniraries array
    tourist.bookmarkedIteniraries.push(itineraryId);

    // Save the tourist document
    const updatedTourist = await tourist.save();

    // Return a success message with the updated tourist object (if needed)
    return {
      message: "Itinerary bookmarked successfully!",
      tourist: updatedTourist,
    };
  } catch (error) {
    console.error("Error in bookmarkItinerary function:", error); // Log the error details
    return { error: error.message };
  }
}

async function unbookmarkItinerary(touristId, itineraryId) {
  try {
    // Check for valid input
    if (!touristId || !itineraryId) {
      throw new Error("Invalid touristId or itineraryId");
    }

    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      throw new Error("Tourist not found");
    }

    // Check if the itinerary is already bookmarked
    if (!tourist.bookmarkedIteniraries.includes(itineraryId)) {
      throw new Error("Itinerary is not bookmarked");
    }

    // Remove the itinerary ID from the bookmarkedIteniraries array
    tourist.bookmarkedIteniraries = tourist.bookmarkedIteniraries.filter(
      (id) => id.toString() !== itineraryId.toString()
    );

    // Save the tourist document
    const updatedTourist = await tourist.save();

    // Return a success message with the updated tourist object (if needed)
    return {
      message: "Itinerary unbookmarked successfully!",
      tourist: updatedTourist,
    };
  } catch (error) {
    console.error("Error in unbookmarkItinerary function:", error); // Log the error details
    return { error: error.message };
  }
}

const addToWishlist = async (req, res) => {
  const { productID } = req.body;
  const { touristID } = req.params;

  try {
    const tourist = await Tourist.findById(touristID);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    const productExistsInDb = await Product.findById(productID);
    if (!productExistsInDb) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the product is already in the wishlist
    const productExists = tourist.wishlist.some(
      (item) => item.productId.toString() === productID
    );

    if (productExists) {
      return res
        .status(400)
        .json({ message: "Product already exists in the wishlist" });
    }

    // Add the product to the wishlist
    tourist.wishlist.push({ productId: productID });
    await tourist.save();

    return res.status(200).json({ message: "Added Sucessfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const viewMyWishlist = async (req, res) => {
  const { touristID } = req.params;

  try {
    const tourist = await Tourist.findById(touristID).populate(
      "wishlist.productId"
    );

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    res.status(200).json({ wishlist: tourist.wishlist });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const removeFromMyWishlist = async (req, res) => {
  const { touristID } = req.params;
  const { productID } = req.body;
  try {
    const tourist = await Tourist.findById(touristID);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    tourist.wishlist = tourist.wishlist.filter(
      (item) => item.productId.toString() !== productID
    );

    await tourist.save();

    return res
      .status(200)
      .json({ message: "Product removed from wishlist successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const payByWallet = async (req, res) => {
  const { touristId, itemId } = req.params;
  const { type } = req.body; // Use req.body to get the type

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Determine the amount to be paid based on the type
    let amount = 0;

    if (type === "activity") {
      const activity = await Activity.findById(itemId);
      // if (!activity || !activity.booking_open) {
      //   return res
      //     .status(404)
      //     .json({ message: "Activity not found or not available for payment" });
      // }
      amount = activity.budget;
    } else if (type === "itinerary") {
      const itinerary = await Itinerary.findById(itemId);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      amount = itinerary.budget;
    } else {
      return res.status(400).json({ message: "Invalid payment type" });
    }

    // Check if wallet balance is sufficient
    if (tourist.wallet < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct amount from wallet
    tourist.wallet -= amount;

    // Add the ID to the corresponding paid field
    if (type === "activity") {
      if (!tourist.payedActivities.includes(itemId)) {
        tourist.payedActivities.push(itemId);
      }
    } else if (type === "itinerary") {
      if (!tourist.payedItineraries.includes(itemId)) {
        tourist.payedItineraries.push(itemId);
      }
    }

    // Add loyalty points
    const loyaltyUpdate = await addLoyaltyPoints(amount, touristId);

    // Save tourist data
    await tourist.save();

    // Return success response
    return res.status(200).json({
      message: "Payment successful",
      wallet: tourist.wallet,
      loyaltyPoints: loyaltyUpdate.loyaltyPoints,
      level: loyaltyUpdate.level,
      badge: loyaltyUpdate.badge,
    });
  } catch (error) {
    // Return error response
    return res.status(500).json({
      message: "Error processing payment",
      error: error.message,
    });
  }
};

const payByWalletAct = async (req, res) => {
  const { touristId, activityId } = req.params;
  const { isApplied, promoCode } = req.body;

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Determine the amount to be paid based on the type
    let amount = 0;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    amount = activity.budget;

    if (isApplied) {
      const promo = await PromoCode.findOne({ code: promoCode });

      if (!promo) {
        return res
          .status(400)
          .json({ message: "Promo code not assigned to you" });
      }
      if (!promo.isActive || new Date() > promo.expirationDate) {
        return res
          .status(400)
          .json({ message: "Invalid or expired promo code" });
      }

      amount -= (promo.discount / 100) * amount;

      tourist.promoCodes = tourist.promoCodes.filter(
        (assignedPromo) => !assignedPromo.equals(promo._id)
      );

      await tourist.save(); // Persist changes
    }

    // Check if wallet balance is sufficient
    if (tourist.wallet < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct amount from wallet
    tourist.wallet -= amount;

    // Add the ID to the corresponding paid field
    if (!tourist.payedActivities.includes(activityId)) {
      tourist.payedActivities.push(activityId);
    }
    // Add loyalty points
    const loyaltyUpdate = await addLoyaltyPoints(amount, touristId);

    const mailOptions = {
      from: {
        name: "JetSet",
        address: process.env.EMAIL_USER, // Corrected to reference the environment variable
      },
      to: tourist.email,
      subject: "Payment Confirmation for Your Activity Booking",
      html: `
        <p>Hello ${tourist.username},</p>
        <p>Thank you for booking an activity with JetSet!</p>
        <p>We are pleased to confirm your payment of <strong>${amount}</strong> has been successfully processed using your wallet.</p>
        <p>Activity: ${activity.title}</p>
        <p>Enjoy your activity, and thank you for choosing JetSet!</p>
        <p>Warm regards,</p>
        <p>JetSet Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Save tourist data
    await tourist.save();

    // Return success response
    return res.status(200).json({
      message: "Payment successful",
      wallet: tourist.wallet,
      loyaltyPoints: loyaltyUpdate.loyaltyPoints,
      level: loyaltyUpdate.level,
      badge: loyaltyUpdate.badge,
    });
  } catch (error) {
    // Return error response
    return res.status(500).json({
      message: "Error processing payment",
      error: error.message,
    });
  }
};

const payByCardAct = async (req, res) => {
  const { touristId, activityId } = req.params;
  //const { paymentMethodId } = req.body; //This will be sent by the frontend
  const { isApplied, promoCode } = req.body;
  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the activity
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const amount = activity.budget * 100; // Convert to cents for Stripe

    if (isApplied) {
      const promo = await PromoCode.findOne({ code: promoCode });

      if (!promo) {
        return res
          .status(400)
          .json({ message: "Promo code not assigned to you" });
      }
      if (!promo.isActive || new Date() > promo.expirationDate) {
        return res
          .status(400)
          .json({ message: "Invalid or expired promo code" });
      }

      amount -= (promo.discount / 100) * amount;

      tourist.promoCodes = tourist.promoCodes.filter(
        (assignedPromo) => !assignedPromo.equals(promo._id)
      );

      await tourist.save(); // Persist changes
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Replace with your desired amount
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    // Payment successful, process the payment
    if (!tourist.payedActivities.includes(activityId)) {
      tourist.payedActivities.push(activityId);
    }

    // Add loyalty points
    const loyaltyUpdate = await addLoyaltyPoints(activity.budget, touristId);

    const mailOptions = {
      from: {
        name: "JetSet",
        address: process.env.EMAIL_USER, // Corrected to reference the environment variable
      },
      to: tourist.email,
      subject: "Payment Confirmation for Your Activity Booking",
      html: `
        <p>Hello ${tourist.username},</p>
        <p>Thank you for booking an activity with JetSet!</p>
        <p>We are pleased to confirm your payment of <strong>${amount}</strong> has been successfully processed using your credit card</p>
        <p>Activity: ${activity.title}</p>
        <p>Enjoy your activity, and thank you for choosing JetSet!</p>
        <p>Warm regards,</p>
        <p>JetSet Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Save the tourist data
    await tourist.save();

    // Return success response
    return res.status(200).json({
      message: "Payment successful",
      paymentIntentId: paymentIntent.id,
      //wallet: tourist.wallet, // Optional: if you want to include wallet balance
      loyaltyPoints: loyaltyUpdate.loyaltyPoints,
      level: loyaltyUpdate.level,
      badge: loyaltyUpdate.badge,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: "Error processing payment",
      error: error.message,
    });
  }
};

const payByCardIti = async (req, res) => {
  const { touristId, iteniraryId } = req.params;
  //const { paymentMethodId } = req.body; // This will be sent by the frontend
  const { isApplied, promoCode } = req.body;
  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the activity
    const itinerary = await Itinerary.findById(iteniraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    const amount = itinerary.budget * 100; // Convert to cents for Stripe

    if (isApplied) {
      const promo = await PromoCode.findOne({ code: promoCode });

      if (!promo) {
        return res
          .status(400)
          .json({ message: "Promo code not assigned to you" });
      }
      if (!promo.isActive || new Date() > promo.expirationDate) {
        return res
          .status(400)
          .json({ message: "Invalid or expired promo code" });
      }

      amount -= (promo.discount / 100) * amount;

      tourist.promoCodes = tourist.promoCodes.filter(
        (assignedPromo) => !assignedPromo.equals(promo._id)
      );

      await tourist.save(); // Persist changes
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Replace with your desired amount
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    // Payment successful, process the payment
    if (!tourist.payedItineraries.includes(iteniraryId)) {
      tourist.payedItineraries.push(iteniraryId);
    }

    // Add loyalty points
    const loyaltyUpdate = await addLoyaltyPoints(itinerary.budget, touristId);

    const mailOptions = {
      from: {
        name: "JetSet",
        address: process.env.EMAIL_USER, // Corrected to reference the environment variable
      },
      to: tourist.email,
      subject: "Payment Confirmation for Your Itinerary Booking",
      html: `
        <p>Hello ${tourist.username},</p>
        <p>Thank you for booking an Itinerary with JetSet!</p>
        <p>We are pleased to confirm your payment of <strong>${amount}</strong> has been successfully processed using your credit card.</p>
        <p>Itinerary: ${itinerary.name}</p>
        <p>Enjoy your Itinerary, and thank you for choosing JetSet!</p>
        <p>Warm regards,</p>
        <p>JetSet Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Save the tourist data
    await tourist.save();

    // Return success response
    return res.status(200).json({
      message: "Payment successful",
      paymentIntentId: paymentIntent.id,
      //wallet: tourist.wallet, // Optional: if you want to include wallet balance
      loyaltyPoints: loyaltyUpdate.loyaltyPoints,
      level: loyaltyUpdate.level,
      badge: loyaltyUpdate.badge,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: "Error processing payment",
      error: error.message,
    });
  }
};

const payByWalletIti = async (req, res) => {
  const { touristId, iteniraryId } = req.params;
  const { isApplied, promoCode } = req.body;

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Determine the amount to be paid based on the type
    let amount = 0;

    const itinerary = await Itinerary.findById(iteniraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    amount = itinerary.budget;

    if (isApplied) {
      const promo = await PromoCode.findOne({ code: promoCode });

      if (!promo) {
        return res
          .status(400)
          .json({ message: "Promo code not assigned to you" });
      }
      if (!promo.isActive || new Date() > promo.expirationDate) {
        return res
          .status(400)
          .json({ message: "Invalid or expired promo code" });
      }

      amount -= (promo.discount / 100) * amount;

      tourist.promoCodes = tourist.promoCodes.filter(
        (assignedPromo) => !assignedPromo.equals(promo._id)
      );

      await tourist.save(); // Persist changes
    }

    // Check if wallet balance is sufficient
    if (tourist.wallet < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct amount from wallet
    tourist.wallet -= amount;

    // Add the ID to the corresponding paid field

    if (!tourist.payedItineraries.includes(iteniraryId)) {
      tourist.payedItineraries.push(iteniraryId);
    }

    // Add loyalty points
    const loyaltyUpdate = await addLoyaltyPoints(amount, touristId);

    const mailOptions = {
      from: {
        name: "JetSet",
        address: process.env.EMAIL_USER, // Corrected to reference the environment variable
      },
      to: tourist.email,
      subject: "Payment Confirmation for Your Itinerary Booking",
      html: `
        <p>Hello ${tourist.username},</p>
        <p>Thank you for booking an Itinerary with JetSet!</p>
        <p>We are pleased to confirm your payment of <strong>${amount}</strong> has been successfully processed using your Wallet</p>
        <p>Itinerary: ${itinerary.name}</p>
        <p>Enjoy your Itinerary, and thank you for choosing JetSet!</p>
        <p>Warm regards,</p>
        <p>JetSet Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Save tourist data
    await tourist.save();

    // Return success response
    return res.status(200).json({
      message: "Payment successful",
      wallet: tourist.wallet,
      loyaltyPoints: loyaltyUpdate.loyaltyPoints,
      level: loyaltyUpdate.level,
      badge: loyaltyUpdate.badge,
    });
  } catch (error) {
    // Return error response
    return res.status(500).json({
      message: "Error processing payment",
      error: error.message,
    });
  }
};

const payByWalletProduct = async (req, res) => {
  const { touristId } = req.params;
  const { products, isApplied, promoCode } = req.body;

  try {
    let totalAmount = 0;
    const updatedProducts = [];

    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Validate products and calculate total amount
    for (const { productId, quantity } of products) {
      if (quantity <= 0) {
        return res.status(400).json({
          message: `Invalid quantity for product ID: ${productId}`,
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${productId} not found` });
      }

      const cost = product.price * quantity;

      // Check if the product has already been purchased
      // if (tourist.payedProducts.includes(product._id.toString())) {
      //   return res
      //     .status(400)
      //     .json({ message: `Product ${product.name} is already paid for.` });
      // }

      // Update total amount and store the product details for processing
      totalAmount += cost;
      updatedProducts.push({ product, quantity, cost });
    }

    // Apply promo code if provided
    if (isApplied) {
      const promo = await PromoCode.findOne({ code: promoCode });

      if (!promo) {
        return res
          .status(400)
          .json({ message: "Promo code not assigned to you" });
      }
      if (!promo.isActive || new Date() > promo.expirationDate) {
        return res
          .status(400)
          .json({ message: "Invalid or expired promo code" });
      }

      // Calculate the discount and adjust the total amount
      const discount = (promo.discount / 100) * totalAmount;
      totalAmount -= discount;

      // Remove the promo code from the tourist's list
      tourist.promoCodes = tourist.promoCodes.filter(
        (assignedPromo) => !assignedPromo.equals(promo._id)
      );

      await tourist.save(); // Persist changes
    }

    // Check if wallet balance is sufficient
    if (tourist.wallet < totalAmount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct total amount from wallet
    tourist.wallet -= totalAmount;

    // Process each product
    for (const { product, quantity } of updatedProducts) {
      // Add the product ID to the payedProducts array
      tourist.payedProducts.push(product._id);

      // Increment product sales count
      product.sales += quantity;
      product.quantity -= quantity;

      // Add purchase record to the product's purchaseRecords array
      //  product.purchaseRecords.push({
      //   tourist: touristId,
      //   purchaseDate: new Date(),
      //   quantity: purchaseQuantity,
      // });

      // Save the product updates
      await product.save();
    }

    // Create the order
    const order = {
      orderNumber: `ORD-${Date.now()}`, // Generate unique order number based on timestamp
      status: "pending", // Initial status
      products: updatedProducts.map(({ product, quantity }) => ({
        productId: product._id,
        quantity,
      })),
      orderDate: new Date(),
      paymentMethod: "wallet",
    };

    // Add the order to the tourist's orders array
    tourist.orders.push(order);

    // Save the tourist updates
    await tourist.save();

    // Optionally: Add loyalty points for the purchase
    const loyaltyUpdate = await addLoyaltyPoints(totalAmount, touristId);

    // Send email confirmation
    const mailOptions = {
      from: {
        name: "JetSet",
        address: process.env.EMAIL_USER,
      },
      to: tourist.email,
      subject: "Payment Confirmation for Your Products",
      html: `
        <p>Hello ${tourist.username},</p>
        <p>Thank you for your purchase with JetSet!</p>
        <p>We are pleased to confirm your payment of <strong>${totalAmount}</strong> has been successfully processed using your Wallet.</p>
        <p>Products:</p>
        <ul>
          ${updatedProducts
            .map(
              ({ product, quantity }) =>
                `<li>${product.name} (Quantity: ${quantity})</li>`
            )
            .join("")}
        </ul>
        <p>Enjoy your products, and thank you for choosing JetSet!</p>
        <p>Warm regards,</p>
        <p>JetSet Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Return success response
    return res.status(200).json({
      message: "Payment successful",
      wallet: tourist.wallet,
      loyaltyPoints: loyaltyUpdate.loyaltyPoints,
      level: loyaltyUpdate.level,
      badge: loyaltyUpdate.badge,
    });
  } catch (error) {
    // Return error response
    return res.status(500).json({
      message: "Error processing payment",
      error: error.message,
    });
  }
};

const payCashOnDelivery = async (req, res) => {
  const { touristId } = req.params;
  const { products, isApplied, promoCode } = req.body;

  try {
    let totalAmount = 0;
    const updatedProducts = [];

    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Validate products and calculate total amount
    for (const { productId, quantity } of products) {
      if (quantity <= 0) {
        return res.status(400).json({
          message: `Invalid quantity for product ID: ${productId}`,
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${productId} not found` });
      }

      const cost = product.price * quantity;

      // Update total amount and store the product details for processing
      totalAmount += cost;
      updatedProducts.push({ product, quantity, cost });
    }

    // Apply promo code if provided
    if (isApplied) {
      const promo = await PromoCode.findOne({ code: promoCode });

      if (!promo) {
        return res
          .status(400)
          .json({ message: "Promo code not assigned to you" });
      }
      if (!promo.isActive || new Date() > promo.expirationDate) {
        return res
          .status(400)
          .json({ message: "Invalid or expired promo code" });
      }

      // Calculate the discount and adjust the total amount
      const discount = (promo.discount / 100) * totalAmount;
      totalAmount -= discount;

      // Remove the promo code from the tourist's list
      tourist.promoCodes = tourist.promoCodes.filter(
        (assignedPromo) => !assignedPromo.equals(promo._id)
      );

      await tourist.save(); // Persist changes
    }

    // Check if wallet balance is sufficient
    // if (tourist.wallet < totalAmount) {
    //   return res.status(400).json({ message: "Insufficient wallet balance" });
    // }

    // Deduct total amount from wallet
    //tourist.wallet -= totalAmount;

    // Process each product
    for (const { product, quantity } of updatedProducts) {
      // Add the product ID to the payedProducts array
      //tourist.payedProducts.push(product._id);

      // Increment product sales count
      product.sales += quantity;
      product.quantity -= quantity;

      // Add purchase record to the product's purchaseRecords array
      // product.purchaseRecords.push({
      //   tourist: touristId,
      //   purchaseDate: new Date(),
      //   quantity: purchaseQuantity,
      // });

      // Save the product updates
      await product.save();
    }

    // Create the order
    const order = {
      orderNumber: `ORD-${Date.now()}`, // Generate unique order number based on timestamp
      status: "pending", // Initial status
      products: updatedProducts.map(({ product, quantity }) => ({
        productId: product._id,
        quantity,
      })),
      orderDate: new Date(),
      paymentMethod: "cash",
    };

    // Add the order to the tourist's orders array
    tourist.orders.push(order);

    // Save the tourist updates
    await tourist.save();

    // Optionally: Add loyalty points for the purchase
    const loyaltyUpdate = await addLoyaltyPoints(totalAmount, touristId);

    // Send email confirmation
    const mailOptions = {
      from: {
        name: "JetSet",
        address: process.env.EMAIL_USER,
      },
      to: tourist.email,
      subject: "Payment Confirmation for Your Products",
      html: `
        <p>Hello ${tourist.username},</p>
        <p>Thank you for your purchase with JetSet!</p>
        <p>We are pleased to confirm your payment of <strong>${totalAmount}</strong> has been successfully processed using your Wallet.</p>
        <p>Products:</p>
        <ul>
          ${updatedProducts
            .map(
              ({ product, quantity }) =>
                `<li>${product.name} (Quantity: ${quantity})</li>`
            )
            .join("")}
        </ul>
        <p>Enjoy your products, and thank you for choosing JetSet!</p>
        <p>Warm regards,</p>
        <p>JetSet Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Return success response
    return res.status(200).json({
      //message: "Payment successful",
      //wallet: tourist.wallet,
      loyaltyPoints: loyaltyUpdate.loyaltyPoints,
      level: loyaltyUpdate.level,
      badge: loyaltyUpdate.badge,
    });
  } catch (error) {
    // Return error response
    return res.status(500).json({
      message: "Error processing payment",
      error: error.message,
    });
  }
};

const payByCardPro = async (req, res) => {
  const { touristId } = req.params;
  const { products, isApplied, promoCode } = req.body;

  try {
    let totalAmount = 0;
    const updatedProducts = [];

    // Find the tourist
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Validate products and calculate total amount
    for (const { productId, quantity } of products) {
      if (quantity <= 0) {
        return res.status(400).json({
          message: `Invalid quantity for product ID: ${productId}`,
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${productId} not found` });
      }

      const cost = product.price * quantity;

      // Update total amount and store the product details for processing
      totalAmount += cost;
      updatedProducts.push({ product, quantity, cost });

      product.sales += quantity;
      product.quantity -= quantity;

      // Add purchase record to the product's purchaseRecords array
      // product.purchaseRecords.push({
      //   tourist: touristId,
      //   purchaseDate: new Date(),
      //   quantity: purchaseQuantity,
      // });

      // Add the product ID to the payedProducts array if not already paid for
      // if (!tourist.payedProducts.includes(product._id.toString())) {
      //   tourist.payedProducts.push(product._id);
      // }
    }

    // Apply promo code if provided
    if (isApplied) {
      const promo = await PromoCode.findOne({ code: promoCode });

      if (!promo) {
        return res
          .status(400)
          .json({ message: "Promo code not assigned to you" });
      }
      if (!promo.isActive || new Date() > promo.expirationDate) {
        return res
          .status(400)
          .json({ message: "Invalid or expired promo code" });
      }

      // Calculate the discount and adjust the total amount
      const discount = (promo.discount / 100) * totalAmount;
      totalAmount -= discount;

      // Remove the promo code from the tourist's list
      tourist.promoCodes = tourist.promoCodes.filter(
        (assignedPromo) => !assignedPromo.equals(promo._id)
      );

      await tourist.save(); // Persist changes
    }

    // Create a payment intent with the total amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe expects the amount in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    // Add loyalty points based on the total amount
    const loyaltyUpdate = await addLoyaltyPoints(totalAmount, touristId);

    // Send email confirmation
    const mailOptions = {
      from: {
        name: "JetSet",
        address: process.env.EMAIL_USER,
      },
      to: tourist.email,
      subject: "Payment Confirmation for Your Products",
      html: `
        <p>Hello ${tourist.username},</p>
        <p>Thank you for your purchase with JetSet!</p>
        <p>We are pleased to confirm your payment of <strong>${totalAmount}</strong> has been successfully processed using your Card.</p>
        <p>Products:</p>
        <ul>
          ${updatedProducts
            .map(
              ({ product, quantity }) =>
                `<li>${product.name} (Quantity: ${quantity})</li>`
            )
            .join("")}
        </ul>
        <p>Enjoy your products, and thank you for choosing JetSet!</p>
        <p>Warm regards,</p>
        <p>JetSet Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Create the order
    const order = {
      orderNumber: `ORD-${Date.now()}`, // Generate unique order number based on timestamp
      status: "pending", // Initial status
      products: updatedProducts.map(({ product, quantity }) => ({
        productId: product._id,
        quantity,
      })),
      orderDate: new Date(),
      paymentMethod: "credit card",
    };

    // Add the order to the tourist's orders array
    tourist.orders.push(order);

    // Save the updated data for tourist and product
    await tourist.save();
    // await Promise.all(updatedProducts.map(({ product }) => product.save()));

    // Return success response
    return res.status(200).json({
      message: "Payment successful",
      paymentIntentId: paymentIntent.id,
      loyaltyPoints: loyaltyUpdate.loyaltyPoints,
      level: loyaltyUpdate.level,
      badge: loyaltyUpdate.badge,
    });
  } catch (error) {
    console.error("Error processing payment:", error); // Log error details
    return res.status(500).json({
      message: "Error processing payment",
      error: error.message,
    });
  }
};

// Helper function to filter by date
const filterByDate = (items, isUpcoming) => {
  const now = new Date();
  return items.filter((item) => {
    return isUpcoming ? new Date(item.date) > now : new Date(item.date) <= now;
  });
};
const filterItinerariesByDate = (itineraries, isUpcoming) => {
  const now = new Date();
  return itineraries.filter((itinerary) => {
    const hasValidDates = itinerary.availability_dates.some((date) =>
      isUpcoming ? new Date(date) > now : new Date(date) <= now
    );
    return hasValidDates;
  });
};
const filterItinerariesAllPastDates = (itineraries) => {
  const now = new Date();
  return itineraries.filter((itinerary) => {
    const allPastDates = itinerary.availability_dates.every(
      (date) => new Date(date) < now
    );
    return allPastDates;
  });
};

const paidUpcoming = async (req, res) => {
  const { touristId } = req.params;

  try {
    const tourist = await Tourist.findById(touristId)
      .populate("payedActivities")
      .populate("payedItineraries");

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const upcomingActivities = filterByDate(tourist.payedActivities, true);
    const upcomingItineraries = filterItinerariesByDate(
      tourist.payedItineraries,
      true
    );

    res.status(200).json({
      upcomingActivities,
      upcomingItineraries,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming items", error });
  }
};

const paidHistory = async (req, res) => {
  const { touristId } = req.params;

  try {
    const tourist = await Tourist.findById(touristId)
      .populate("payedActivities")
      .populate("payedItineraries");

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const historyActivities = filterByDate(tourist.payedActivities, false);
    const historyItineraries = filterItinerariesAllPastDates(
      tourist.payedItineraries,
      false
    );

    res.status(200).json({
      historyActivities,
      historyItineraries,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching history items", error });
  }
};
const viewOrders = async (req, res) => {
  const { touristId } = req.params;

  try {
    // Find the tourist by their ID and populate product details in the orders
    const tourist = await Tourist.findById(touristId)
      .select("orders")
      .populate({
        path: "orders.products.productId",
        model: "Product", // Replace "Product" with your product model name
        select: "name price description", // Specify fields to include from the product model
      });

    if (!tourist) {
      return res
        .status(404)
        .json({ success: false, message: "Tourist not found" });
    }

    // Return the orders
    return res.status(200).json({ success: true, orders: tourist.orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching orders",
    });
  }
};

const viewOrderDetails = async (req, res) => {
  const { touristId, orderId } = req.params;

  try {
    // Step 1: Find the tourist by ID
    const tourist = await Tourist.findById(touristId).populate(
      "products bookedActivities bookedItineraries"
    );
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Step 2: Check for the order in purchased products
    const purchasedProduct = tourist.products.find(
      (product) => product._id.toString() === orderId
    );
    if (purchasedProduct) {
      return res.status(200).json({
        orderDetails: purchasedProduct,
        status: purchasedProduct.status || "No status available", // Customize this according to your data structure
      });
    }

    // Step 3: Check for the order in booked activities
    const bookedActivity = tourist.bookedActivities.find(
      (activity) => activity._id.toString() === orderId
    );
    if (bookedActivity) {
      return res.status(200).json({
        orderDetails: bookedActivity,
        status: bookedActivity.status || "No status available", // Customize this according to your data structure
      });
    }

    // Step 4: Check for the order in booked itineraries
    const bookedItinerary = tourist.bookedItineraries.find(
      (itinerary) => itinerary._id.toString() === orderId
    );
    if (bookedItinerary) {
      return res.status(200).json({
        orderDetails: bookedItinerary,
        status: bookedItinerary.status || "No status available", // Customize this according to your data structure
      });
    }

    // Step 5: If no order found, return an error message
    return res.status(404).json({ message: "Order not found." });
  } catch (err) {
    // Step 6: Handle any errors that occur during the process
    return res.status(500).json({ error: err.message });
  }
};

const cancelOrder = async (req, res) => {
  const { touristId, orderId } = req.params;

  try {
    // Find the tourist and their order
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res
        .status(404)
        .json({ success: false, message: "Tourist not found" });
    }

    // Find the order within the tourist's orders
    const order = tourist.orders.id(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check if the order status is "pending"
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    // Calculate the total refund amount
    const products = await Promise.all(
      order.products.map(async (item) => {
        const product = await Product.findById(item.productId).select("price");
        return product ? product.price * item.quantity : 0;
      })
    );

    const refundAmount = products.reduce((total, price) => total + price, 0);

    // Refund the amount to the tourist's wallet
    tourist.wallet += refundAmount;

    // Update the order status to "cancelled"
    order.status = "cancelled";

    // Save the updated tourist document
    await tourist.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      wallet: tourist.wallet,
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while cancelling the order",
    });
  }
};

const viewRefundAmount = async (req, res) => {
  const { touristId, orderId } = req.params;

  // Check if the touristId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(touristId)) {
    return res.status(400).json({ message: "Invalid tourist ID format." });
  }

  try {
    // Find the tourist by ID and populate the products
    const tourist = await Tourist.findById(touristId).populate("products");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    let refundedAmount = 0;

    // Ensure wallet is a valid number
    if (isNaN(tourist.wallet)) {
      return res.status(400).json({ message: "Invalid wallet balance." });
    }

    // Check if the order is a purchased product
    const purchasedProduct = tourist.products.find(
      (product) => product._id.toString() === orderId
    );
    if (purchasedProduct) {
      // Make sure the product has a valid price
      refundedAmount = purchasedProduct.price; // Assuming 'price' is the field to refund
      if (isNaN(refundedAmount)) {
        return res.status(400).json({ message: "Invalid refund amount." });
      }
      tourist.wallet += refundedAmount; // Add refund to wallet
      await tourist.save();
    }

    // If no product is found for refund
    if (refundedAmount === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({
      message: "Refund successful",
      refundedAmount,
      updatedWalletBalance: tourist.wallet,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//   const addTouristAddress = async (req, res) => {
//     try{
//     const { newAddress } = req.body;
//     const touristId = req.params.id;

//     if (!newAddress || !touristId) {
//       return res.status(400).json({ error: "Tourist ID and address are required." });
//     }

//     // Update the tourist's addresses array
//     const updatedTourist = await Tourist.findByIdAndUpdate(
//       touristId,
//       { $push: { addresses: newAddress } }, // Push the new address into the addresses array
//       { new: true } // Return the updated document
//     );

//     if (!updatedTourist) {
//       return res.status(404).json({ error: "Tourist not found." });
//     }

//     // Return the updated tourist document as a response
//     res.status(200).json({ message: "Address added successfully.", tourist: updatedTourist });
//   } catch (error) {
//     console.error("Error adding address:", error.message);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };
const addTouristAddress = async (req, res) => {
  try {
    const { addresses } = req.body;
    const touristId = req.params.id;

    if (!addresses || !addresses.length || !touristId) {
      return res
        .status(400)
        .json({ error: "Tourist ID and addresses are required." });
    }

    const updatedTourist = await Tourist.findByIdAndUpdate(
      touristId,
      { $push: { addresses: { $each: addresses } } },
      { new: true }
    );

    if (!updatedTourist) {
      return res.status(404).json({ error: "Tourist not found." });
    }

    res.status(200).json({
      message: "Addresses added successfully.",
      tourist: updatedTourist,
    });
  } catch (error) {
    console.error("Error adding addresses:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getAddress = async (req, res) => {
  const id = req.params.id;

  try {
    // Find the tourist by their ID
    const tourist = await Tourist.findById(id).select("addresses");

    // Check if tourist exists
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Send the addresses in the response
    return res.status(200).json({
      success: true,
      addresses: tourist.addresses,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getActivitiesBasedOnPreferences = async (req, res) => {
  const { touristId } = req.params; // Destructure touristId from req.params
  try {
    // Find the tourist by ID
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Extract preferences
    const { preferences } = tourist;

    // Map preferences to a list of category names
    const preferredCategories = [];
    if (preferences.historicAreas) preferredCategories.push("historicAreas");
    if (preferences.beaches) preferredCategories.push("beaches");
    if (preferences.familyFriendly) preferredCategories.push("familyFriendly");
    if (preferences.shopping) preferredCategories.push("shopping");

    // Find matching categories in the database
    const categories = await Category.find({
      name: { $in: preferredCategories },
    });
    if (!categories.length) {
      console.log("No matching categories found.");
      return res.status(200).json([]); // Return empty array if no categories match
    }

    const categoryIds = categories.map((category) => category._id);

    // Get all activities matching the preferred categories
    const activities = await Activity.find({
      category: { $in: categoryIds },
    })
      .populate("category") // Populate category details if needed
      .populate("creator") // Optional: Populate creator details
      .exec();

    // Extract max budget from preferences
    const maxBudget = preferences.budget || Number.MAX_SAFE_INTEGER;

    // Filter activities by budget
    const filteredActivities = activities.filter(
      (activity) => activity.budget <= maxBudget
    );

    // Return the filtered activities
    return res.status(200).json(filteredActivities);
  } catch (error) {
    console.error("Error fetching activities:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  SortActivities,
  getItineraries,
  filterActivity,
  searchProductTourist,
  filterProductsTourist,
  touristFilterItineraries,
  createTourist,
  getTouristProfile,
  updateTouristProfile,
  sortProductsTourist,
  filterHistoricalByTag,
  getlistActivities,
  viewAllPlaces, // Export the new method
  getTourist,
  SortItineraries,
  seacrhPlace,
  searchActivity,
  searchItinerary,
  createRating,
  createReview,
  getPurchasedProducts,
  rateandcommentItinerary,
  rateandcommentactivity,
  addRatingAndComment,
  updateTouristPreferences,
  changePasswordTourist,
  addLoyaltyPoints,
  fileComplaint,
  viewMyComplaints,
  redeemMyPoints,
  bookActivity,
  bookItinerary,
  cancelActivityBooking,
  cancelItineraryBooking,
  bookTransportation,
  deleteTouristAccount,
  getItineraryTourist,
  getActivityTourist,
  buyProduct,
  getActivitiesByCategory,
  shareItem,
  setPreferredCurrency,
  searchFlights,
  bookFlight,
  searchHotels,
  bookHotel,
  viewFlight,
  viewHotel,
  getBookedItinerary,
  getBookedActivities,
  bookmarkActivity,
  unbookmarkActivity,
  loginTourist,
  getCartItems,
  addToCart,
  removeFromCart,
  batchFetchProducts,
  getProductQuantity,
  checkout,
  payByWallet,
  payByWalletAct,
  payByWalletIti,
  payByWalletProduct,
  paidUpcoming,
  paidHistory,
  bookmarkItinerary,
  unbookmarkItinerary,
  addToWishlist,
  viewMyWishlist,
  removeFromMyWishlist,
  payByCardAct,
  payByCardIti,
  viewOrders,
  viewOrderDetails,
  cancelOrder,
  viewRefundAmount,
  addTouristAddress,
  getAddress,
  payByCardPro,
  getActivitiesBasedOnPreferences,
  payCashOnDelivery,
};

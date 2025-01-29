const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const touristSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    preferences: {
      historicAreas: { type: Boolean, default: false },
      beaches: { type: Boolean, default: false },
      familyFriendly: { type: Boolean, default: false },
      shopping: { type: Boolean, default: false },
      budget: { type: Number, default: 0 },
    },

    mobile_number: String,
    nationality: String,
    DOB: Date,
    job: String,
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    purchasedProducts: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        purchaseDate: {
          type: Date,
          default: Date.now,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    wallet: { type: Number, default: 0 },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    badge: {
      type: String,
      default: "Bronze",
    },
    bookedActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    bookedItineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    bookedTransportations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transportation",
      },
    ],
    preferredCurrency: {
      type: String,
      default: "EGP",
    },

    // Added a bookmarkedActivities field
    bookmarkedActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    cart: {
      type: [String], // An array of strings
      default: [], // Default value as an empty array
    },
    cartQuantities: [
      {
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          // required: true,
        },
      },
    ],
    addresses: {
      type: [String], // Array of strings
      default: [], // Default value as an empty array
    },
    wishlist: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bookmarkedIteniraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    promoCodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PromoCode",
      },
    ],
    orders: [
      {
        orderNumber: {
          type: String,
          required: true,
          unique: true, // Unique order number for each order
        },
        status: {
          type: String,
          enum: ["pending", "shipped", "delivered", "cancelled"], // Define possible statuses
          default: "pending", // Default status
        },
        products: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product", // Reference to the Product model
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
              min: 1, // Quantity should be at least 1
            },
          },
        ],
        orderDate: {
          type: Date,
          default: Date.now,
        },
        paymentMethod: {
          type: String,
          enum: ["cash", "credit card", "wallet"], // Payment method options
          required: true, // Ensure this field is always provided
        },
      },
    ],
    payedActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    payedItineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    payedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    resetOtp: { type: String },
  },

  { timestamps: true }
);

const Tourist = mongoose.model("Tourist", touristSchema);
module.exports = Tourist;

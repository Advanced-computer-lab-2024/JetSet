const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const activitySchema = new Schema({
    title: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    location: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    price: {
        type: {
          fixed: {
            type: Number,
            required: false // Optional if price range is used
          },
          range: {
            min: {
              type: Number,
              required: false // Optional if fixed price is used
            },
            max: {
              type: Number,
              required: false // Optional if fixed price is used
            }
          }
        },
        validate: {
          validator: function(value) {
            // Ensure either fixed price is set, or both min and max in range are set
            if (value.fixed || (value.range.min && value.range.max)) {
              return true;
            }
            return false;
          },
          message: 'Either a fixed price or a price range (min and max) is required.'
        }
      },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'  // Referencing the Tag model
      }],
    special_discounts: String,
    booking_open: {
        type: Boolean,
        default: true  // Default value is true, meaning bookings are open by default
      },
      rating: {
        type: Number,
        min: 0, // Minimum rating can be 0
        max: 5, // Maximum rating can be 5
        default: 0  // Default rating is 0 when the activity is created
      },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Advertiser',
      required: true
    }
  }, { timestamps: true });
  
  const Activity = mongoose.model('Activity', activitySchema);
  module.exports = Activity;
  
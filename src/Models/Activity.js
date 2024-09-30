const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    title: {
      type: String,
      required: false // Title is now optional
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
      address: {
        type: String,
        required: true // Make address required
      },
      coordinates: {
        lat: {
          type: Number,
          required: false // Optional
        },
        lng: {
          type: Number,
          required: false // Optional
        }
      }
    },
    price: {
        type: {
          fixed: {
            type: Number,
            required: false // Optional
          },
          range: {
            min: {
              type: Number,
              required: false // Optional
            },
            max: {
              type: Number,
              required: false // Optional
            }
          }
        },
        validate: {
          validator: function(value) {
            // Ensure either fixed price is set, or both min and max in range are set
            if (value.fixed || (value.range && value.range.min != null && value.range.max != null)) {
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
    special_discount: {
      type: String,
      required: false // Optional
    },
    booking_open: {
        type: Boolean,
        default: true // Default value is true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0 // Default rating is 0
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Advertiser',
      required: false
    }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;

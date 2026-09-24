const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema(
  {
    propertyTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    propertyType: {
      type: String,
      enum: ['Hostel', 'PG', 'Room', 'Apartment', 'Flat', 'Other'],
      default: 'Hostel',
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    nearbyCollege: {
      type: String,
      default: '',
      trim: true,
    },

    monthlyRent: {
      type: Number,
      min: 0,
      default: 0,
    },

    securityDeposit: {
      type: Number,
      min: 0,
      default: 0,
    },

    genderPreference: {
      type: String,
      enum: ['Male', 'Female', 'Any'],
      default: 'Any',
    },

    totalRooms: {
      type: Number,
      min: 0,
      default: 0,
    },

    availableRooms: {
      type: Number,
      min: 0,
      default: 0,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    // Kept for compatibility with the existing frontend/backend.
    image: {
      type: String,
      default: '',
    },

    ownerName: {
      type: String,
      default: '',
      trim: true,
    },

    ownerEmail: {
      type: String,
      default: '',
      trim: true,
    },

    ownerPhone: {
      type: String,
      default: '',
      trim: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'inactive'],
      default: 'approved',
      index: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    reviewCount: {
      type: Number,
      min: 0,
      default: 0,
    },

    // GeoJSON Point. Coordinates are [longitude, latitude].
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

hostelSchema.index({ location: '2dsphere' });
hostelSchema.index({ city: 1, status: 1 });
hostelSchema.index({ monthlyRent: 1 });

module.exports =
  mongoose.models.Hostel || mongoose.model('Hostel', hostelSchema);

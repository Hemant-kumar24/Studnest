const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
      index: true,
    },

    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },

    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Four Sharing', 'Dormitory'],
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    availableBeds: {
      type: Number,
      required: true,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    amenities: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ['available', 'full', 'maintenance', 'inactive'],
      default: 'available',
      index: true,
    },
  },
  { timestamps: true }
);

roomSchema.index({ hostelId: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ hostelId: 1, status: 1 });

module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);

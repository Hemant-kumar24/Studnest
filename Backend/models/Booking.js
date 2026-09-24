const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
      index: true,
    },

    // New room-level booking reference.
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      index: true,
    },

    // Kept for compatibility with the current application.
    roomType: {
      type: String,
      trim: true,
      default: '',
    },

    duration: {
      type: Number,
      min: 1,
      default: 1,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    amount: {
      type: Number,
      min: 0,
      default: 0,
    },

    note: {
      type: String,
      maxlength: 1000,
      default: '',
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'Approved',
        'Rejected',
        'Cancelled',
        'Confirmed',
        'CheckedIn',
        'Active',
        'Completed',
      ],
      default: 'Pending',
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
      index: true,
    },

    cancelledAt: {
      type: Date,
    },

    cancellationReason: {
      type: String,
      maxlength: 500,
      default: '',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ hostelId: 1, status: 1 });
bookingSchema.index({ roomId: 1, status: 1 });

module.exports =
  mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

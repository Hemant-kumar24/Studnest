const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },

    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['Created', 'Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Created',
      index: true,
    },

    method: {
      type: String,
      default: '',
    },

    paidAt: {
      type: Date,
    },

    failureReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

paymentSchema.index({ bookingId: 1, createdAt: -1 });

module.exports =
  mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

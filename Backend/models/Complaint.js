const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    // ==========================================
    // STUDENT
    // ==========================================
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ==========================================
    // BOOKING
    // ==========================================
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    // ==========================================
    // HOSTEL
    // ==========================================
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
      index: true,
    },

    // ==========================================
    // ROOM
    // ==========================================
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },

    // ==========================================
    // COMPLAINT DETAILS
    // ==========================================
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: [
        "Room",
        "Food",
        "Cleanliness",
        "Maintenance",
        "Electricity",
        "Water",
        "Security",
        "Staff",
        "Payment",
        "Other",
      ],
      default: "Other",
      index: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
      index: true,
    },

    // ==========================================
    // STATUS
    // ==========================================
    status: {
      type: String,
      enum: [
        "Open",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Open",
      index: true,
    },

    // ==========================================
    // ADMIN RESPONSE
    // ==========================================
    adminResponse: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    respondedAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // RESOLUTION
    // ==========================================
    resolvedAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // ATTACHMENTS
    // ==========================================
    attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

complaintSchema.index({
  userId: 1,
  createdAt: -1,
});

complaintSchema.index({
  hostelId: 1,
  status: 1,
});

complaintSchema.index({
  bookingId: 1,
});

complaintSchema.index({
  status: 1,
  priority: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);
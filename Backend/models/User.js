const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ================================
    // BASIC INFORMATION
    // ================================

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    // ================================
    // STUDENT INFORMATION
    // ================================

    college: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },

    gender: {
      type: String,
      enum: ["", "Male", "Female", "Other"],
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    // ================================
    // ACCOUNT
    // ================================

    role: {
      type: String,
      enum: ["user", "student"],
      default: "student",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ================================
    // LOCATION
    // GeoJSON Point
    // coordinates = [longitude, latitude]
    // ================================

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    locationUpdatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Geo queries ke liye
userSchema.index({
  location: "2dsphere",
});

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);
const mongoose = require("mongoose");
const User = require("../models/User");
const Hostel = require("../models/Hostel");

// ============================================
// GET MY LOCATION
// GET /api/user/location
// ============================================
const getMyLocation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "location locationUpdatedAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      location: user.location || null,
      locationUpdatedAt: user.locationUpdatedAt || null,
    });
  } catch (error) {
    console.error("Get location error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch location.",
    });
  }
};

// ============================================
// SAVE MY LOCATION
// PUT /api/user/location
// ============================================
const saveMyLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required.",
      });
    }

    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be between -90 and 90.",
      });
    }

    if (lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be between -180 and 180.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // GeoJSON format:
    // [longitude, latitude]
    user.location = {
      type: "Point",
      coordinates: [lng, lat],
    };

    user.locationUpdatedAt = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Location saved successfully.",
      location: user.location,
      locationUpdatedAt: user.locationUpdatedAt,
    });
  } catch (error) {
    console.error("Save location error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save location.",
    });
  }
};

// ============================================
// GET NEARBY HOSTELS
// GET /api/user/nearby-hostels
// ============================================
const getNearbyHostels = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "location"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const coordinates = user.location?.coordinates;

    // No saved location
    if (
      !Array.isArray(coordinates) ||
      coordinates.length !== 2 ||
      !Number.isFinite(coordinates[0]) ||
      !Number.isFinite(coordinates[1]) ||
      (coordinates[0] === 0 && coordinates[1] === 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please save your current location first.",
      });
    }

    const longitude = coordinates[0];
    const latitude = coordinates[1];

    // Radius in KM
    const radius = Number(req.query.radius) || 10;

    // Limit
    const limit = Number(req.query.limit) || 20;

    const safeRadius = Math.min(
      Math.max(radius, 1),
      50
    );

    const safeLimit = Math.min(
      Math.max(limit, 1),
      100
    );

    // ========================================
    // GEO QUERY
    // ========================================

    const hostels = await Hostel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              longitude,
              latitude,
            ],
          },

          key: "location",

          distanceField: "distanceMeters",

          maxDistance: safeRadius * 1000,

          spherical: true,

          query: {
            status: "approved",
            "location.coordinates.0": {
              $ne: 0,
            },
            "location.coordinates.1": {
              $ne: 0,
            },
          },
        },
      },

      {
        $limit: safeLimit,
      },
    ]);

    // ========================================
    // FORMAT RESPONSE
    // ========================================

    const formattedHostels = hostels.map(
      (hostel) => ({
        ...hostel,

        distanceKm: Number(
          (hostel.distanceMeters / 1000).toFixed(2)
        ),
      })
    );

    return res.status(200).json({
      success: true,

      count: formattedHostels.length,

      radiusKm: safeRadius,

      userLocation: {
        latitude,
        longitude,
      },

      hostels: formattedHostels,
    });
  } catch (error) {
    console.error(
      "Nearby hostels error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch nearby hostels.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyLocation,
  saveMyLocation,
  getNearbyHostels,
};
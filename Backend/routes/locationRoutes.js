const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getMyLocation,
  saveMyLocation,
  getNearbyHostels,
} = require("../controllers/locationController");

// ============================================
// LOCATION
// ============================================

router.get(
  "/location",
  authMiddleware,
  getMyLocation
);

router.put(
  "/location",
  authMiddleware,
  saveMyLocation
);

// ============================================
// NEARBY HOSTELS
// ============================================

router.get(
  "/nearby-hostels",
  authMiddleware,
  getNearbyHostels
);

module.exports = router;
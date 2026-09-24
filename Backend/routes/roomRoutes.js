const express = require("express");

const router = express.Router();

const {
  getHostelRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomAvailability,
} = require("../controllers/roomController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminAuth = require("../middlewares/adminAuth");

// View rooms
router.get(
  "/hostel/:hostelId",
  authMiddleware,
  getHostelRooms
);

router.get(
  "/:id",
  authMiddleware,
  getRoom
);

// Admin room management
router.post(
  "/hostel/:hostelId",
  adminAuth,
  createRoom
);

router.put(
  "/:id",
  adminAuth,
  updateRoom
);

router.delete(
  "/:id",
  adminAuth,
  deleteRoom
);

router.patch(
  "/:id/availability",
  adminAuth,
  updateRoomAvailability
);

module.exports = router;
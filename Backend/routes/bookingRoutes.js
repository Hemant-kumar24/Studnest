const express = require("express");

const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getMyBooking,
  cancelMyBooking,
  getAllBookings,
  updateBookingStatus,
  approveBooking,
  rejectBooking,
} = require("../controllers/bookingController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminAuth = require("../middlewares/adminAuth");

// ==========================================
// STUDENT BOOKING
// ==========================================

router.post(
  "/",
  authMiddleware,
  createBooking
);

router.get(
  "/my",
  authMiddleware,
  getMyBookings
);

router.get(
  "/my/:id",
  authMiddleware,
  getMyBooking
);

router.patch(
  "/my/:id/cancel",
  authMiddleware,
  cancelMyBooking
);

// ==========================================
// ADMIN BOOKING
// ==========================================

// GET /api/bookings/admin
router.get(
  "/admin",
  adminAuth,
  getAllBookings
);

// PATCH /api/bookings/admin/:id/approve
router.patch(
  "/admin/:id/approve",
  adminAuth,
  approveBooking
);

// PATCH /api/bookings/admin/:id/reject
router.patch(
  "/admin/:id/reject",
  adminAuth,
  rejectBooking
);

// PUT /api/bookings/admin/:id
router.put(
  "/admin/:id",
  adminAuth,
  updateBookingStatus
);

module.exports = router;
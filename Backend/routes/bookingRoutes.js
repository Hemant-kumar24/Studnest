
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

const {
  getBookingByIdAdmin,
} = require("../controllers/adminBookingController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminAuth = require("../middlewares/adminAuth");

// ==========================================
// STUDENT BOOKING ROUTES
// ==========================================

// POST /api/bookings
router.post("/", authMiddleware, createBooking);

// GET /api/bookings/my
router.get("/my", authMiddleware, getMyBookings);

// GET /api/bookings/my/:id
router.get("/my/:id", authMiddleware, getMyBooking);

// PATCH /api/bookings/my/:id/cancel
router.patch(
  "/my/:id/cancel",
  authMiddleware,
  cancelMyBooking
);

// ==========================================
// ADMIN BOOKING ROUTES
// ==========================================

// GET /api/bookings/admin
router.get("/admin", adminAuth, getAllBookings);

// GET /api/bookings/admin/:id
router.get(
  "/admin/:id",
  adminAuth,
  getBookingByIdAdmin
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

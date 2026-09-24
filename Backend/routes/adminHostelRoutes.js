const express = require("express");

const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");
const upload = require("../middlewares/upload");

const {
  createHostel,
  getAdminHostels,
  getAdminHostelById,
  updateHostel,
  deleteHostel,
  updateSeats,
} = require("../controllers/adminHostelController");

// ==========================================
// CREATE HOSTEL
// ==========================================

router.post(
  "/",
  adminAuth,
  upload.array("images", 8),
  createHostel
);

// ==========================================
// GET ADMIN HOSTELS
// ==========================================

router.get(
  "/",
  adminAuth,
  getAdminHostels
);

// ==========================================
// GET SINGLE ADMIN HOSTEL
// ==========================================

router.get(
  "/:id",
  adminAuth,
  getAdminHostelById
);

// ==========================================
// UPDATE HOSTEL
// ==========================================

router.put(
  "/:id",
  adminAuth,
  upload.array("images", 8),
  updateHostel
);

// ==========================================
// DELETE HOSTEL
// ==========================================

router.delete(
  "/:id",
  adminAuth,
  deleteHostel
);

// ==========================================
// UPDATE SEATS
// ==========================================

router.patch(
  "/:id/seats",
  adminAuth,
  updateSeats
);

module.exports = router;
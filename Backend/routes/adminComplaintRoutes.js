const express = require("express");

const router = express.Router();

const {
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/adminComplaintController");

const adminAuth = require("../middlewares/adminAuth");

// ==========================================
// ADMIN COMPLAINT ROUTES
// ==========================================

// Get all complaints
// GET /api/admin/complaints
router.get(
  "/",
  adminAuth,
  getAllComplaints
);

// Get single complaint
// GET /api/admin/complaints/:id
router.get(
  "/:id",
  adminAuth,
  getComplaintById
);

// Update complaint
// PUT /api/admin/complaints/:id
router.put(
  "/:id",
  adminAuth,
  updateComplaint
);

// Delete complaint
// DELETE /api/admin/complaints/:id
router.delete(
  "/:id",
  adminAuth,
  deleteComplaint
);

module.exports = router;
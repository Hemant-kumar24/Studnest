const express = require("express");

const router = express.Router();

const {
  createComplaint,
  getMyComplaints,
  getMyComplaint,
  deleteComplaint,
} = require("../controllers/complaintController");

const authMiddleware = require("../middlewares/authMiddleware");

// ==========================================
// STUDENT COMPLAINT ROUTES
// ==========================================

// Create complaint
// POST /api/complaints
router.post(
  "/",
  authMiddleware,
  createComplaint
);

// Get my complaints
// GET /api/complaints/my
router.get(
  "/my",
  authMiddleware,
  getMyComplaints
);

// Get single complaint
// GET /api/complaints/my/:id
router.get(
  "/my/:id",
  authMiddleware,
  getMyComplaint
);

// Delete open complaint
// DELETE /api/complaints/my/:id
router.delete(
  "/my/:id",
  authMiddleware,
  deleteComplaint
);

module.exports = router;
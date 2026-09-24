const express = require("express");

const router = express.Router();

const {
  getAllStudents,
  getStudentById,
} = require("../controllers/adminStudentController");

const adminAuth = require("../middlewares/adminAuth");

// ==========================================
// ADMIN STUDENTS
// ==========================================

// Get all students
router.get(
  "/",
  adminAuth,
  getAllStudents
);

// Get single student
router.get(
  "/:id",
  adminAuth,
  getStudentById
);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  getAllPayments,
  getPaymentById,
  getRevenueSummary,
} = require("../controllers/adminPaymentController");

const adminAuth = require("../middlewares/adminAuth");

// Revenue summary MUST come before /:id
router.get("/revenue-summary", adminAuth, getRevenueSummary);

router.get("/", adminAuth, getAllPayments);

router.get("/:id", adminAuth, getPaymentById);

module.exports = router;
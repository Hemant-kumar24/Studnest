const express = require('express');

const router = express.Router();

const {
  getAdminProfile,
  updateAdminProfile
} = require('../controllers/adminController');

const {
  getDashboardOverview,
  getBookingAnalytics,
  getRevenueAnalytics,
  getOccupancyAnalytics,
  getHostelPerformance,
  getRecentBookings,
  getComplaintAnalytics
} = require('../controllers/adminDashboardController');

const adminAuth = require('../middlewares/adminAuth');


// ==========================================
// ADMIN PROFILE
// ==========================================

router.get('/profile', adminAuth, getAdminProfile);

router.put('/profile', adminAuth, updateAdminProfile);


// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
  '/dashboard/overview',
  adminAuth,
  getDashboardOverview
);

router.get(
  '/dashboard/bookings',
  adminAuth,
  getBookingAnalytics
);

router.get(
  '/dashboard/revenue',
  adminAuth,
  getRevenueAnalytics
);

router.get(
  '/dashboard/occupancy',
  adminAuth,
  getOccupancyAnalytics
);

router.get(
  '/dashboard/hostels',
  adminAuth,
  getHostelPerformance
);

router.get(
  '/dashboard/recent-bookings',
  adminAuth,
  getRecentBookings
);

router.get(
  '/dashboard/complaints',
  adminAuth,
  getComplaintAnalytics
);


module.exports = router;
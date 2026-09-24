const User = require('../models/User');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');


// ==========================================
// DASHBOARD OVERVIEW
// ==========================================
exports.getDashboardOverview = async (req, res) => {
  try {
    const [
      totalStudents,
      totalHostels,
      totalRooms,
      totalBookings,
      totalPayments,
      totalReviews,
      pendingBookings,
      confirmedBookings,
      activeBookings,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments({ role: { $in: ['student', 'user'] } }),

      Hostel.countDocuments(),

      Room.countDocuments(),

      Booking.countDocuments(),

      Payment.countDocuments(),

      Review.countDocuments(),

      Booking.countDocuments({ status: 'Pending' }),

      Booking.countDocuments({
        status: { $in: ['Confirmed', 'Approved'] }
      }),

      Booking.countDocuments({
        status: { $in: ['CheckedIn', 'Active'] }
      }),

      Payment.aggregate([
        { $match: { status: 'Paid' } },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ])
    ]);

    res.json({
      students: totalStudents,
      hostels: totalHostels,
      rooms: totalRooms,
      bookings: totalBookings,
      payments: totalPayments,
      reviews: totalReviews,
      pendingBookings,
      confirmedBookings,
      activeBookings,
      revenue: totalRevenue[0]?.total || 0
    });

  } catch (error) {
    console.error('Dashboard overview error:', error);

    res.status(500).json({
      message: 'Failed to load dashboard overview'
    });
  }
};


// ==========================================
// BOOKING ANALYTICS
// ==========================================
exports.getBookingAnalytics = async (req, res) => {
  try {
    const analytics = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ]);

    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookings: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    res.json({
      byStatus: analytics,
      monthly: monthlyBookings
    });

  } catch (error) {
    console.error('Booking analytics error:', error);

    res.status(500).json({
      message: 'Failed to load booking analytics'
    });
  }
};


// ==========================================
// REVENUE ANALYTICS
// ==========================================
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const revenueByStatus = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          total: -1
        }
      }
    ]);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'Paid'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidAt' },
            month: { $month: '$paidAt' }
          },
          revenue: { $sum: '$amount' },
          transactions: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    const totalRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'Paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      byStatus: revenueByStatus,
      monthly: monthlyRevenue
    });

  } catch (error) {
    console.error('Revenue analytics error:', error);

    res.status(500).json({
      message: 'Failed to load revenue analytics'
    });
  }
};


// ==========================================
// OCCUPANCY ANALYTICS
// ==========================================
exports.getOccupancyAnalytics = async (req, res) => {
  try {
    const rooms = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$capacity' },
          availableBeds: { $sum: '$availableBeds' },
          totalRooms: { $sum: 1 }
        }
      }
    ]);

    const data = rooms[0] || {
      totalCapacity: 0,
      availableBeds: 0,
      totalRooms: 0
    };

    const occupiedBeds = Math.max(
      data.totalCapacity - data.availableBeds,
      0
    );

    const occupancyRate =
      data.totalCapacity > 0
        ? Number(((occupiedBeds / data.totalCapacity) * 100).toFixed(2))
        : 0;

    res.json({
      totalRooms: data.totalRooms,
      totalCapacity: data.totalCapacity,
      availableBeds: data.availableBeds,
      occupiedBeds,
      occupancyRate
    });

  } catch (error) {
    console.error('Occupancy analytics error:', error);

    res.status(500).json({
      message: 'Failed to load occupancy analytics'
    });
  }
};


// ==========================================
// HOSTEL PERFORMANCE
// ==========================================
exports.getHostelPerformance = async (req, res) => {
  try {
    const performance = await Booking.aggregate([
      {
        $group: {
          _id: '$hostelId',
          totalBookings: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          confirmedBookings: {
            $sum: {
              $cond: [
                {
                  $in: [
                    '$status',
                    ['Approved', 'Confirmed', 'CheckedIn', 'Active', 'Completed']
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },

      {
        $lookup: {
          from: 'hostels',
          localField: '_id',
          foreignField: '_id',
          as: 'hostel'
        }
      },

      {
        $unwind: {
          path: '$hostel',
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $project: {
          _id: 1,
          hostelName: '$hostel.propertyTitle',
          city: '$hostel.city',
          rating: '$hostel.rating',
          totalRooms: '$hostel.totalRooms',
          availableRooms: '$hostel.availableRooms',
          totalBookings: 1,
          confirmedBookings: 1,
          totalAmount: 1
        }
      },

      {
        $sort: {
          totalBookings: -1
        }
      }
    ]);

    res.json(performance);

  } catch (error) {
    console.error('Hostel performance error:', error);

    res.status(500).json({
      message: 'Failed to load hostel performance'
    });
  }
};


// ==========================================
// RECENT BOOKINGS
// ==========================================
exports.getRecentBookings = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      50
    );

    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('hostelId', 'propertyTitle city')
      .populate('roomId', 'roomNumber roomType')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(bookings);

  } catch (error) {
    console.error('Recent bookings error:', error);

    res.status(500).json({
      message: 'Failed to load recent bookings'
    });
  }
};


// ==========================================
// COMPLAINT ANALYTICS
// ==========================================
// Complaint model/controller does not currently exist
// in the backend models/controllers you showed.
// Therefore this endpoint intentionally returns zero
// instead of breaking the dashboard.
exports.getComplaintAnalytics = async (req, res) => {
  res.json({
    total: 0,
    pending: 0,
    resolved: 0,
    message: 'Complaint module is not currently available'
  });
};
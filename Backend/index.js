const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");
const roomRoutes = require("./routes/roomRoutes");
const authRoutes = require("./routes/authRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminStudentRoutes = require("./routes/adminStudentRoutes");
const adminHostelRoutes = require("./routes/adminHostelRoutes");
const adminReviewRoutes = require("./routes/adminReviewRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminComplaintRoutes = require("./routes/adminComplaintRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminNotificationRoutes = require("./routes/adminNotificationRoutes");
const adminPaymentRoutes = require("./routes/adminPaymentRoutes");
const locationRoutes = require("./routes/locationRoutes");


// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

dotenv.config();

const app = express();

// Trust proxy for Render
app.set("trust proxy", 1);

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  "https://frontend-vercel-j3aloxxnh-hemant-kumar24s-projects.vercel.app",
  "https://frontend-vercel-tau-one.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

// Add environment variable origins
if (process.env.CLIENT_ORIGIN) {
  const envOrigins = process.env.CLIENT_ORIGIN
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  allowedOrigins.push(...envOrigins);
}

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      // such as mobile apps or curl
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],

    optionsSuccessStatus: 200,
  })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());

// Handle preflight requests
app.options("*", cors());

// ==========================================
// API ROUTES
// ==========================================

// Student Complaints
app.use(
  "/api/complaints",
  complaintRoutes
);

// Admin Complaints
app.use(
  "/api/admin/complaints",
  adminComplaintRoutes
);

// Student Notifications
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);

// Payment
app.use(
  "/api/payment",
  paymentRoutes
);

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Student Hostels
app.use(
  "/api/hostels",
  hostelRoutes
);

// Student Bookings
app.use(
  "/api/bookings",
  bookingRoutes
);

// Admin
app.use(
  "/api/admin",
  adminRoutes
);
app.use(
  "/api/admin/students",
  adminStudentRoutes
);
app.use(
  "/api/admin/payments",
  adminPaymentRoutes
);

// Admin Hostels
app.use(
  "/api/admin/hostels",
  adminHostelRoutes
);

// Admin Reviews
app.use(
  "/api/admin/reviews",
  adminReviewRoutes
);

// Student/User
app.use(
  "/api/user",
  userRoutes
);
app.use("/api/user", locationRoutes);

// Rooms
app.use(
  "/api/rooms",
  roomRoutes
);

// Student Reviews
app.use(
  "/api/reviews",
  reviewRoutes
);

// ==========================================
// ROOT / HEALTH CHECK
// ==========================================

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "studnest-backend",
  });
});

app.get(
  "/healthz",
  (req, res) => {
    res.status(200).send("ok");
  }
);

// ==========================================
// DEBUG ENDPOINT
// ==========================================

app.get(
  "/api/debug",
  (req, res) => {
    res.json({
      message: "API is working",

      timestamp: new Date().toISOString(),

      origin: req.headers.origin,

      allowedOrigins,

      envClientOrigin:
        process.env.CLIENT_ORIGIN || "Not set",

      headers: {
        origin: req.headers.origin,

        "user-agent":
          req.headers["user-agent"],

        "content-type":
          req.headers["content-type"],
      },
    });
  }
);

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    console.error(
      "Error:",
      err.stack
    );

    res.status(500).json({
      message: "Something went wrong!",

      error:
        process.env.NODE_ENV === "production"
          ? {}
          : err.stack,
    });
  }
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use(
  "*",
  (req, res) => {
    res.status(404).json({
      message: "Route not found",
    });
  }
);

// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
  .connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `🚀 Server running on port ${PORT}`
        );

        console.log(
          `📍 Environment: ${
            process.env.NODE_ENV ||
            "development"
          }`
        );
      }
    );
  })
  .catch((err) => {
    console.error(
      "❌ MongoDB connection error:",
      err
    );

    process.exit(1);
  });

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

process.on(
  "SIGTERM",
  () => {
    console.log(
      "SIGTERM received, shutting down gracefully"
    );

    mongoose.connection.close(
      () => {
        console.log(
          "MongoDB connection closed"
        );

        process.exit(0);
      }
    );
  }
);
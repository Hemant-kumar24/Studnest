# StudNest
> **A full-stack student accommodation management platform built with React, Node.js, Express, MongoDB, Cloudinary and Razorpay.**

StudNest  is a production-style web application designed to help students discover hostels/PGs, view rooms and amenities, manage favorites, submit bookings, make online payments, write reviews, raise complaints and receive notifications.

The platform also provides a dedicated admin panel for managing hostels, rooms, bookings, students, payments, reviews, complaints, notifications and dashboard analytics.

### Live Demo

- **Frontend:** https://frontend-vercel-tau-one.vercel.app/
- **Backend API:** https://studnest-backend.onrender.com/
- **GitHub Repository:** https://github.com/Hemant-kumar24/Studnest

---

## Table of Contents
- [Project Overview](#project-overview)

- [Problem Statement](#problem-statement)

- [Objectives](#objectives)

- [Key Features](#key-features)

- [Technology Stack](#technology-stack)

- [System Architecture](#system-architecture)

- [Application Flow](#application-flow)

- [Frontend Architecture](#frontend-architecture)

- [Backend Architecture](#backend-architecture)

- [Database Design](#database-design)

- [Authentication and Authorization](#authentication-and-authorization)

- [CRUD Architecture](#crud-architecture)

- [Image Upload and Cloudinary](#image-upload-and-cloudinary)

- [Booking Flow](#booking-flow)

- [Payment Flow](#payment-flow)

- [Location and Nearby Hostel Flow](#location-and-nearby-hostel-flow)

- [Reviews, Favorites, Complaints and Notifications](#reviews-favorites-complaints-and-notifications)

- [REST API Overview](#rest-api-overview)

- [Project Structure](#project-structure)

- [Environment Variables](#environment-variables)

- [Installation and Local Setup](#installation-and-local-setup)

- [Running the Application](#running-the-application)

- [Deployment Architecture](#deployment-architecture)

- [Security Considerations](#security-considerations)

- [Error Handling](#error-handling)

- [Database Indexing and Performance](#database-indexing-and-performance)

- [Important Design Decisions](#important-design-decisions)

- [Interview Discussion Points](#interview-discussion-points)

- [Future Enhancements](#future-enhancements)

- [Author](#author)

---

## Project Overview
StudNest solves a common student problem: finding suitable accommodation near a college while keeping information, booking, payment and support activities in one platform.

The application has two major roles:

### Student
Students can:

- Register and log in

- Browse hostels/PGs

- View hostel details

- View rooms and availability

- Search and filter accommodation

- Save favorite hostels

- Store their location

- Discover nearby hostels

- Create booking requests

- Make booking payments

- Track booking status

- View payment history

- Write, update and delete reviews

- Raise complaints

- Track complaint status

- Receive notifications

- Manage their profile

### Admin
Admins can:

- Register and log in

- Manage their profile

- Manage hostel listings

- Upload multiple hostel images

- Update hostel information

- Delete hostel listings

- Manage rooms and room availability

- View and manage student bookings

- Approve or reject bookings

- View payments and revenue information

- Manage reviews

- Manage complaints

- Send/manage notifications

- View students

- View dashboard analytics

- Manage system settings

---

## Problem Statement
Students often use multiple sources to find accommodation, verify availability, contact owners and manage bookings.

StudNest brings these activities into one system by providing:

1. Accommodation discovery

2. Room-level availability

3. Booking management

4. Online payment

5. Reviews and ratings

6. Complaint/support management

7. Location-based discovery

8. Admin management and analytics

---

## Objectives
- Build a complete MERN-based full-stack application.

- Implement secure authentication and role-based authorization.

- Provide RESTful APIs for all major modules.

- Store application data using MongoDB and Mongoose.

- Store accommodation images using Cloudinary instead of MongoDB.

- Integrate Razorpay for online payments.

- Implement room-level booking.

- Maintain booking and payment status independently.

- Provide student and admin dashboards.

- Implement location-based hostel discovery using GeoJSON and 2dsphere indexes.

- Provide reusable React components and service modules.

- Separate frontend presentation, API services and backend business logic.

---

# Key Features
## Student Features
- Student registration and login

- JWT-based authentication

- Protected student routes

- Hostel discovery

- Hostel detail page

- Room listing

- Room availability

- Search/filter functionality

- Nearby hostel discovery

- Favorite hostels

- Booking creation

- Booking cancellation

- Booking status tracking

- Razorpay booking payment

- Payment verification

- Payment history

- Reviews and ratings

- Complaints/support

- Notifications

- Profile management

## Admin Features
- Admin registration/login

- Protected admin routes

- Admin dashboard

- Hostel CRUD

- Multiple image upload

- Room CRUD

- Room availability management

- Booking management

- Booking approval/rejection

- Student management

- Payment management

- Revenue summary

- Review management

- Complaint management

- Notification management

- Admin profile management

- System settings

- Dashboard analytics

---

# Technology Stack
## Frontend
\| Technology | Purpose |

\|---|---|

\| React 19 | UI development |

\| Vite | Frontend build tool |

\| React Router | Client-side routing |

\| Axios | API communication |

\| Tailwind CSS | Styling |

\| Framer Motion | UI animations |

\| Recharts | Dashboard charts |

\| React Hot Toast | User feedback |

\| Lucide React | Icons |

\| React Icons | Icons |

\| React CountUp | Animated statistics |

## Backend
\| Technology | Purpose |

\|---|---|

\| Node.js | JavaScript runtime |

\| Express.js | REST API server |

\| MongoDB | Database |

\| Mongoose | MongoDB ODM |

\| JWT | Authentication |

\| bcryptjs | Password hashing |

\| Multer | Multipart file handling |

\| Cloudinary | Image storage |

\| multer-storage-cloudinary | Direct Multer → Cloudinary uploads |

\| Razorpay | Payment gateway |

\| CORS | Cross-origin request handling |

\| dotenv | Environment variables |

\| Nodemon | Development server |

---

# System Architecture
```text

                         ┌──────────────────────────┐

                         │        STUDENT           │

                         │  Browser / React Client   │

                         └────────────┬─────────────┘

                                      │

                                      │ HTTPS / REST API

                                      ▼

┌─────────────────────────────────────────────────────────────────┐

│                         FRONTEND                                │

│                                                                 │

│ React + Vite                                                    │

│ React Router                                                    │

│ Context API                                                     │

│ Axios Services                                                  │

│ Protected Routes                                                │

│ Tailwind CSS + Framer Motion                                    │

└────────────────────────────┬────────────────────────────────────┘

                             │

                             │ JSON / multipart/form-data

                             ▼

┌─────────────────────────────────────────────────────────────────┐

│                         BACKEND                                 │

│                                                                 │

│ Node.js + Express                                               │

│                                                                 │

│ Routes → Middleware → Controllers → Models                      │

│             │                       │                           │

│             │                       ▼                           │

│             │                    MongoDB                        │

│             │                                                    │

│             ├──────────────→ Cloudinary                         │

│             │                  Images                            │

│             │                                                    │

│             └──────────────→ Razorpay                           │

│                                Payments                          │

└───────────────┬─────────────────────────────────────────────────┘

                │

                ├──────────────► MongoDB Atlas

                │

                ├──────────────► Cloudinary

                │

                └──────────────► Razorpay

```

---

# Application Flow
## Student Flow
```text

Landing Page

     │

     ▼

Student Registration / Login

     │

     ▼

JWT Authentication

     │

     ▼

Student Dashboard

     │

     ├── Explore Hostels

     │       │

     │       ├── Search

     │       ├── Filters

     │       ├── Hostel Details

     │       ├── Rooms

     │       └── Reviews

     │

     ├── Favorites

     │

     ├── Nearby Hostels

     │

     ├── Create Booking

     │       │

     │       ▼

     │    Booking Created

     │       │

     │       ▼

     │    Payment

     │       │

     │       ▼

     │    Razorpay

     │       │

     │       ▼

     │    Backend Verification

     │       │

     │       ▼

     │    Booking Updated

     │

     ├── My Bookings

     ├── My Payments

     ├── Reviews

     ├── Complaints

     ├── Notifications

     └── Profile

```

## Admin Flow
```text

Admin Login

    │

    ▼

JWT + Admin Authorization

    │

    ▼

Admin Dashboard

    │

    ├── Students

    ├── Hostels

    │     ├── Create

    │     ├── Read

    │     ├── Update

    │     └── Delete

    │

    ├── Rooms

    ├── Bookings

    │     ├── Approve

    │     └── Reject

    │

    ├── Payments

    ├── Reviews

    ├── Complaints

    ├── Notifications

    ├── Analytics

    ├── Profile

    └── System Settings

```

---

# Request Lifecycle
A typical protected API request follows this architecture:

```text

React Component

      │

      ▼

Frontend Service

      │

      ▼

Axios

      │

      │ Authorization: Bearer <JWT>

      ▼

Express Route

      │

      ▼

Authentication Middleware

      │

      ├── Invalid token → 401

      │

      └── Valid token

              │

              ▼

       Authorization / Admin Middleware

              │

              ▼

          Controller

              │

              ▼

        Mongoose Model

              │

              ▼

          MongoDB

              │

              ▼

       JSON Response

              │

              ▼

       React Component

              │

              ▼

          UI Update

```

This separation keeps routing, authentication, business logic and database operations independent.

---

# Frontend Architecture
The frontend follows a component/service/context based structure.

```text

Frontend/src/

│

├── api/

│   ├── axios.js

│   └── authApi.js

│

├── components/

│   ├── admin/

│   ├── auth/

│   ├── booking/

│   ├── hostel/

│   ├── notifications/

│   └── student/

│

├── context/

│   └── AuthContext.jsx

│

├── layouts/

│   ├── AdminLayout.jsx

│   └── StudentLayout.jsx

│

├── pages/

│   ├── admin/

│   ├── booking/

│   ├── hostel/

│   ├── student/

│   └── user/

│

├── routes/

│   ├── AppRoutes.jsx

│   └── ProtectedRoute.jsx

│

├── services/

│   ├── authService.js

│   ├── hostelService.js

│   ├── bookingService.js

│   ├── paymentService.js

│   ├── roomService.js

│   ├── reviewService.js

│   ├── complaintService.js

│   ├── notificationService.js

│   └── admin\*.js

│

├── utils/

│   ├── auth.js

│   ├── axiosInstance.js

│   ├── apiError.js

│   └── loadRazorpay.js

│

├── App.jsx

├── main.jsx

└── index.css

```

### Frontend responsibilities
- Rendering UI

- Managing local UI state

- Managing authentication state

- Routing

- Calling APIs

- Handling loading/error states

- Displaying API data

- Sending forms/files

- Starting Razorpay checkout

- Responsive UI

The frontend does not directly access MongoDB.

---

# Backend Architecture
The backend follows a modular REST API architecture:

```text

Backend/

│

├── config/

│   ├── db.js

│   ├── authController.js

│   └── razorpay.js

│

├── controllers/

│   ├── authController.js

│   ├── hostelController.js

│   ├── bookingController.js

│   ├── paymentController.js

│   ├── roomController.js

│   ├── reviewController.js

│   ├── complaintController.js

│   ├── notificationController.js

│   ├── locationController.js

│   └── admin\*.js

│

├── middlewares/

│   ├── authMiddleware.js

│   ├── adminAuth.js

│   ├── userAuth.js

│   ├── roleMiddleware.js

│   ├── upload.js

│   └── multerConfig.js

│

├── models/

│   ├── User.js

│   ├── Admin.js

│   ├── Hostel.js

│   ├── Room.js

│   ├── Booking.js

│   ├── Payment.js

│   ├── Review.js

│   ├── Favorite.js

│   ├── Complaint.js

│   └── Notification.js

│

├── routes/

│   ├── authRoutes.js

│   ├── hostelRoutes.js

│   ├── bookingRoutes.js

│   ├── paymentRoutes.js

│   ├── roomRoutes.js

│   ├── reviewRoutes.js

│   ├── complaintRoutes.js

│   ├── notificationRoutes.js

│   ├── locationRoutes.js

│   └── admin\*.js

│

├── utils/

│   ├── cloudinary.js

│   ├── token.js

│   └── notificationService.js

│

├── scripts/

│   └── migrateHostels.js

│

└── index.js

```

### Backend responsibilities
- API routing

- Authentication

- Authorization

- Validation

- Business logic

- Database operations

- Payment verification

- Image upload configuration

- Notifications

- Error handling

---

# Database Design
StudNest uses MongoDB with Mongoose.

## Main Collections
```text

User

Admin

Hostel

Room

Booking

Payment

Review

Favorite

Complaint

Notification

```

## High-Level Relationships
```text

Admin

  │

  └──── owns ────► Hostel

                       │

                       └──── contains ────► Room

User

  │

  ├──── creates ────► Booking

  │                      │

  │                      ├──── Hostel

  │                      └──── Room

  │

  ├──── makes ──────► Payment

  │

  ├──── writes ─────► Review

  │

  ├──── saves ──────► Favorite ────► Hostel

  │

  ├──── creates ────► Complaint

  │

  └──── receives ───► Notification

```

### Important MongoDB references
`Booking` references:

- `User`

- `Hostel`

- `Room`

`Payment` references:

- `User`

- `Booking`

`Review` references:

- `User`

- `Hostel`

`Complaint` references:

- `User`

- `Booking`

- `Hostel`

- optionally `Room`

- optionally `Admin` as responder

`Hostel` references its owning `Admin`.

---

# Authentication and Authorization
StudNest uses JWT-based authentication.

## Login Flow
```text

User submits email/password

          │

          ▼

POST /api/auth/student/login

          │

          ▼

Backend finds user

          │

          ▼

Password verification using bcrypt

          │

          ▼

JWT generated

          │

          ▼

Token + user information returned

          │

          ▼

Frontend stores authentication state

```

The frontend authentication context keeps:

- Token

- User information

- Role

- Login function

- Logout function

- Authentication status

The Axios interceptor automatically attaches:

```text

Authorization: Bearer <token>

```

to API requests when a token is present.

## Role-based access
Student and admin operations are separated.

Examples:

```text

Student:

GET /api/bookings/my

Admin:

GET /api/bookings/admin

```

Admin routes use `adminAuth`.

Student/protected routes use `authMiddleware`.

---

# CRUD Architecture
StudNest implements CRUD across multiple resources.

## Hostel CRUD
### Create
```text

POST /api/admin/hostels

```

Admin submits hostel information and images.

### Read
```text

GET /api/hostels

GET /api/hostels/:id

GET /api/admin/hostels

GET /api/admin/hostels/:id

```

### Update
```text

PUT /api/admin/hostels/:id

```

### Delete
```text

DELETE /api/admin/hostels/:id

```

### Additional operation
```text

PATCH /api/admin/hostels/:id/seats

```

This updates room/seat availability counters.

The same CRUD pattern is used for other modules such as rooms, reviews, complaints and related admin resources.

---

# Image Upload and Cloudinary
StudNest does not store image binary data inside MongoDB.

The application uses:

- Multer

- `multer-storage-cloudinary`

- Cloudinary

## Upload Flow
```text

Admin selects images

        │

        ▼

React FormData

        │

        │ multipart/form-data

        ▼

POST /api/admin/hostels

        │

        ▼

Multer

        │

        ▼

Cloudinary Storage

        │

        ├── validates image

        ├── uploads file

        ├── optimizes image

        └── returns URL

                │

                ▼

         Controller receives

         Cloudinary file path

                │

                ▼

            MongoDB

                │

                └── stores image URL

```

The upload configuration:

- Accepts image MIME types.

- Supports JPG/JPEG/PNG/WebP.

- Limits file size to 5 MB.

- Uploads into the `studnest` Cloudinary folder.

- Applies Cloudinary transformations for size, quality and format optimization.

The `Hostel` model stores image URLs in an array:

```text

images: [url1, url2, url3, ...]

```

---

# Booking Flow
Booking is room-aware rather than only hostel-aware.

## Create Booking
```text

Student selects hostel

        │

        ▼

Selects room

        │

        ▼

Chooses duration/start date

        │

        ▼

POST /api/bookings

        │

        ▼

Authentication

        │

        ▼

Validate hostel + room

        │

        ▼

Check room status

        │

        ▼

Check available beds

        │

        ▼

Check active duplicate booking

        │

        ▼

Calculate amount

        │

        ▼

Create Booking

        │

        ▼

Create notifications

        │

        ▼

Return populated booking

```

Booking supports statuses such as:

```text

Pending

Approved

Rejected

Cancelled

Confirmed

CheckedIn

Active

Completed

```

Payment status is maintained separately:

```text

Pending

Paid

Failed

Refunded

```

This separation is useful because booking state and financial state are different business concepts.

---

# Payment Flow
Razorpay is integrated for booking payments.

## Payment Architecture
```text

Student

   │

   ▼

Booking Payment Page

   │

   ▼

Load Razorpay Checkout SDK

   │

   ▼

POST /api/payment/booking/order

   │

   ▼

Backend creates Razorpay Order

   │

   ▼

Razorpay Checkout

   │

   ▼

Student completes payment

   │

   ▼

Razorpay returns:

   ├── order_id

   ├── payment_id

   └── signature

   │

   ▼

POST /api/payment/booking/verify

   │

   ▼

Backend verifies signature

   │

   ▼

Payment record updated

   │

   ▼

Booking payment status updated

   │

   ▼

Booking confirmation/business state updated

```

The backend is responsible for payment verification.

A payment should not be considered trusted only because the browser reports success.

---

# Location and Nearby Hostel Flow
The application uses GeoJSON coordinates.

Coordinates are stored as:

```text

[longitude, latitude]

```

MongoDB `2dsphere` indexes are configured for location-based queries.

Both users and hostels contain GeoJSON location information.

## Nearby hostel flow
```text

Student location

      │

      ▼

GET /api/user/nearby-hostels

      │

      ▼

Backend reads user's coordinates

      │

      ▼

MongoDB geospatial query

      │

      ▼

Nearby hostels

      │

      ▼

JSON response

      │

      ▼

React UI

```

This provides a foundation for location-aware accommodation discovery.

---

# Reviews, Favorites, Complaints and Notifications
## Reviews
Students can:

- View hostel reviews

- Create reviews

- Update reviews

- Delete their reviews

A unique index on:

```text

(userId, hostelId)

```

prevents a user from creating multiple review records for the same hostel.

---

## Favorites
Students can:

- Add a hostel to favorites

- View favorites

- Remove a favorite

A compound unique index on:

```text

(userId, hostelId)

```

prevents duplicate favorites.

---

## Complaints
Students can create complaints related to their booking/hostel.

Complaint categories include:

- Room

- Food

- Cleanliness

- Maintenance

- Electricity

- Water

- Security

- Staff

- Payment

- Other

Complaint statuses include:

```text

Open

In Progress

Resolved

Rejected

```

Admins can view, update and delete complaints.

---

## Notifications
Notifications support both students and admins.

Notification types include:

```text

booking

payment

complaint

review

system

```

The application supports:

- List notifications

- Unread count

- Mark one as read

- Mark all as read

- Delete notification

Booking and payment operations also create application notifications.

---

# REST API Overview
## Authentication
\| Method | Endpoint | Purpose |

\|---|---|---|

\| POST | `/api/auth/student/register` | Student registration |

\| POST | `/api/auth/student/login` | Student login |

\| POST | `/api/auth/admin/register` | Admin registration |

\| POST | `/api/auth/admin/login` | Admin login |

\| POST | `/api/auth/check-email` | Check email existence |

## Hostels
\| Method | Endpoint | Purpose |

\|---|---|---|

\| GET | `/api/hostels` | Get hostels |

\| GET | `/api/hostels/:id` | Get hostel |

\| POST | `/api/hostels` | Create hostel through protected backend route |

\| POST | `/api/admin/hostels` | Admin create hostel with image upload |

\| GET | `/api/admin/hostels` | Admin hostel list |

\| GET | `/api/admin/hostels/:id` | Admin hostel details |

\| PUT | `/api/admin/hostels/:id` | Update hostel |

\| DELETE | `/api/admin/hostels/:id` | Delete hostel |

\| PATCH | `/api/admin/hostels/:id/seats` | Update room counters |

## Bookings
\| Method | Endpoint | Purpose |

\|---|---|---|

\| POST | `/api/bookings` | Create booking |

\| GET | `/api/bookings/my` | Get current user's bookings |

\| GET | `/api/bookings/my/:id` | Get current user's booking |

\| PATCH | `/api/bookings/my/:id/cancel` | Cancel booking |

\| GET | `/api/bookings/admin` | Admin booking list |

\| PATCH | `/api/bookings/admin/:id/approve` | Approve booking |

\| PATCH | `/api/bookings/admin/:id/reject` | Reject booking |

\| PUT | `/api/bookings/admin/:id` | Update booking status |

## Payments
\| Method | Endpoint | Purpose |

\|---|---|---|

\| POST | `/api/payment/booking/order` | Create booking payment order |

\| POST | `/api/payment/booking/verify` | Verify booking payment |

\| GET | `/api/payment/my` | Get current user's payments |

## Rooms
\| Method | Endpoint | Purpose |

\|---|---|---|

\| GET | `/api/rooms/hostel/\:hostelId` | Get hostel rooms |

\| GET | `/api/rooms/:id` | Get room |

\| POST | `/api/rooms/hostel/\:hostelId` | Create room |

\| PUT | `/api/rooms/:id` | Update room |

\| DELETE | `/api/rooms/:id` | Delete room |

\| PATCH | `/api/rooms/:id/availability` | Update availability |

## Reviews
\| Method | Endpoint | Purpose |

\|---|---|---|

\| GET | `/api/reviews/hostel/\:hostelId` | Get hostel reviews |

\| GET | `/api/reviews/my` | Get user's reviews |

\| POST | `/api/reviews` | Create review |

\| PATCH | `/api/reviews/:id` | Update review |

\| DELETE | `/api/reviews/:id` | Delete review |

## Complaints
\| Method | Endpoint | Purpose |

\|---|---|---|

\| POST | `/api/complaints` | Create complaint |

\| GET | `/api/complaints/my` | Get user's complaints |

\| GET | `/api/complaints/my/:id` | Get complaint |

\| DELETE | `/api/complaints/my/:id` | Delete complaint |

## Notifications
\| Method | Endpoint | Purpose |

\|---|---|---|

\| GET | `/api/notifications/my` | Get user notifications |

\| GET | `/api/notifications/unread-count` | Unread count |

\| PATCH | `/api/notifications/:id/read` | Mark notification read |

\| PATCH | `/api/notifications/read-all` | Mark all read |

\| DELETE | `/api/notifications/:id` | Delete notification |

## Location
\| Method | Endpoint | Purpose |

\|---|---|---|

\| GET | `/api/user/location` | Get saved location |

\| PUT | `/api/user/location` | Save location |

\| GET | `/api/user/nearby-hostels` | Find nearby hostels |

---

# Project Structure
## Repository
The project is separated into two applications:

```text

StudNest/

│

├── Frontend/

│

└── Backend/

```

## Frontend
```text

Frontend/

├── public/

├── src/

│   ├── api/

│   ├── assets/

│   ├── components/

│   │   ├── admin/

│   │   ├── auth/

│   │   ├── booking/

│   │   ├── hostel/

│   │   ├── notifications/

│   │   └── student/

│   ├── context/

│   ├── layouts/

│   ├── pages/

│   │   ├── admin/

│   │   ├── booking/

│   │   ├── hostel/

│   │   ├── student/

│   │   └── user/

│   ├── routes/

│   ├── services/

│   ├── styles/

│   ├── utils/

│   ├── App.jsx

│   ├── App.css

│   ├── index.css

│   └── main.jsx

├── package.json

├── vite.config.js

├── tailwind.config.js

└── eslint.config.js

```

## Backend
```text

Backend/

├── config/

├── controllers/

├── middlewares/

├── models/

├── routes/

├── scripts/

├── uploads/

├── utils/

├── index.js

└── package.json

```

---

# Environment Variables
Do not commit real credentials or secrets to GitHub.

The uploaded project contains environment files, so before publishing the repository, rotate any exposed credentials and keep `.env` files out of version control.

Typical backend variables used by the project include:

```env

PORT=5000

NODE_ENV=development

MONGO_URI=<mongodb-connection-string>

JWT_SECRET=<jwt-secret>

CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>

CLOUDINARY_API_KEY=<cloudinary-api-key>

CLOUDINARY_API_SECRET=<cloudinary-api-secret>

RAZORPAY_KEY_ID=<razorpay-key-id>

RAZORPAY_SECRET=<razorpay-secret>

CLIENT_ORIGIN=<frontend-origin>

```

Frontend configuration uses:

```env

VITE_API_BASE_URL=https://studnest-backend.onrender.com/api

VITE_RAZORPAY_KEY_ID=<razorpay-public-key>

```

Never expose:

- MongoDB credentials

- JWT secret

- Cloudinary API secret

- Razorpay secret

in frontend code or public repositories.

---

# Installation and Local Setup
## Prerequisites
Install:

- Node.js 18+

- npm

- MongoDB Atlas account or MongoDB server

- Cloudinary account

- Razorpay account for payment functionality

---

## Clone the project
```bash

git clone <your-repository-url>

cd StudNest

```

---

## Backend setup
```bash

cd Backend

npm install

```

Create `.env` and configure the required backend variables.

Start development server:

```bash

npm run dev

```

Production-style start:

```bash

npm start

```

The backend defaults to:

```text

http\://localhost:5000

```

Health check:

```text

GET /healthz

```

---

## Frontend setup
Open another terminal:

```bash

cd Frontend

npm install

```

Create the frontend environment file:

```env

VITE_API_BASE_URL=http\://localhost:5000/api

VITE_RAZORPAY_KEY_ID=<your-public-razorpay-key>

```

Run:

```bash

npm run dev

```

Vite normally starts the frontend on:

```text

http\://localhost:5173

```

Build production assets:

```bash

npm run build

```

Preview production build:

```bash

npm run preview

```

---

# Deployment Architecture
The application is deployed as separate frontend and backend services:

```text

                     INTERNET

                         │

                         ▼

               ┌─────────────────┐

               │ Vercel / Static │

               │    Frontend     │

               └────────┬────────┘

                        │

                        │ HTTPS REST API

                        ▼

               ┌─────────────────┐

               │ Render / Node   │

               │    Backend      │

               └───────┬─────────┘

                       │

           ┌───────────┼────────────┐

           ▼           ▼            ▼

      MongoDB      Cloudinary    Razorpay

       Atlas         Images       Payments

```

The backend is configured to support trusted proxy deployment and CORS for configured frontend origins.

---

# Security Considerations
The application includes several security-related practices:

### Authentication
- JWT-based authentication

- Protected API routes

- Separate admin authentication

- Authorization headers

### Password Security
Passwords are handled using `bcryptjs`.

Password fields are configured with:

```text

select: false

```

where appropriate so they are not returned by default from normal queries.

### Authorization
Admin-only operations are protected using `adminAuth`.

### Secrets
Sensitive configuration is loaded using environment variables.

### File Upload Security
Uploads are restricted to images and have a maximum file size of 5 MB.

### Payment Security
Razorpay payment signatures are verified on the backend using the Razorpay secret and HMAC-SHA256.

### Database Validation
Mongoose schemas use:

- Required fields

- Enums

- Minimum/maximum values

- String length constraints

- Unique indexes

- Database indexes

---

# Error Handling
The Express application contains:

- Route-level validation

- Controller-level error handling

- Authentication errors

- Authorization errors

- MongoDB validation handling

- Global Express error handler

- 404 route handling

Typical response codes:

```text

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

500 Internal Server Error

```

The frontend also centralizes API error extraction through utility functions and displays user-friendly messages.

---

# Database Indexing and Performance
StudNest uses indexes for frequently queried fields.

Examples include:

```text

User.email

User.role

User.location → 2dsphere

Hostel.city

Hostel.status

Hostel.monthlyRent

Hostel.location → 2dsphere

Booking.userId

Booking.hostelId

Booking.roomId

Booking.status

Booking.paymentStatus

Room.hostelId

Room.status

Payment.userId

Payment.bookingId

Payment.status

Payment.razorpayOrderId

Payment.razorpayPaymentId

```

Compound/unique indexes are also used where appropriate.

Examples:

```text

Favorite(userId, hostelId) → unique

Review(userId, hostelId) → unique

Room(hostelId, roomNumber) → unique

```

These indexes help with:

- Faster lookups

- Duplicate prevention

- Geospatial queries

- Filtering

- Booking queries

- Notification queries

---

# Important Design Decisions
## Why MongoDB?
MongoDB works well with the application's document-oriented data model and allows flexible schema evolution while Mongoose provides validation and structured models.

## Why React?
React provides reusable components, client-side routing and efficient UI updates.

## Why Express?
Express provides a lightweight and modular framework for REST API development.

## Why JWT?
JWT allows the backend to verify authenticated API requests without storing traditional server-side session state for every request.

## Why Cloudinary?
Images are media assets, so they are better handled by dedicated media storage. MongoDB stores the resulting URLs rather than large image binaries.

## Why Razorpay?
Razorpay provides an Indian payment gateway and checkout flow suitable for INR transactions.

## Why service files in React?
API calls are separated from UI components:

```text

Component

   ↓

Service

   ↓

Axios

   ↓

Backend API

```

This makes API logic easier to reuse and maintain.

---

# Interview Discussion Points
StudNest can be used to discuss a wide range of full-stack interview topics.

### Architecture
- Explain the complete project architecture.

- Explain frontend-backend communication.

- Explain request lifecycle.

- Why separate routes/controllers/models?

- Why use service modules?

- Explain MVC-style separation.

### React
- Why React?

- What are components?

- Props vs state?

- `useState` vs `useEffect`?

- Why Context API?

- How does protected routing work?

- How does Axios communicate with Express?

### Node/Express
- What is Node.js?

- What is Express?

- What is middleware?

- How are routes handled?

- How are errors handled?

- How does CORS work?

- Why use environment variables?

### MongoDB
- Why MongoDB?

- What is Mongoose?

- What is a schema/model?

- How do references work?

- What is `populate()`?

- Why use indexes?

- What is a 2dsphere index?

- How do you prevent duplicate records?

### Authentication
- Explain JWT.

- Authentication vs authorization.

- How does admin authorization work?

- Where is the token attached?

- How does backend verify a token?

- Why hash passwords?

### CRUD
- Explain hostel CRUD.

- Explain room CRUD.

- How do you update a hostel?

- How do you delete a hostel securely?

- How do you ensure an admin modifies only their own hostel?

### Cloudinary
- Why not store images in MongoDB?

- How does Multer work?

- How does Multer connect to Cloudinary?

- What does MongoDB store after image upload?

- How do you validate image uploads?

### Payments
- Explain Razorpay integration.

- Why create payment orders on the backend?

- Why verify payment on the backend?

- What is a Razorpay signature?

- What happens if payment succeeds but frontend closes?

### Booking
- How do you prevent duplicate active bookings?

- How do you calculate booking amount?

- How do you manage room availability?

- Why separate booking status and payment status?

- How do admin approval and student cancellation work?

### Advanced Topics
- How does nearby hostel search work?

- How would you scale the application?

- How would you add caching?

- How would you improve API performance?

- How would you handle concurrent bookings?

- How would you improve payment reliability?

- How would you add automated tests?

- How would you implement CI/CD?

---

# Future Enhancements
Possible future improvements include:

- Real-time chat between students and accommodation providers

- Real-time booking/notification updates using WebSockets

- Advanced recommendation system

- Hostel comparison

- Better availability locking for concurrent bookings

- Payment webhooks for stronger payment reconciliation

- Automated email/SMS notifications

- Automated test suite

- Rate limiting

- API documentation with Swagger/OpenAPI

- Centralized structured logging

- Redis caching

- Image deletion synchronization with Cloudinary

- Advanced search using MongoDB Atlas Search

- Pagination and cursor-based pagination across more admin modules

- Docker-based development/deployment

- CI/CD pipeline

- Monitoring and observability

---

# What This Project Demonstrates
StudNest 2.0 demonstrates practical knowledge of:

```text

Frontend Development

        +

REST API Development

        +

Authentication

        +

Authorization

        +

CRUD

        +

Database Design

        +

MongoDB Indexing

        +

File Upload

        +

Cloudinary

        +

Payment Integration

        +

Booking Management

        +

Location-based Queries

        +

Role-based Admin Panel

        +

Error Handling

        +

Deployment

```

The project is therefore suitable as a portfolio and placement project for **\*\*MERN/full-stack developer roles\*\***, provided the developer can explain and defend the implementation details.

---

# Project Links
- **Live Application:** https://frontend-vercel-tau-one.vercel.app/
- **Backend API:** https://studnest-backend.onrender.com/
- **Source Code:** https://github.com/Hemant-kumar24/Studnest

---

# Author
**\*\*Hemant Kumar\*\***

B.Tech Computer Science Engineering

Skills demonstrated through this project:

- JavaScript

- React.js

- Node.js

- Express.js

- MongoDB

- Mongoose

- REST APIs

- JWT

- Cloudinary

- Razorpay

- Tailwind CSS

- Git/GitHub

- Full-Stack Development

---

## Note
This README documents the architecture and functionality identified from the current Frontend and Backend codebase. API behavior, environment configuration and deployment values should be kept synchronized with the production configuration as the project evolves.
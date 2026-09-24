# StudNest Backend

A Node.js/Express backend for the StudNest hostel booking platform.

## Features

- User and Admin authentication
- Hostel management
- Booking system
- Payment integration with Razorpay
- Image upload with Cloudinary
- MongoDB database

## Environment Variables

Required environment variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_ORIGIN=your_frontend_url
PORT=5000
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with required environment variables

3. Start development server:
```bash
npm run dev
```

## Production Deployment

This backend is configured for deployment on Render.com with:
- Node.js 18+ runtime
- Automatic builds from Git
- Environment variable configuration
- Health check endpoints

## API Endpoints

- `/` - Health check
- `/healthz` - Health check endpoint
- `/api/auth` - Authentication routes
- `/api/hostels` - Hostel management
- `/api/bookings` - Booking management
- `/api/admin` - Admin routes
- `/api/user` - User routes
- `/api/payment` - Payment processing

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
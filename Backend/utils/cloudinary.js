// backend/utils/cloudinary.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Cloudinary connection
console.log('☁️ Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'NOT SET',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'NOT SET'
});

// Multer Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'studnest', // Folder name in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' }, // Optimize image size
      { quality: 'auto' }, // Auto quality optimization
      { fetch_format: 'auto' } // Auto format optimization
    ]
  },
});

// Test storage configuration
console.log('📁 Cloudinary Storage configured for folder: studnest');

// Helper function to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  // Extract public_id from Cloudinary URL
  // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/studnest/sample.jpg
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  
  if (uploadIndex === -1) return null;
  
  // Get everything after 'upload/v{version}/' or 'upload/'
  let publicIdParts = parts.slice(uploadIndex + 1);
  
  // Remove version if present (starts with 'v' followed by numbers)
  if (publicIdParts[0] && publicIdParts[0].match(/^v\d+$/)) {
    publicIdParts = publicIdParts.slice(1);
  }
  
  // Join the remaining parts and remove file extension
  const publicIdWithExt = publicIdParts.join('/');
  const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
  
  return publicId;
};

module.exports = {
  cloudinary,
  storage,
  getPublicIdFromUrl,
};

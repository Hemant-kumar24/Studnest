// Test environment variables
require('dotenv').config();

console.log('🔍 Environment Variables Check:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET length:', process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.length : 'NOT SET');
console.log('CLOUDINARY_API_SECRET first 4 chars:', process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.substring(0, 4) + '...' : 'NOT SET');

// Check if all required variables are set
const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.log('❌ Missing environment variables:', missing);
} else {
  console.log('✅ All Cloudinary environment variables are set');
}
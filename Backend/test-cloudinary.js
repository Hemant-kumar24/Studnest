// Test Cloudinary connection
require('dotenv').config();
const { cloudinary } = require('./utils/cloudinary');

async function testCloudinary() {
  try {
    console.log('🧪 Testing Cloudinary connection...');
    
    // Test API connection
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary ping successful:', result);
    
    // Test upload with a simple text file (base64)
    const testUpload = await cloudinary.uploader.upload(
      'data:text/plain;base64,SGVsbG8gV29ybGQ=', // "Hello World" in base64
      {
        folder: 'studnest',
        resource_type: 'raw',
        public_id: 'test-connection'
      }
    );
    
    console.log('✅ Test upload successful:', {
      public_id: testUpload.public_id,
      secure_url: testUpload.secure_url
    });
    
    // Clean up test file
    await cloudinary.uploader.destroy('studnest/test-connection', { resource_type: 'raw' });
    console.log('✅ Test file cleaned up');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:');
    console.error('Error message:', error.message);
    console.error('Error details:', error);
  }
}

testCloudinary();
const multer = require('multer');
const { storage } = require('../utils/cloudinary');

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    console.log('📁 File filter - File info:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      console.log('✅ File accepted');
      cb(null, true);
    } else {
      console.log('❌ File rejected - not an image');
      cb(new Error('Only images are allowed (jpg, jpeg, png, webp)'));
    }
  },
});

module.exports = upload;

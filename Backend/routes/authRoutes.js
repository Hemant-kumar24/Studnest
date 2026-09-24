const express = require('express');
const router = express.Router();

const {
  registerStudent,
  loginStudent,
  registerAdmin,
  loginAdmin,
  checkEmailExistence,
} = require('../controllers/authController');

router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);

router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

router.post('/check-email', checkEmailExistence);

module.exports = router;

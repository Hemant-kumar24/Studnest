const express = require('express');
const router = express.Router();

const hostelController = require('../controllers/hostelController');
const adminAuth = require('../middlewares/adminAuth');

router.get('/', hostelController.getHostels);
router.get('/:id', hostelController.getHostelById);

// No subscription check here.
router.post('/', adminAuth, hostelController.createHostel);

module.exports = router;

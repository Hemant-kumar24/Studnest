const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Admin = require('../models/Admin');
const authMiddleware = require('../middlewares/authMiddleware');
require('dotenv').config();

const router = express.Router();

// Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create order
router.post('/create-order', authMiddleware, async (req, res) => {
  const options = {
    amount: 499900, // ₹4999 in paise
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// Verify payment and activate subscription
router.post('/verify', authMiddleware, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(sign)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Invalid signature. Verification failed.' });
  }

  try {
    const adminId = req.user.id;

    await Admin.findByIdAndUpdate(adminId, {
      isSubscribed: true,
      subscriptionDate: new Date(),
    });

    res.status(200).json({ success: true, message: 'Payment verified and subscription activated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update subscription.' });
  }
});

module.exports = router;

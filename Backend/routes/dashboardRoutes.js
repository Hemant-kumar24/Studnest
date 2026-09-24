const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/user/data', authMiddleware, (req, res) => {
  res.json({ msg: `Welcome User ${req.user.id}` });
});

router.get('/admin/data', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admins only' });
  }
  res.json({ msg: `Welcome Admin ${req.user.id}` });
});

module.exports = router;

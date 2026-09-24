const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = header.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id || !['student', 'admin'].includes(decoded.role)) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    let account;

    if (decoded.role === 'admin') {
      account = await Admin.findById(decoded.id);
    } else {
      account = await User.findById(decoded.id);
    }

    if (!account) {
      return res.status(401).json({ message: 'Account not found' });
    }

    if (account.isActive === false) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    req.user = {
      id: account._id,
      role: decoded.role,
      account,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    return res.status(401).json({ message: 'Invalid authentication token' });
  }
};

module.exports = authMiddleware;

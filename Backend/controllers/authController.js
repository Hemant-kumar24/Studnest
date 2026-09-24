const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Admin = require('../models/Admin');

const createToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const sanitizeAccount = (account) => {
  const data = account.toObject();
  delete data.password;
  return data;
};

const validateCredentials = (email, password) => {
  if (!email || !password) {
    return 'Email and password are required';
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return 'Enter a valid email';
  }

  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return null;
};

// ---------------- STUDENT ----------------

exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone = '' } = req.body;

    const validationError = validateCredentials(email, password);
    if (validationError || !name?.trim()) {
      return res.status(400).json({
        message: validationError || 'Name is required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const student = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: String(phone).trim(),
      role: 'student',
    });

    const token = createToken(student._id, 'student');

    return res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: sanitizeAccount(student),
    });
  } catch (error) {
    console.error('registerStudent error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validationError = validateCredentials(email, password);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const student = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password');

    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (student.isActive === false) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const token = createToken(student._id, 'student');

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: sanitizeAccount(student),
    });
  } catch (error) {
    console.error('loginStudent error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};

// ---------------- ADMIN ----------------

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone = '', address = '', city = '' } = req.body;

    const validationError = validateCredentials(email, password);
    if (validationError || !name?.trim()) {
      return res.status(400).json({
        message: validationError || 'Name is required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Admin email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: String(phone).trim(),
      address: String(address).trim(),
      city: String(city).trim(),
      role: 'admin',
    });

    const token = createToken(admin._id, 'admin');

    return res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: sanitizeAccount(admin),
    });
  } catch (error) {
    console.error('registerAdmin error:', error);
    return res.status(500).json({ message: 'Admin registration failed' });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validationError = validateCredentials(email, password);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password');

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (admin.isActive === false) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const token = createToken(admin._id, 'admin');

    return res.status(200).json({
      message: 'Admin login successful',
      token,
      admin: sanitizeAccount(admin),
    });
  } catch (error) {
    console.error('loginAdmin error:', error);
    return res.status(500).json({ message: 'Admin login failed' });
  }
};

// ---------------- EMAIL CHECK ----------------

exports.checkEmailExistence = async (req, res) => {
  try {
    const { email, role = 'student' } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let exists = false;

    if (role === 'admin') {
      exists = !!(await Admin.exists({ email: normalizedEmail }));
    } else if (role === 'student' || role === 'user') {
      exists = !!(await User.exists({ email: normalizedEmail }));
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    return res.status(200).json({ exists });
  } catch (error) {
    console.error('checkEmailExistence error:', error);
    return res.status(500).json({ message: 'Email check failed' });
  }
};

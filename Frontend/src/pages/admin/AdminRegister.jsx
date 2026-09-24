import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../axios';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import backgroundImage from '/hostel_background_image.jpeg';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [emailChecked, setEmailChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset email check if user changes email again
    if (name === 'email') {
      setEmailChecked(false);
    }
  };

  const checkEmailExists = async () => {
    if (!formData.email || emailChecked) return;

    try {
      const res = await API.post('/auth/check-email', {
        email: formData.email,
        role: 'admin'
      });

      if (res.data.exists) {
        toast.error('Email already registered');
        setFormData((prev) => ({ ...prev, email: '' }));
      } else {
        setEmailChecked(true);
      }
    } catch (error) {
      toast.error('Error checking email');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (!validatePassword(password)) {
      toast.error('Password must be at least 6 characters and include letters & numbers');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    await checkEmailExists();
    if (!formData.email) return;

    try {
      const res = await API.post('/auth/admin/register', {
        name,
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'admin');
      toast.success('Admin registered successfully!');
      setTimeout(() => navigate('/admindashboard'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/30 shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-lg"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 drop-shadow-xl">
          🔐 Admin Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="👤 Full Name"
            onChange={handleChange}
            required
            className="w-full px-5 py-3 text-lg rounded-xl bg-white/70 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-500 shadow-inner focus:outline-none focus:ring-4 focus:ring-pink-400"
          />

          <input
            type="email"
            name="email"
            placeholder="📧 Email Address"
            value={formData.email}
            onChange={handleChange}
            onBlur={checkEmailExists}
            required
            className="w-full px-5 py-3 text-lg rounded-xl bg-white/70 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-500 shadow-inner focus:outline-none focus:ring-4 focus:ring-purple-400"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="🔒 Password"
              onChange={handleChange}
              required
              className="w-full px-5 py-3 text-lg rounded-xl bg-white/70 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-500 shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-400"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <input
            type="password"
            name="confirmPassword"
            placeholder="🔒 Confirm Password"
            onChange={handleChange}
            required
            className="w-full px-5 py-3 text-lg rounded-xl bg-white/70 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-500 shadow-inner focus:outline-none focus:ring-4 focus:ring-pink-300"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white font-semibold text-lg hover:brightness-110 transition-all duration-300 shadow-xl hover:scale-[1.02]"
          >
            Register as Admin
          </button>

          <p className="text-sm text-white text-center pt-4 drop-shadow-md">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/admin/login')}
              className="underline cursor-pointer hover:text-indigo-200 transition"
            >
              Login here
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminRegister;

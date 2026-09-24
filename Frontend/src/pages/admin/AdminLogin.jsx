import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import API from '../../axios';
import ButtonLoader from '../../components/ButtonLoader';
import { useAuth } from '../../context/AuthContext';
import loginBg from '/hostel_background_image.jpeg'; // Adjust path if needed

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/admin/login', formData);
      const user = res.data.user || res.data.data?.user || { email: formData.email, role: 'admin' };
      login({ token: res.data.token || res.data.data?.token, user: { ...user, role: 'admin' } });
      toast.success('Admin login successful!', { duration: 1500 });
      setTimeout(() => navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true }), 1800);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed', {
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center px-4"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <Toaster position="top-center" />
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md p-10 rounded-3xl backdrop-blur-2xl bg-white/20 border border-white/30 shadow-2xl text-white"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center mb-8 drop-shadow"
        >
          🛡️ Admin Login
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="email"
              name="email"
              placeholder="📧 Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl text-lg bg-white/80 text-gray-800 placeholder-gray-600 shadow-inner focus:outline-none focus:ring-4 focus:ring-purple-400"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="🔒 Admin Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl text-lg bg-white/80 text-gray-800 placeholder-gray-600 shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-400"
            />
            <span
              className="absolute right-4 top-3 text-gray-700 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-600 to-red-500 text-white font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <ButtonLoader size="small" color="white" />
                Logging in...
              </>
            ) : (
              '🛡️ Admin Login'
            )}
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-white text-center pt-4 drop-shadow"
          >
            Don't have an admin account?{' '}
            <span
              onClick={() => navigate('/admin/register')}
              className="underline cursor-pointer hover:text-pink-200 transition"
            >
              Register here
            </span>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

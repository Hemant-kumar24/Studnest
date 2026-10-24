import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../api/axios";
import ButtonLoader from "../../components/ButtonLoader";
import { useAuth } from "../../context/AuthContext";
import loginBg from "/hostel_background_image.jpeg";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/student/login", formData);

      const token = res.data?.token || res.data?.data?.token;
      const user = res.data?.user || res.data?.data?.user;

      if (!token) {
        throw new Error("Authentication token not received");
      }

      login({
        token,
        user: {
          ...(user || {}),
          role: "student",
        },
      });

      toast.success("Login successful!", {
        duration: 1500,
      });

      window.setTimeout(() => {
        navigate(location.state?.from?.pathname || "/student/dashboard", {
          replace: true,
        });
      }, 1200);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Login failed",
        { duration: 2000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-4 py-10 transition-colors duration-300"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/55 transition-colors duration-300 dark:bg-slate-950/70"
      />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "12px",
          },
        }}
      />

      <motion.div
        initial={{ y: 36, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/30 bg-white/90 p-7 text-slate-900 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl transition-colors duration-300 dark:border-white/15 dark:bg-slate-900/85 dark:text-white sm:p-10"
      >
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl dark:bg-indigo-500/20">
            🔐
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Student Login
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Welcome back to StudNest
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.32 }}
            className="relative"
          >
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-3 text-base font-bold text-white shadow-lg shadow-indigo-950/20 transition-all duration-300 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 focus:outline-none focus:ring-4 focus:ring-indigo-300/60 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-indigo-500/40"
          >
            {loading ? (
              <>
                <ButtonLoader size="small" color="white" />
                Logging in...
              </>
            ) : (
              "🚀 Login Now"
            )}
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400"
          >
            Don't have an account?{" "}
            <Link
              to="/user/register"
              className="font-semibold text-indigo-600 underline-offset-4 transition hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Register here
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default UserLogin;

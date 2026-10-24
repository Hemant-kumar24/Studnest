import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FaEye,
  FaEyeSlash,
  FaMoon,
  FaSun,
  FaShieldAlt,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";

import API from "../../axios";
import ButtonLoader from "../../components/ButtonLoader";
import { useAuth } from "../../context/AuthContext";
import loginBg from "/hostel_background_image.jpeg";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new CustomEvent("studnest-theme-changed", { detail: theme }));
  }, [theme, isDark]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  const handleChange = (e) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/admin/login", formData);
      const token = res.data.token || res.data.data?.token;
      const user =
        res.data.user ||
        res.data.data?.user ||
        { email: formData.email, role: "admin" };

      login({
        token,
        user: { ...user, role: "admin" },
      });

      toast.success("Admin login successful!", { duration: 1500 });
      window.setTimeout(() => {
        navigate(location.state?.from?.pathname || "/admin/dashboard", {
          replace: true,
        });
      }, 1800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 transition-colors duration-500 sm:px-6 ${
        isDark ? "bg-slate-950" : "bg-slate-100"
      }`}
    >
      {/* Background image and overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark
            ? "bg-slate-950/80"
            : "bg-slate-900/45"
        }`}
      />
      <div
        aria-hidden="true"
        className={`absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl ${
          isDark ? "bg-indigo-700/30" : "bg-indigo-400/30"
        }`}
      />
      <div
        aria-hidden="true"
        className={`absolute -bottom-28 -right-20 h-80 w-80 rounded-full blur-3xl ${
          isDark ? "bg-fuchsia-700/20" : "bg-sky-300/30"
        }`}
      />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: isDark ? "#0f172a" : "#ffffff",
            color: isDark ? "#f8fafc" : "#0f172a",
            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
          },
        }}
      />

      {/* Theme toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
        className={`absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-lg backdrop-blur-xl transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          isDark
            ? "border-white/15 bg-slate-900/80 text-amber-300 hover:bg-slate-800 focus:ring-offset-slate-950"
            : "border-white/60 bg-white/85 text-slate-700 hover:bg-white focus:ring-offset-slate-100"
        }`}
      >
        {isDark ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
        {isDark ? "Light mode" : "Dark mode"}
      </button>

      <motion.section
        initial={{ y: 28, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className={`relative z-10 w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-2xl transition-colors duration-500 ${
          isDark
            ? "border-white/10 bg-slate-950/75 text-slate-100 shadow-black/40"
            : "border-white/50 bg-white/85 text-slate-800 shadow-slate-900/20"
        }`}
      >
        {/* Accent strip */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

        <div className="p-6 sm:p-9">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mb-8 text-center"
          >
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${
                isDark
                  ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/20"
                  : "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100"
              }`}
            >
              <FaShieldAlt className="text-2xl" aria-hidden="true" />
            </div>

            <p className={`text-xs font-bold uppercase tracking-[0.22em] ${
              isDark ? "text-indigo-300" : "text-indigo-600"
            }`}>
              StudNest • Secure Access
            </p>
            <h1 className={`mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Admin Login
            </h1>
            <p className={`mt-2 text-sm leading-6 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              Sign in to manage properties and support students.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label
                htmlFor="admin-email"
                className={`mb-2 block text-sm font-semibold ${
                  isDark ? "text-slate-200" : "text-slate-700"
                }`}
              >
                Admin email
              </label>
              <div className="relative">
                <FaEnvelope
                  className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                  aria-hidden="true"
                />
                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                    isDark
                      ? "border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-indigo-500/15"
                      : "border-slate-200 bg-white/90 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/10"
                  }`}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28 }}
            >
              <label
                htmlFor="admin-password"
                className={`mb-2 block text-sm font-semibold ${
                  isDark ? "text-slate-200" : "text-slate-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <FaLock
                  className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                  aria-hidden="true"
                />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`h-12 w-full rounded-xl border pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                    isDark
                      ? "border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-indigo-500/15"
                      : "border-slate-200 bg-white/90 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={`absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.015 }}
              whileTap={{ scale: loading ? 1 : 0.985 }}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/20 transition hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <ButtonLoader size="small" color="white" />
                  Signing in...
                </>
              ) : (
                <>
                  <FaShieldAlt aria-hidden="true" />
                  Sign in to Admin Panel
                </>
              )}
            </motion.button>

            <p className={`pt-1 text-center text-sm ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              Don't have an admin account?{" "}
              <button
                type="button"
                onClick={() => navigate("/admin/register")}
                className={`font-semibold underline underline-offset-4 transition ${
                  isDark
                    ? "text-indigo-300 hover:text-indigo-200"
                    : "text-indigo-600 hover:text-indigo-700"
                }`}
              >
                Register here
              </button>
            </p>
          </form>
        </div>
      </motion.section>

      <p className={`absolute bottom-4 left-4 right-4 z-10 text-center text-xs ${
        isDark ? "text-slate-400" : "text-white drop-shadow"
      }`}>
        © {new Date().getFullYear()} StudNest. Secure administrator access.
      </p>
    </main>
  );
};

export default AdminLogin;

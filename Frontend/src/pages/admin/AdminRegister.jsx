import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FaEye,
  FaEyeSlash,
  FaMoon,
  FaSun,
  FaShieldAlt,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import API from "../../axios";
import ButtonLoader from "../../components/ButtonLoader";
import backgroundImage from "/hostel_background_image.jpeg";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [emailCheckedFor, setEmailCheckedFor] = useState("");
  const [theme, setTheme] = useState(getInitialTheme);
  const navigate = useNavigate();
  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
    window.dispatchEvent(
      new CustomEvent("studnest-theme-changed", { detail: theme })
    );
  }, [theme, isDark]);

  const toggleTheme = () =>
    setTheme((current) => (current === "dark" ? "light" : "dark"));

  const validatePassword = (value) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (name === "email") setEmailCheckedFor("");
  };

  const checkEmailExists = async (emailValue) => {
    const email = emailValue.trim().toLowerCase();
    if (!email) {
      toast.error("Please enter your email address.");
      return false;
    }

    if (emailCheckedFor === email) return true;

    try {
      setCheckingEmail(true);
      const response = await API.post("/auth/check-email", {
        email,
        role: "admin",
      });

      if (response?.data?.exists) {
        setEmailCheckedFor("");
        toast.error("This email is already registered.");
        return false;
      }

      setEmailCheckedFor(email);
      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to verify this email right now."
      );
      return false;
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleEmailBlur = async () => {
    const email = formData.email.trim().toLowerCase();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      await checkEmailExists(email);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (registering || checkingEmail) return;

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please complete all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters and include letters and numbers.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const emailIsAvailable = await checkEmailExists(email);
    if (!emailIsAvailable) return;

    try {
      setRegistering(true);
      const response = await API.post("/auth/admin/register", {
        name,
        email,
        password,
      });

      const token = response?.data?.token || response?.data?.data?.token;
      if (token) localStorage.setItem("token", token);
      localStorage.setItem("role", "admin");

      toast.success("Admin account created successfully!");
      window.setTimeout(() => navigate("/admin/dashboard", { replace: true }), 1200);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Admin registration failed."
      );
    } finally {
      setRegistering(false);
    }
  };

  const inputClass = `h-12 w-full rounded-xl border text-sm outline-none transition focus:ring-4 ${
    isDark
      ? "border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-indigo-500/15"
      : "border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/10"
  }`;

  return (
    <main
      className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 transition-colors duration-500 sm:px-6 ${
        isDark ? "bg-slate-950" : "bg-slate-100"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark ? "bg-slate-950/80" : "bg-slate-900/45"
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
          duration: 2200,
          style: {
            background: isDark ? "#0f172a" : "#ffffff",
            color: isDark ? "#f8fafc" : "#0f172a",
            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
          },
        }}
      />

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
        className={`absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-lg backdrop-blur-xl transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
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
        className={`relative z-10 my-8 w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-2xl transition-colors duration-500 ${
          isDark
            ? "border-white/10 bg-slate-950/80 text-slate-100 shadow-black/40"
            : "border-white/50 bg-white/90 text-slate-800 shadow-slate-900/20"
        }`}
      >
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
        <div className="p-6 sm:p-9">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mb-7 text-center"
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
            <p
              className={`text-xs font-bold uppercase tracking-[0.22em] ${
                isDark ? "text-indigo-300" : "text-indigo-600"
              }`}
            >
              StudNest • Secure Access
            </p>
            <h1
              className={`mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Create Admin Account
            </h1>
            <p className={`mt-2 text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Set up your administrator account to manage StudNest.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Full name" htmlFor="admin-name" isDark={isDark}>
              <div className="relative">
                <FaUser className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input
                  id="admin-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`${inputClass} pl-11 pr-4`}
                />
              </div>
            </FormField>

            <FormField label="Admin email" htmlFor="admin-email" isDark={isDark}>
              <div className="relative">
                <FaEnvelope className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  required
                  className={`${inputClass} pl-11 pr-4`}
                />
              </div>
              {checkingEmail && (
                <p className={`mt-1.5 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Checking email availability...
                </p>
              )}
              {emailCheckedFor === formData.email.trim().toLowerCase() && formData.email && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <FaCheckCircle /> Email is available
                </p>
              )}
            </FormField>

            <FormField label="Password" htmlFor="admin-password" isDark={isDark}>
              <PasswordField
                id="admin-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                visible={showPassword}
                onToggle={() => setShowPassword((current) => !current)}
                placeholder="At least 6 characters, letters and numbers"
                inputClass={inputClass}
                isDark={isDark}
              />
              <p className={`mt-1.5 text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                Use at least 6 characters, including letters and numbers.
              </p>
            </FormField>

            <FormField label="Confirm password" htmlFor="admin-confirm-password" isDark={isDark}>
              <PasswordField
                id="admin-confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((current) => !current)}
                placeholder="Re-enter your password"
                inputClass={inputClass}
                isDark={isDark}
              />
              {formData.confirmPassword && (
                <p className={`mt-1.5 text-xs ${
                  formData.password === formData.confirmPassword
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {formData.password === formData.confirmPassword
                    ? "Passwords match"
                    : "Passwords do not match"}
                </p>
              )}
            </FormField>

            <motion.button
              type="submit"
              disabled={registering || checkingEmail}
              whileHover={{ scale: registering ? 1 : 1.01 }}
              whileTap={{ scale: registering ? 1 : 0.985 }}
              className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/20 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {registering ? (
                <>
                  <ButtonLoader size="small" color="white" />
                  Creating account...
                </>
              ) : checkingEmail ? (
                "Checking email..."
              ) : (
                <>
                  <FaShieldAlt aria-hidden="true" />
                  Register as Admin
                </>
              )}
            </motion.button>

            <p className={`pt-2 text-center text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Already have an admin account?{" "}
              <button
                type="button"
                onClick={() => navigate("/admin/login")}
                className={`font-semibold underline underline-offset-4 transition ${
                  isDark ? "text-indigo-300 hover:text-indigo-200" : "text-indigo-600 hover:text-indigo-700"
                }`}
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </motion.section>

      <p className={`absolute bottom-3 left-4 right-4 z-10 text-center text-xs ${
        isDark ? "text-slate-400" : "text-white drop-shadow"
      }`}>
        © {new Date().getFullYear()} StudNest. Secure administrator registration.
      </p>
    </main>
  );
};

function FormField({ label, htmlFor, isDark, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function PasswordField({
  id,
  name,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
  inputClass,
  isDark,
}) {
  return (
    <div className="relative">
      <FaLock className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="new-password"
        required
        className={`${inputClass} pl-11 pr-12`}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
        className={`absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isDark ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        }`}
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}

export default AdminRegister;

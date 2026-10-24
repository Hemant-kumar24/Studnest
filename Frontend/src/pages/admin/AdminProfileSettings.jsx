import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSave,
  FaKey,
  FaCheckCircle,
  FaExclamationCircle,
  FaShieldAlt,
  FaMoon,
  FaSun,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { motion } from "framer-motion";
import adminSystemService from "../../services/adminSystemService";

export default function AdminProfileSettings() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || "light";
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const syncTheme = () => {
      const nextTheme = localStorage.getItem("theme") || "light";
      setTheme(nextTheme);
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
    };

    syncTheme();
    window.addEventListener("storage", syncTheme);
    window.addEventListener("studnest-theme-changed", syncTheme);
    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("studnest-theme-changed", syncTheme);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await adminSystemService.getProfile();
        const admin = res?.admin || res?.data || res;
        if (active) {
          setProfile({
            name: admin?.name || "",
            email: admin?.email || "",
          });
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Unable to load admin profile.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const name = profile.name.trim();
    const email = profile.email.trim().toLowerCase();

    if (!name) return setError("Admin name is required.");
    if (!email) return setError("Admin email is required.");

    try {
      setSavingProfile(true);
      const res = await adminSystemService.updateProfile({ name, email });
      const updatedAdmin = res?.admin || res?.data || null;

      if (updatedAdmin) {
        setProfile({
          name: updatedAdmin.name || name,
          email: updatedAdmin.email || email,
        });
      } else {
        setProfile({ name, email });
      }

      setMessage(res?.message || "Profile updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const currentPassword = password.currentPassword.trim();
    const newPassword = password.newPassword.trim();
    const confirmPassword = password.confirmPassword.trim();

    if (!currentPassword) return setError("Please enter your current password.");
    if (!newPassword) return setError("Please enter a new password.");
    if (newPassword.length < 8) {
      return setError("New password must be at least 8 characters.");
    }
    if (newPassword !== confirmPassword) {
      return setError("New password and confirmation do not match.");
    }
    if (currentPassword === newPassword) {
      return setError("New password must be different from your current password.");
    }

    try {
      setSavingPassword(true);
      const res = await adminSystemService.changePassword({
        currentPassword,
        newPassword,
      });
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage(res?.message || "Password changed successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";

  if (loading) {
    return (
      <main className="min-h-full bg-gray-50 p-4 transition-colors dark:bg-slate-950 sm:p-6">
        <div className="mx-auto max-w-4xl animate-pulse space-y-6">
          <div className="h-8 w-56 rounded-lg bg-gray-200 dark:bg-slate-800" />
          <div className="h-4 w-80 max-w-full rounded bg-gray-200 dark:bg-slate-800" />
          {[1, 2].map((item) => (
            <div key={item} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 h-5 w-40 rounded bg-gray-200 dark:bg-slate-800" />
              <div className="space-y-4">
                <div className="h-11 rounded-lg bg-gray-200 dark:bg-slate-800" />
                <div className="h-11 rounded-lg bg-gray-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-gray-50 p-4 text-gray-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <FaShieldAlt className="text-lg" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Account &amp; Security</p>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Admin Settings</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Manage your administrator profile and account security.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:self-auto">
            {theme === "dark" ? <FaMoon className="text-blue-400" /> : <FaSun className="text-amber-500" />}
            {theme === "dark" ? "Dark theme" : "Light theme"}
          </div>
        </motion.header>

        {(message || error) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
            }`}
          >
            {error ? <FaExclamationCircle className="mt-0.5 shrink-0" /> : <FaCheckCircle className="mt-0.5 shrink-0" />}
            <p>{error || message}</p>
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={updateProfile}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <CardHeader
            icon={<FaUser />}
            title="Profile Information"
            description="Update your administrator account details."
          />
          <div className="space-y-5 p-5 md:p-6">
            <div>
              <label htmlFor="admin-name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                Admin Name
              </label>
              <div className="relative">
                <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  id="admin-name"
                  name="name"
                  type="text"
                  required
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Enter admin name"
                  autoComplete="name"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Enter admin email"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex justify-end border-t border-gray-100 pt-4 dark:border-slate-800">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900"
              >
                {savingProfile ? <Spinner /> : <FaSave />}
                {savingProfile ? "Saving profile..." : "Save Profile"}
              </button>
            </div>
          </div>
        </motion.form>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={updatePassword}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <CardHeader
            icon={<FaLock />}
            title="Change Password"
            description="Protect your administrator account with a strong password."
          />
          <div className="space-y-5 p-5 md:p-6">
            <PasswordInput
              id="current-password"
              name="currentPassword"
              label="Current Password"
              value={password.currentPassword}
              onChange={handlePasswordChange}
              visible={showPasswords.currentPassword}
              onToggle={() => togglePasswordVisibility("currentPassword")}
              placeholder="Enter current password"
              autoComplete="current-password"
              inputClass={inputClass}
              icon={<FaKey />}
            />
            <PasswordInput
              id="new-password"
              name="newPassword"
              label="New Password"
              value={password.newPassword}
              onChange={handlePasswordChange}
              visible={showPasswords.newPassword}
              onToggle={() => togglePasswordVisibility("newPassword")}
              placeholder="Enter new password"
              autoComplete="new-password"
              inputClass={inputClass}
              icon={<FaLock />}
              minLength={8}
            />
            <p className="-mt-3 text-xs text-gray-500 dark:text-slate-400">
              Use at least 8 characters and avoid reusing a password from another account.
            </p>
            <PasswordInput
              id="confirm-password"
              name="confirmPassword"
              label="Confirm New Password"
              value={password.confirmPassword}
              onChange={handlePasswordChange}
              visible={showPasswords.confirmPassword}
              onToggle={() => togglePasswordVisibility("confirmPassword")}
              placeholder="Confirm new password"
              autoComplete="new-password"
              inputClass={inputClass}
              icon={<FaLock />}
              minLength={8}
            />
            <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
              <FaShieldAlt className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">Security tip</p>
                <p className="mt-1 text-xs leading-5 text-blue-800/80 dark:text-blue-300/80">
                  Never share your password. A unique password helps keep your admin account secure.
                </p>
              </div>
            </div>
            <div className="flex justify-end border-t border-gray-100 pt-4 dark:border-slate-800">
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
              >
                {savingPassword ? <Spinner dark /> : <FaLock />}
                {savingPassword ? "Changing password..." : "Change Password"}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </main>
  );
}

function CardHeader({ icon, title, description }) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 dark:border-slate-800 md:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-200">
        {icon}
      </div>
      <div>
        <h2 className="font-semibold text-gray-900 dark:text-slate-100">{title}</h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
  autoComplete,
  inputClass,
  icon,
  minLength,
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">
          {icon}
        </span>
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={minLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={inputClass}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          title={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-500 dark:hover:text-blue-400"
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
}

function Spinner({ dark = false }) {
  return (
    <span
      className={`h-4 w-4 animate-spin rounded-full border-2 ${
        dark
          ? "border-gray-500 border-t-transparent dark:border-slate-300 dark:border-t-transparent"
          : "border-white border-t-transparent"
      }`}
    />
  );
}

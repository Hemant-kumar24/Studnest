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
} from "react-icons/fa";

import adminSystemService from "../../services/adminSystemService";

export default function AdminProfileSettings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

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

  // ==========================================
  // LOAD ADMIN PROFILE
  // ==========================================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await adminSystemService.getProfile();

        // Backend response:
        // { admin: {...} }
        const admin =
          res?.admin ||
          res?.data ||
          res;

        setProfile({
          name: admin?.name || "",
          email: admin?.email || "",
        });
      } catch (err) {
        console.error("Load admin profile error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load admin profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ==========================================
  // PROFILE INPUT
  // ==========================================
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // PASSWORD INPUT
  // ==========================================
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE PROFILE
  // ==========================================
  const updateProfile = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const name = profile.name.trim();
    const email = profile.email.trim().toLowerCase();

    if (!name) {
      setError("Admin name is required.");
      return;
    }

    if (!email) {
      setError("Admin email is required.");
      return;
    }

    try {
      setSavingProfile(true);

      const res = await adminSystemService.updateProfile({
        name,
        email,
      });

      const updatedAdmin =
        res?.admin ||
        res?.data ||
        null;

      if (updatedAdmin) {
        setProfile({
          name: updatedAdmin.name || name,
          email: updatedAdmin.email || email,
        });
      }

      setMessage(
        res?.message ||
          "Profile updated successfully."
      );
    } catch (err) {
      console.error("Update admin profile error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================
  const updatePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const currentPassword =
      password.currentPassword.trim();

    const newPassword =
      password.newPassword.trim();

    const confirmPassword =
      password.confirmPassword.trim();

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirmation do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setSavingPassword(true);

      const res =
        await adminSystemService.changePassword({
          currentPassword,
          newPassword,
        });

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage(
        res?.message ||
          "Password changed successfully."
      );
    } catch (err) {
      console.error("Change admin password error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="h-4 w-80 rounded bg-gray-200" />

            <div className="rounded-2xl border bg-white p-6">
              <div className="mb-5 h-6 w-32 rounded bg-gray-200" />
              <div className="space-y-4">
                <div className="h-11 rounded bg-gray-200" />
                <div className="h-11 rounded bg-gray-200" />
                <div className="h-10 w-32 rounded bg-gray-200" />
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <div className="mb-5 h-6 w-40 rounded bg-gray-200" />
              <div className="space-y-4">
                <div className="h-11 rounded bg-gray-200" />
                <div className="h-11 rounded bg-gray-200" />
                <div className="h-11 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="min-h-full bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* ======================================
            HEADER
        ====================================== */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">
              <FaShieldAlt />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Admin Settings
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your administrator profile and account
                security.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}
        {message && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <FaCheckCircle className="mt-0.5 shrink-0" />

            <p>{message}</p>
          </div>
        )}

        {/* ======================================
            ERROR MESSAGE
        ====================================== */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <FaExclamationCircle className="mt-0.5 shrink-0" />

            <p>{error}</p>
          </div>
        )}

        {/* ======================================
            PROFILE CARD
        ====================================== */}
        <form
          onSubmit={updateProfile}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          {/* Card Header */}
          <div className="border-b border-gray-100 px-5 py-5 md:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <FaUser />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Profile Information
                </h2>

                <p className="text-sm text-gray-500">
                  Update your administrator account details.
                </p>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="space-y-5 p-5 md:p-6">

            {/* Name */}
            <div>
              <label
                htmlFor="admin-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Admin Name
              </label>

              <div className="relative">
                <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="admin-name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Enter admin name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Enter admin email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingProfile ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* ======================================
            PASSWORD CARD
        ====================================== */}
        <form
          onSubmit={updatePassword}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          {/* Card Header */}
          <div className="border-b border-gray-100 px-5 py-5 md:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <FaLock />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Change Password
                </h2>

                <p className="text-sm text-gray-500">
                  Keep your administrator account secure.
                </p>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="space-y-5 p-5 md:p-6">

            {/* Current Password */}
            <div>
              <label
                htmlFor="current-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>

              <div className="relative">
                <FaKey className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="current-password"
                  name="currentPassword"
                  required
                  type="password"
                  value={password.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                New Password
              </label>

              <div className="relative">
                <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="new-password"
                  name="newPassword"
                  required
                  minLength={8}
                  type="password"
                  value={password.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Password must contain at least 8 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>

              <div className="relative">
                <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="confirm-password"
                  name="confirmPassword"
                  required
                  minLength={8}
                  type="password"
                  value={password.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>

            {/* Password Security Note */}
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <FaShieldAlt className="mt-0.5 shrink-0 text-gray-500" />

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Security tip
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Use a unique password that you do not use
                  for other accounts.
                </p>
              </div>
            </div>

            {/* Change Password */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingPassword ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-700 border-t-transparent" />
                    Changing...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
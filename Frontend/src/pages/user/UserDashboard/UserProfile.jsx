import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/user/profile");
        setUser(res.data);
        setForm({ name: res.data.name || "", email: res.data.email || "" });
      } catch (e) {
        console.error("Failed to fetch user profile", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await axiosInstance.put(`/api/user/profile`, form);
      setUser(res.data.user);
      // simple notification
      alert("Profile updated");
    } catch (e) {
      console.error("Failed to update user profile", e);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md w-full max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-28 h-28 object-cover rounded-full"
            />
          ) : (
            <FaUserCircle className="text-gray-400 text-[100px]" />
          )}
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            {user?.createdAt && (
              <p className="text-gray-500 mt-1 text-sm">Joined on {new Date(user.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        {/* Editable form */}
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="font-semibold mb-1 block">Full Name</label>
            <input
              className="w-full p-2 rounded border"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="font-semibold mb-1 block">Email Address</label>
            <input
              type="email"
              className="w-full p-2 rounded border"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserProfile;

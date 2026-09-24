import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBookmark, FaStar, FaClock, FaCompass, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom"; // Updated for SPA navigation
import api from "../../../utils/axiosInstance";

// Card for stats
const StatCard = ({ icon, label, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 
               rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex items-center gap-4">
      <div className="text-indigo-600 dark:text-indigo-400 text-3xl">{icon}</div>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-3xl font-extrabold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  </motion.div>
);

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    favoritesCount: 0,
    reviewsCount: 0,
    lastBookingAt: null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/user/overview");
        setOverview(res.data);
      } catch (e) {
        console.error("Failed to load overview", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    { icon: <FaBookmark />, label: "Saved Hostels", value: overview.favoritesCount },
    { icon: <FaStar />, label: "Reviews", value: overview.reviewsCount },
    {
      icon: <FaClock />,
      label: "Last Booking",
      value: overview.lastBookingAt ? new Date(overview.lastBookingAt).toLocaleString() : "—",
    },
  ];

  return (
    <div className="p-6">

      {/* HEADING */}
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-white tracking-wide">
        Dashboard Overview
      </h2>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((s, i) => (
          <StatCard
            key={i}
            icon={s.icon}
            label={s.label}
            value={loading ? "…" : s.value}
          />
        ))}
      </div>

      {/* MAIN SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* RECENT ACTIVITY */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border 
                     border-gray-200 dark:border-gray-700 rounded-2xl p-7 shadow-md hover:shadow-xl transition"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Your latest booking, saved hostels, and activity history will appear here. 
            Stay updated with your recent interactions on StudNest.
          </p>
        </motion.div>

        {/* QUICK LINKS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border 
                     border-gray-200 dark:border-gray-700 rounded-2xl p-7 shadow-md hover:shadow-xl transition"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Quick Links
          </h3>

          <div className="space-y-3">

            {/* EXPLORE HOSTELS */}
            <Link
              to="/explore"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 
                         hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white 
                         font-medium shadow-sm hover:shadow-lg transition-all"
            >
              <FaCompass /> Explore Hostels
            </Link>

            {/* FAVORITES */}
            <Link
              to="/userdashboard/favorites"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 
                         hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white 
                         font-medium shadow-sm hover:shadow-lg transition-all"
            >
              <FaHeart /> View Favorites
            </Link>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;

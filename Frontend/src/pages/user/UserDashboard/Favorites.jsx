import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import api from "../../../utils/axiosInstance";

const Favorites = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/user/favorites");
      setItems(res.data || []);
    } catch (e) {
      console.error("Failed to load favorites", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (hostelId) => {
    try {
      await api.delete(`/user/favorites/${hostelId}`);
      setItems((prev) => prev.filter((f) => f.hostelId?._id !== hostelId));
    } catch (e) {
      console.error("Failed to remove favorite", e);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Saved / Favorites</h2>

      {loading ? (
        <div className="text-gray-600 dark:text-gray-300">Loading…</div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-300">You haven't saved any hostels yet.</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Browse and tap the heart to save.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((it) => (
            <motion.div
              key={it._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="h-40 w-full overflow-hidden">
                <img src={it.hostelId?.image} alt={it.hostelId?.propertyTitle} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{it.hostelId?.propertyTitle}</h3>
                  <button
                    onClick={() => remove(it.hostelId?._id)}
                    className="inline-flex items-center gap-1 text-red-500 hover:text-red-600"
                    title="Remove from saved"
                  >
                    <FaHeart />
                    <span className="text-sm">Remove</span>
                  </button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <FaMapMarkerAlt /> {it.hostelId?.city}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
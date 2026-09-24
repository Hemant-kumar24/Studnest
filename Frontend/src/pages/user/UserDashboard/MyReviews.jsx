import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import api from "../../../utils/axiosInstance";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/user/reviews");
        setReviews(res.data || []);
      } catch (e) {
        console.error("Failed to load reviews", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Reviews</h2>

      {loading ? (
        <div className="text-gray-600 dark:text-gray-300">Loading…</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300">No reviews submitted yet.</p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Go explore and share your experience!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200"
            >
              <h3 className="text-lg font-semibold mb-2">{review.hostelId?.propertyTitle || 'Hostel'}</h3>
              <div className="flex items-center gap-1 text-amber-500 mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar key={i} className={i < review.rating ? "text-amber-400" : "text-gray-300 dark:text-gray-600"} />
                ))}
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">({review.rating} Stars)</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-3 italic">"{review.comment}"</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-right">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;

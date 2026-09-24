import { Link } from "react-router-dom";
import {
  FaStar,
  FaEye,
  FaTrash,
  FaUser,
  FaHome,
  FaCalendarAlt,
} from "react-icons/fa";

import RatingStars from "./RatingStars";

const AdminReviewCard = ({ review, onDelete, workingId }) => {
  // Normalize review data
  const student =
    review?.userId ||
    review?.user ||
    review?.student ||
    {};

  const hostel =
    review?.hostelId ||
    review?.hostel ||
    {};

  const reviewId = review?._id;

  const studentName =
    student?.name ||
    student?.fullName ||
    "Unknown Student";

  const studentEmail =
    student?.email ||
    "No email available";

  const hostelName =
    hostel?.propertyTitle ||
    hostel?.name ||
    "Unknown Hostel";

  const hostelCity =
    hostel?.city ||
    "";

  const rating = Number(review?.rating || 0);

  const comment =
    review?.comment?.trim() ||
    "No comment provided.";

  const createdAt = review?.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Unknown date";

  const isDeleting = workingId === reviewId;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Hostel Information */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <FaHome className="text-indigo-600 text-lg" />
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {hostelName}
              </h3>

              {hostelCity && (
                <p className="text-sm text-gray-500 mt-1">
                  {hostelCity}
                </p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 shrink-0">
            <RatingStars rating={rating} />

            <span className="text-sm font-semibold text-gray-700">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Student */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <FaUser className="text-gray-500" />
          </div>

          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {studentName}
            </p>

            <p className="text-sm text-gray-500 truncate">
              {studentEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Review */}
      <div className="px-5 py-5">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm leading-6 text-gray-700 break-words">
            "{comment}"
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaCalendarAlt className="text-gray-400" />
            <span>{createdAt}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* View */}
            <Link
              to={`/admin/reviews/${reviewId}`}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:text-indigo-600 transition-colors"
            >
              <FaEye />
              <span>View</span>
            </Link>

            {/* Delete */}
            <button
              type="button"
              onClick={() => onDelete(reviewId)}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaTrash />

              <span>
                {isDeleting ? "Deleting..." : "Delete"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewCard;
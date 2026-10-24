import { Link } from "react-router-dom";
import {
  FaEye,
  FaTrash,
  FaUser,
  FaHome,
  FaCalendarAlt,
} from "react-icons/fa";

import RatingStars from "./RatingStars";

const AdminReviewCard = ({ review, onDelete, workingId }) => {
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

  const hostelCity = hostel?.city || "";
  const rating = Number(review?.rating || 0);
  const comment = review?.comment?.trim() || "No comment provided.";

  const createdAt = review?.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Unknown date";

  const isDeleting = workingId === reviewId;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800">
      {/* Header */}
      <div className="border-b border-slate-100 p-5 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
              <FaHome className="text-lg text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                {hostelName}
              </h3>

              {hostelCity && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {hostelCity}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <RatingStars rating={rating} />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Student */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <FaUser className="text-slate-500 dark:text-slate-400" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900 dark:text-white">
              {studentName}
            </p>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              {studentEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Review text */}
      <div className="px-5 py-5">
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
          <p className="break-words text-sm leading-6 text-slate-700 dark:text-slate-200">
            “{comment}”
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <FaCalendarAlt className="text-slate-400 dark:text-slate-500" />
            <span>{createdAt}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/admin/reviews/${reviewId}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-slate-700 dark:hover:text-indigo-300 dark:focus-visible:ring-offset-slate-900"
            >
              <FaEye aria-hidden="true" />
              <span>View</span>
            </Link>

            <button
              type="button"
              onClick={() => onDelete(reviewId)}
              disabled={isDeleting}
              aria-label={isDeleting ? "Deleting review" : "Delete review"}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70 dark:focus-visible:ring-offset-slate-900"
            >
              <FaTrash aria-hidden="true" />
              <span>{isDeleting ? "Deleting..." : "Delete"}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default AdminReviewCard;

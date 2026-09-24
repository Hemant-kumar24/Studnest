import { useEffect, useMemo, useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaCommentAlt,
} from "react-icons/fa";

import {
  createReview,
  updateReview,
  deleteReview,
} from "../../services/reviewService";

import ReviewList from "./ReviewList";
import { getApiErrorMessage } from "../../utils/apiError";

export default function ReviewSection({
  hostelId,
  reviews = [],
  onReviewsChange,
  canReview = false,
  currentUserId,
}) {
  const [localReviews, setLocalReviews] =
    useState(reviews);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [editingReview, setEditingReview] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================
  // KEEP LOCAL REVIEWS IN SYNC
  // ==========================================

  useEffect(() => {
    setLocalReviews(
      Array.isArray(reviews)
        ? reviews
        : []
    );
  }, [reviews]);

  // ==========================================
  // RATING SUMMARY
  // ==========================================

  const averageRating = useMemo(() => {
    if (!localReviews.length) {
      return 0;
    }

    const total = localReviews.reduce(
      (sum, review) =>
        sum + Number(review.rating || 0),
      0
    );

    return total / localReviews.length;
  }, [localReviews]);

  // ==========================================
  // UPDATE REVIEWS EVERYWHERE
  // ==========================================

  const updateReviews = (newReviews) => {
    setLocalReviews(newReviews);

    if (onReviewsChange) {
      onReviewsChange(newReviews);
    }
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setRating(5);
    setHoverRating(0);
    setComment("");
    setEditingReview(null);
    setError("");
  };

  // ==========================================
  // START EDIT
  // ==========================================

  const handleEdit = (review) => {
    setEditingReview(review);

    setRating(
      Number(review.rating || 5)
    );

    setComment(
      review.comment || ""
    );

    setError("");
    setSuccess("");

    window.scrollTo({
      top:
        document.getElementById(
          "review-form"
        )?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {
    resetForm();
    setSuccess("");
  };

  // ==========================================
  // SUBMIT REVIEW
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hostelId) {
      setError(
        "Hostel information is missing."
      );
      return;
    }

    if (
      !rating ||
      rating < 1 ||
      rating > 5
    ) {
      setError(
        "Please select a rating between 1 and 5."
      );
      return;
    }

    if (comment.trim().length > 1000) {
      setError(
        "Review cannot exceed 1000 characters."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // ======================================
      // UPDATE EXISTING REVIEW
      // ======================================

      if (editingReview) {
        const response =
          await updateReview(
            editingReview._id,
            {
              rating,
              comment: comment.trim(),
            }
          );

        const updatedReview =
          response?.data?.review ||
          response?.data?.data;

        if (!updatedReview) {
          throw new Error(
            "Updated review was not returned by server."
          );
        }

        const updatedReviews =
          localReviews.map((review) =>
            review._id ===
            editingReview._id
              ? updatedReview
              : review
          );

        updateReviews(
          updatedReviews
        );

        setSuccess(
          "Review updated successfully."
        );

        resetForm();

        return;
      }

      // ======================================
      // CREATE NEW REVIEW
      // ======================================

      const response =
        await createReview({
          hostelId,
          rating,
          comment: comment.trim(),
        });

      const newReview =
        response?.data?.review ||
        response?.data?.data;

      if (!newReview) {
        throw new Error(
          "Review was not returned by server."
        );
      }

      updateReviews([
        newReview,
        ...localReviews,
      ]);

      setSuccess(
        "Review added successfully."
      );

      resetForm();
    } catch (err) {
      console.error(
        "Review submit error:",
        err
      );

      setError(
        getApiErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE REVIEW
  // ==========================================

  const handleDelete = async (
    reviewId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(reviewId);
      setError("");
      setSuccess("");

      await deleteReview(
        reviewId
      );

      const updatedReviews =
        localReviews.filter(
          (review) =>
            review._id !== reviewId
        );

      updateReviews(
        updatedReviews
      );

      if (
        editingReview?._id ===
        reviewId
      ) {
        resetForm();
      }

      setSuccess(
        "Review deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete review error:",
        err
      );

      setError(
        getApiErrorMessage(err)
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // CHECK OWN REVIEW
  // ==========================================

  const myReview = useMemo(() => {
    if (!currentUserId) {
      return null;
    }

    return (
      localReviews.find(
        (review) =>
          String(
            review.userId?._id ||
              review.userId
          ) ===
          String(currentUserId)
      ) || null
    );
  }, [
    localReviews,
    currentUserId,
  ]);

  return (
    <section className="space-y-6">

      {/* ======================================
          HEADER / RATING SUMMARY
      ====================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

          {/* Average Rating */}

          <div className="flex items-center gap-5">

            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-yellow-50 dark:bg-yellow-900/20">

              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {averageRating
                  ? averageRating.toFixed(
                      1
                    )
                  : "0.0"}
              </span>

              <div className="mt-1 flex items-center gap-1 text-yellow-400">
                <FaStar />
              </div>

            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Student Reviews
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {localReviews.length} review
                {localReviews.length !==
                1
                  ? "s"
                  : ""}
              </p>

              <div className="mt-2 flex items-center gap-1">
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  index <
                  Math.round(
                    averageRating
                  ) ? (
                    <FaStar
                      key={index}
                      className="text-sm text-yellow-400"
                    />
                  ) : (
                    <FaRegStar
                      key={index}
                      className="text-sm text-slate-300 dark:text-slate-600"
                    />
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Review Eligibility */}

          {canReview && (
            <div className="sm:ml-auto">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                <FaCheck />
                Eligible to review
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ======================================
          SUCCESS MESSAGE
      ====================================== */}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          {success}
        </div>
      )}

      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* ======================================
          REVIEW FORM
      ====================================== */}

      {canReview && !myReview && (
        <div
          id="review-form"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-5">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <FaCommentAlt />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Share your experience
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Help other students make a better decision.
                </p>
              </div>

            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Rating */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Your Rating
              </label>

              <div className="flex items-center gap-2">

                {Array.from({
                  length: 5,
                }).map((_, index) => {
                  const star =
                    index + 1;

                  const active =
                    star <=
                    (hoverRating ||
                      rating);

                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() =>
                        setHoverRating(
                          star
                        )
                      }
                      onMouseLeave={() =>
                        setHoverRating(
                          0
                        )
                      }
                      onClick={() =>
                        setRating(
                          star
                        )
                      }
                      className="text-2xl transition hover:scale-110"
                      aria-label={`${star} star`}
                    >
                      {active ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                  );
                })}

                <span className="ml-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {rating}/5
                </span>
              </div>
            </div>

            {/* Comment */}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Your Review
                </label>

                <span className="text-xs text-slate-400">
                  {comment.length}/1000
                </span>
              </div>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(
                    e.target.value.slice(
                      0,
                      1000
                    )
                  )
                }
                rows={5}
                placeholder="Tell other students about your experience..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheck />
                  Submit Review
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ======================================
          EXISTING USER REVIEW
      ====================================== */}

      {canReview && myReview && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/20">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Your Review
              </p>

              <div className="mt-2 flex items-center gap-1">
                {Array.from({
                  length: 5,
                }).map((_, index) =>
                  index <
                  Number(
                    myReview.rating || 0
                  ) ? (
                    <FaStar
                      key={index}
                      className="text-yellow-400"
                    />
                  ) : (
                    <FaRegStar
                      key={index}
                      className="text-slate-300"
                    />
                  )
                )}

                <span className="ml-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {myReview.rating}/5
                </span>
              </div>
            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() =>
                  handleEdit(
                    myReview
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-900 dark:bg-slate-900 dark:text-indigo-400"
              >
                <FaEdit />
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(
                    myReview._id
                  )
                }
                disabled={
                  deletingId ===
                  myReview._id
                }
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:bg-slate-900 dark:text-red-400"
              >
                {deletingId ===
                myReview._id ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                ) : (
                  <FaTrash />
                )}

                Delete
              </button>

            </div>
          </div>

          {myReview.comment && (
            <p className="mt-4 border-t border-indigo-100 pt-4 text-sm leading-6 text-slate-600 dark:border-indigo-900/30 dark:text-slate-300">
              {myReview.comment}
            </p>
          )}
        </div>
      )}

      {/* ======================================
          EDIT FORM
      ====================================== */}

      {editingReview && (
        <div
          id="review-form"
          className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm dark:border-indigo-900/50 dark:bg-slate-900"
        >
          <div className="mb-5 flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Edit Review
              </p>

              <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                Update your experience
              </h3>
            </div>

            <button
              type="button"
              onClick={
                handleCancelEdit
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Rating */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Your Rating
              </label>

              <div className="flex items-center gap-2">

                {Array.from({
                  length: 5,
                }).map((_, index) => {
                  const star =
                    index + 1;

                  const active =
                    star <=
                    (hoverRating ||
                      rating);

                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() =>
                        setHoverRating(
                          star
                        )
                      }
                      onMouseLeave={() =>
                        setHoverRating(
                          0
                        )
                      }
                      onClick={() =>
                        setRating(
                          star
                        )
                      }
                      className="text-2xl transition hover:scale-110"
                    >
                      {active ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                  );
                })}

                <span className="ml-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {rating}/5
                </span>
              </div>
            </div>

            {/* Comment */}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Your Review
                </label>

                <span className="text-xs text-slate-400">
                  {comment.length}/1000
                </span>
              </div>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(
                    e.target.value.slice(
                      0,
                      1000
                    )
                  )
                }
                rows={5}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Buttons */}

            <div className="flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Update Review
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={
                  handleCancelEdit
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <FaTimes />
                Cancel
              </button>

            </div>
          </form>
        </div>
      )}

      {/* ======================================
          ALL REVIEWS
      ====================================== */}

      <ReviewList
        reviews={localReviews}
      />
    </section>
  );
}
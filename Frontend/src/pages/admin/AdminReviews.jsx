import { useEffect, useState } from "react";
import AdminReviewCard from "../../components/admin/AdminReviewCard";
import {
  getAdminReviews,
  deleteAdminReview,
} from "../../services/adminReviewService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("");
  const [hostelId, setHostelId] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminReviews({
        page,
        limit: 10,
        ...(rating ? { rating } : {}),
        ...(hostelId ? { hostelId } : {}),
      });

      setReviews(
        response.data?.data ||
          response.data?.reviews ||
          []
      );

      setPagination(
        response.data?.pagination || null
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, rating, hostelId]);

  const remove = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      setWorkingId(id);
      setError("");

      await deleteAdminReview(id);

      setReviews((items) =>
        items.filter((item) => item._id !== id)
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setWorkingId("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="mb-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Admin Panel
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Reviews & Ratings
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Moderate student feedback and monitor hostel ratings.
          </p>
        </section>

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Rating */}
            <div>
              <label
                htmlFor="rating"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Filter by Rating
              </label>

              <select
                id="rating"
                value={rating}
                onChange={(e) => {
                  setRating(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Hostel ID */}
            <div>
              <label
                htmlFor="hostelId"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Hostel ID
              </label>

              <input
                id="hostelId"
                type="text"
                value={hostelId}
                onChange={(e) => {
                  setHostelId(e.target.value);
                  setPage(1);
                }}
                placeholder="Filter by Hostel ID"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <i className="fas fa-circle-exclamation mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
              Loading reviews...
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && reviews.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <i className="fas fa-star text-xl" />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              No reviews found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              There are no reviews matching these filters.
            </p>
          </div>
        )}

        {/* Review List */}
        {!loading && reviews.length > 0 && (
          <section className="space-y-4">
            {reviews.map((review) => (
              <AdminReviewCard
                key={review._id}
                review={review}
                onDelete={remove}
                workingId={workingId}
              />
            ))}
          </section>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage((p) => p - 1)
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              ← Previous
            </button>

            <span className="text-sm font-medium text-slate-600">
              Page{" "}
              <span className="font-bold text-slate-900">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900">
                {pagination.pages}
              </span>
            </span>

            <button
              type="button"
              disabled={page >= pagination.pages}
              onClick={() =>
                setPage((p) => p + 1)
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
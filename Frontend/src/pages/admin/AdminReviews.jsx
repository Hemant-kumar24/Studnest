import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageSquareText,
  SlidersHorizontal,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Building2,
  Hash,
} from "lucide-react";
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || (document.documentElement.classList.contains("dark") ? "dark" : "light");
  });

  useEffect(() => {
    const syncTheme = () => {
      const nextTheme = localStorage.getItem("theme") || (document.documentElement.classList.contains("dark") ? "dark" : "light");
      setTheme(nextTheme);
    };
    window.addEventListener("storage", syncTheme);
    window.addEventListener("studnest-theme-changed", syncTheme);
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("studnest-theme-changed", syncTheme);
      observer.disconnect();
    };
  }, []);

  const isDark = theme === "dark";

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminReviews({
        page,
        limit: 10,
        ...(rating ? { rating } : {}),
        ...(hostelId.trim() ? { hostelId: hostelId.trim() } : {}),
      });

      setReviews(
        response.data?.data ||
          response.data?.reviews ||
          []
      );

      setPagination(response.data?.pagination || null);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // The refresh key allows retry/refresh without changing active filters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rating, hostelId, refreshKey]);

  const remove = async (id) => {
    if (!window.confirm("Delete this review? This action cannot be undone.")) return;

    try {
      setWorkingId(id);
      setError("");

      await deleteAdminReview(id);

      setReviews((items) => items.filter((item) => item._id !== id));
      // If the last item on a page was deleted, go back one page when possible.
      if (reviews.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        setRefreshKey((current) => current + 1);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setWorkingId("");
    }
  };

  const resetFilters = () => {
    setRating("");
    setHostelId("");
    setPage(1);
  };

  const hasFilters = Boolean(rating || hostelId.trim());

  const card = isDark
    ? "border-slate-700/80 bg-slate-900/80 shadow-black/10"
    : "border-slate-200 bg-white shadow-slate-200/60";
  const heading = isDark ? "text-slate-100" : "text-slate-900";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const field = isDark
    ? "border-slate-700 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:ring-indigo-400/20"
    : "border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/15";

  return (
    <main className={`min-h-screen px-4 py-6 transition-colors duration-300 sm:px-6 sm:py-8 lg:px-8 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className={`mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${isDark ? "border-indigo-400/20 bg-indigo-400/10 text-indigo-300" : "border-indigo-200 bg-indigo-50 text-indigo-700"}`}>
              <Sparkles size={13} />
              StudNest Admin
            </div>
            <h1 className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${heading}`}>
              Reviews &amp; Ratings
            </h1>
            <p className={`mt-2 max-w-2xl text-sm sm:text-base ${muted}`}>
              Moderate student feedback and monitor hostel ratings from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRefreshKey((current) => current + 1)}
            disabled={loading}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${card} ${heading}`}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh reviews
          </button>
        </motion.section>

        {/* Overview */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-6 grid gap-4 sm:grid-cols-2"
        >
          <div className={`rounded-2xl border p-5 shadow-sm ${card}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-medium ${muted}`}>Reviews on this page</p>
                <p className={`mt-2 text-3xl font-extrabold ${heading}`}>{loading ? "—" : reviews.length}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-50 text-amber-600"}`}>
                <Star size={23} fill="currentColor" />
              </div>
            </div>
          </div>
          <div className={`rounded-2xl border p-5 shadow-sm ${card}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-medium ${muted}`}>Current page</p>
                <p className={`mt-2 text-3xl font-extrabold ${heading}`}>{pagination?.page || page}</p>
                <p className={`mt-1 text-xs ${muted}`}>{pagination?.pages ? `of ${pagination.pages} pages` : "Pagination updates when results load"}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? "bg-indigo-400/10 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
                <MessageSquareText size={23} />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Filters */}
        <section className={`mb-6 rounded-2xl border p-4 shadow-sm sm:p-5 ${card}`}>
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal size={18} className={isDark ? "text-indigo-300" : "text-indigo-600"} />
            <h2 className={`font-bold ${heading}`}>Filter reviews</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_1.4fr_auto] md:items-end">
            <div>
              <label htmlFor="rating" className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Rating
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => {
                  setRating(e.target.value);
                  setPage(1);
                }}
                className={`min-h-11 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-4 ${field}`}
              >
                <option value="">All ratings</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </div>

            <div>
              <label htmlFor="hostelId" className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Hostel ID
              </label>
              <div className="relative">
                <Search size={16} className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${muted}`} />
                <input
                  id="hostelId"
                  type="text"
                  value={hostelId}
                  onChange={(e) => {
                    setHostelId(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Enter a hostel ID"
                  className={`min-h-11 w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:ring-4 ${field}`}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilters}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>
          <p className={`mt-3 text-xs ${muted}`}>
            Filters update the results automatically.
          </p>
        </section>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${isDark ? "border-red-400/20 bg-red-400/10 text-red-200" : "border-red-200 bg-red-50 text-red-700"}`}
              role="alert"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span className="flex-1">{error}</span>
              <button type="button" onClick={() => setRefreshKey((current) => current + 1)} className="font-bold underline underline-offset-2">
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <div className={`flex min-h-[240px] items-center justify-center rounded-2xl border ${card}`}>
            <div className={`flex items-center gap-3 text-sm font-medium ${muted}`}>
              <span className={`h-5 w-5 animate-spin rounded-full border-2 ${isDark ? "border-slate-700 border-t-indigo-400" : "border-slate-200 border-t-indigo-600"}`} />
              Loading reviews...
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && reviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border border-dashed px-6 py-14 text-center ${isDark ? "border-slate-700 bg-slate-900/60" : "border-slate-300 bg-white"}`}
          >
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${isDark ? "bg-slate-800 text-amber-300" : "bg-amber-50 text-amber-500"}`}>
              <Star size={24} />
            </div>
            <h2 className={`text-lg font-bold ${heading}`}>No reviews found</h2>
            <p className={`mx-auto mt-2 max-w-md text-sm ${muted}`}>
              {hasFilters ? "Try changing or clearing the filters to see more reviews." : "There are no reviews to display right now."}
            </p>
            {hasFilters && (
              <button type="button" onClick={resetFilters} className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${isDark ? "bg-indigo-400/10 text-indigo-300 hover:bg-indigo-400/20" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"}`}>
                <RotateCcw size={15} /> Clear filters
              </button>
            )}
          </motion.div>
        )}

        {/* Review List */}
        {!loading && reviews.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {reviews.map((review) => (
              <AdminReviewCard
                key={review._id}
                review={review}
                onDelete={remove}
                workingId={workingId}
              />
            ))}
          </motion.section>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border p-4 shadow-sm sm:flex-row ${card}`}
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <div className="text-center">
              <p className={`text-sm font-medium ${muted}`}>
                Page <span className={`font-extrabold ${heading}`}>{pagination.page || page}</span> of{" "}
                <span className={`font-extrabold ${heading}`}>{pagination.pages}</span>
              </p>
              {pagination.total != null && (
                <p className={`mt-1 text-xs ${muted}`}>{pagination.total} total reviews</p>
              )}
            </div>

            <button
              type="button"
              disabled={page >= pagination.pages}
              onClick={() => setPage((current) => current + 1)}
              className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}
            >
              Next <ChevronRight size={16} />
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}

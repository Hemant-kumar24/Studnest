import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarCheck,
  FaClipboardList,
  FaExclamationCircle,
  FaRedo,
} from "react-icons/fa";
import { motion } from "framer-motion";

import { getMyBookings } from "../../services/bookingService";
import BookingCard from "../../components/booking/BookingCard";
import { getApiErrorMessage } from "../../utils/apiError";

const tabs = [
  { label: "All", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Active", value: "Active" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("");
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = { page, limit: 10 };
      if (status) params.status = status;

      const response = await getMyBookings(params);
      const responseData = response?.data?.data ?? response?.data ?? {};
      const bookingList = responseData.bookings ?? responseData.data ?? responseData.results ?? [];

      setBookings(Array.isArray(bookingList) ? bookingList : []);
      setPagination(responseData.pagination ?? null);
    } catch (err) {
      console.error("Load bookings error:", err);
      setError(getApiErrorMessage(err));
      setBookings([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const changeStatus = (value) => {
    if (value === status) return;
    setStatus(value);
    setPage(1);
  };

  const handleRefresh = () => loadBookings();

  const totalBookings = pagination?.total ?? bookings.length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 transition-colors dark:bg-slate-950 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/50 dark:text-indigo-300">
                <FaCalendarCheck /> Student Panel
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                My Bookings
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Track your hostel stays, booking status, and payments in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
            >
              <FaRedo className={loading ? "animate-spin" : ""} />
              Refresh bookings
            </button>
          </div>
        </motion.section>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <nav aria-label="Filter bookings by status" className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const active = status === tab.value;
              return (
                <button
                  key={tab.value || "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => changeStatus(tab.value)}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </section>

        {!loading && !error && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <FaClipboardList />
              </span>
              <span>
                <strong className="font-semibold text-slate-800 dark:text-slate-200">{totalBookings}</strong>{" "}
                booking{totalBookings === 1 ? "" : "s"} found
              </span>
            </div>
            {status && (
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                Filter: {status}
              </span>
            )}
          </div>
        )}

        {loading && (
          <section aria-label="Loading bookings" className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => <BookingSkeleton key={index} />)}
          </section>
        )}

        {!loading && error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/60 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40">
              <FaExclamationCircle className="text-2xl text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Unable to load bookings</h2>
            <p role="alert" className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
            <button type="button" onClick={handleRefresh} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
              <FaRedo /> Try Again
            </button>
          </motion.div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30">
              <FaClipboardList className="text-2xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No bookings found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {status ? `You don't have any ${status.toLowerCase()} bookings yet.` : "Start exploring hostels to make your first booking."}
            </p>
            <Link to="/student/hostels" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
              Explore Hostels <FaArrowRight />
            </Link>
          </motion.div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </motion.section>
        )}

        {!loading && !error && pagination && pagination.pages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:text-indigo-400 sm:w-auto"
            >
              <FaArrowLeft /> Previous
            </button>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Page {pagination.page || page} of {pagination.pages}</p>
              {pagination.total != null && <p className="mt-1 text-xs text-slate-400">{pagination.total} total bookings</p>}
            </div>
            <button
              type="button"
              disabled={page >= pagination.pages}
              onClick={() => setPage((currentPage) => Math.min(pagination.pages, currentPage + 1))}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              Next <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function BookingSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="h-28 w-full rounded-xl bg-slate-200 dark:bg-slate-800 sm:w-48" />
        <div className="flex-1 space-y-4">
          <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-3">
            <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

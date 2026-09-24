import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarCheck,
  FaClipboardList,
  FaExclamationCircle,
  FaRedo,
} from "react-icons/fa";

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

  // ==========================================
  // LOAD BOOKINGS
  // ==========================================

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 10,
      };

      if (status) {
        params.status = status;
      }

      const response = await getMyBookings(params);

      const responseData = response?.data || {};

      const bookingList =
        responseData.bookings ||
        responseData.data ||
        [];

      setBookings(
        Array.isArray(bookingList)
          ? bookingList
          : []
      );

      setPagination(
        responseData.pagination || null
      );
    } catch (err) {
      console.error(
        "Load bookings error:",
        err
      );

      setError(
        getApiErrorMessage(err)
      );

      setBookings([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH WHEN PAGE OR STATUS CHANGES
  // ==========================================

  useEffect(() => {
    loadBookings();
  }, [page, status]);

  // ==========================================
  // CHANGE STATUS FILTER
  // ==========================================

  const changeStatus = (value) => {
    setStatus(value);
    setPage(1);
  };

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = () => {
    loadBookings();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:py-10">
      <div className="mx-auto max-w-6xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <section className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Student Panel
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                My Bookings
              </h1>

              <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                Track your hostel stays, booking status and payments
                in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              <FaRedo
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>
        </section>

        {/* ======================================
            STATUS FILTER
        ====================================== */}

        <section className="mb-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <nav className="flex min-w-max gap-1">

            {tabs.map((tab) => {
              const active =
                status === tab.value;

              return (
                <button
                  key={tab.value || "all"}
                  type="button"
                  onClick={() =>
                    changeStatus(tab.value)
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
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

        {/* ======================================
            LOADING
        ====================================== */}

        {loading && (
          <section className="space-y-4">
            {Array.from({ length: 3 }).map(
              (_, index) => (
                <BookingSkeleton
                  key={index}
                />
              )
            )}
          </section>
        )}

        {/* ======================================
            ERROR
        ====================================== */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-slate-900">

            <FaExclamationCircle className="mx-auto mb-4 text-4xl text-red-500" />

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Unable to load bookings
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <FaRedo />
              Try Again
            </button>

          </div>
        )}

        {/* ======================================
            EMPTY STATE
        ====================================== */}

        {!loading &&
          !error &&
          bookings.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30">
                <FaClipboardList className="text-2xl text-indigo-600 dark:text-indigo-400" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                No bookings found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                {status
                  ? `You don't have any ${status.toLowerCase()} bookings yet.`
                  : "Start exploring hostels to make your first booking."}
              </p>

              <Link
                to="/student/hostels"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Explore Hostels
                <FaArrowRight />
              </Link>

            </div>
          )}

        {/* ======================================
            BOOKING LIST
        ====================================== */}

        {!loading &&
          !error &&
          bookings.length > 0 && (
            <>
              <div className="mb-4 flex items-center justify-between">

                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">

                  <FaCalendarCheck className="text-indigo-500" />

                  <span>
                    {pagination?.total != null
                      ? `${pagination.total} booking${
                          pagination.total !== 1
                            ? "s"
                            : ""
                        }`
                      : `${bookings.length} booking${
                          bookings.length !== 1
                            ? "s"
                            : ""
                        }`}
                  </span>

                </div>

                {status && (
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {status}
                  </span>
                )}

              </div>

              <section className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                  />
                ))}
              </section>
            </>
          )}

        {/* ======================================
            PAGINATION
        ====================================== */}

        {!loading &&
          !error &&
          pagination &&
          pagination.pages > 1 && (
            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row dark:border-slate-800 dark:bg-slate-900">

              {/* PREVIOUS */}

              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage(
                    (currentPage) =>
                      currentPage - 1
                  )
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto dark:border-slate-700 dark:text-slate-300 dark:hover:text-indigo-400"
              >
                <FaArrowLeft />
                Previous
              </button>

              {/* PAGE INFO */}

              <div className="text-center">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Page{" "}
                  {pagination.page || page}
                  {" "}of{" "}
                  {pagination.pages}
                </p>

                {pagination.total != null && (
                  <p className="mt-1 text-xs text-slate-400">
                    {pagination.total} total bookings
                  </p>
                )}
              </div>

              {/* NEXT */}

              <button
                type="button"
                disabled={
                  page >= pagination.pages
                }
                onClick={() =>
                  setPage(
                    (currentPage) =>
                      currentPage + 1
                  )
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Next
                <FaArrowRight />
              </button>

            </div>
          )}
      </div>
    </main>
  );
}

// ==========================================
// BOOKING SKELETON
// ==========================================

function BookingSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex flex-col gap-5 sm:flex-row">

        <div className="h-28 w-full rounded-xl bg-slate-200 sm:w-48 dark:bg-slate-800" />

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
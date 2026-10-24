import { useEffect, useState } from "react";
import AdminBookingCard from "../../components/admin/AdminBookingCard";
import {
  getAdminBookings,
  approveBooking,
  rejectBooking,
} from "../../services/adminBookingService";
import { getApiErrorMessage } from "../../utils/apiError";

const tabs = [
  { label: "All", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Completed", value: "Completed" },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminBookings({
        page,
        limit: 10,
        ...(status ? { status } : {}),
        ...(submittedSearch ? { search: submittedSearch } : {}),
      });

      const result = response?.data;
      setBookings(result?.data || result?.bookings || []);
      setPagination(result?.pagination || null);
    } catch (err) {
      console.error("Admin bookings error:", err);
      setError(getApiErrorMessage(err));
      setBookings([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, submittedSearch]);

  const searchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSubmittedSearch(search.trim());
  };

  const approve = async (id) => {
    try {
      setWorkingId(id);
      setError("");
      await approveBooking(id);
      await load();
    } catch (err) {
      console.error("Approve error:", err);
      setError(getApiErrorMessage(err));
    } finally {
      setWorkingId("");
    }
  };

  const reject = async (id) => {
    const reason = window.prompt("Enter rejection reason:", "");
    if (reason === null) return;

    try {
      setWorkingId(id);
      setError("");
      await rejectBooking(id, reason);
      await load();
    } catch (err) {
      console.error("Reject error:", err);
      setError(getApiErrorMessage(err));
    } finally {
      setWorkingId("");
    }
  };

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <section className="mb-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            Admin Panel
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Booking Management
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Review student bookings and manage their approval lifecycle.
          </p>
        </section>

        {/* Search */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={searchSubmit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="fas fa-search" aria-hidden="true" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, hostel or booking"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Search
            </button>
          </form>
        </section>

        {/* Status filters */}
        <nav aria-label="Filter bookings by status" className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex min-w-max gap-1">
            {tabs.map((tab) => {
              const active = status === tab.value;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => {
                    setStatus(tab.value);
                    setPage(1);
                  }}
                  aria-pressed={active}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Error */}
        {error && (
          <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <i className="fas fa-circle-exclamation mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
              Loading bookings...
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && bookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center transition-colors dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-400 dark:bg-slate-800 dark:text-indigo-300">
              <i className="fas fa-calendar-xmark text-xl" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              No bookings found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              There are no bookings matching the selected filter.
            </p>
          </div>
        )}

        {/* Booking list */}
        {!loading && bookings.length > 0 && (
          <section className="space-y-4">
            {bookings.map((booking) => (
              <AdminBookingCard
                key={booking._id}
                booking={booking}
                workingId={workingId}
                onApprove={approve}
                onReject={reject}
              />
            ))}
          </section>
        )}

        {/* Pagination */}
        {!loading && pagination && pagination.pages > 1 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
            >
              ← Previous
            </button>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Page{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {pagination.pages}
              </span>
            </span>
            <button
              type="button"
              disabled={page >= pagination.pages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

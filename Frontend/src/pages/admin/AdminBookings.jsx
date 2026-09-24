import {
  useEffect,
  useState,
} from "react";

import AdminBookingCard from "../../components/admin/AdminBookingCard";

import {
  getAdminBookings,
  approveBooking,
  rejectBooking,
} from "../../services/adminBookingService";

import { getApiErrorMessage } from "../../utils/apiError";

const tabs = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Pending",
    value: "Pending",
  },
  {
    label: "Approved",
    value: "Approved",
  },
  {
    label: "Confirmed",
    value: "Confirmed",
  },
  {
    label: "Cancelled",
    value: "Cancelled",
  },
  {
    label: "Completed",
    value: "Completed",
  },
];

export default function AdminBookings() {
  const [bookings, setBookings] =
    useState([]);

  const [status, setStatus] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [
    submittedSearch,
    setSubmittedSearch,
  ] = useState("");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [workingId, setWorkingId] =
    useState("");

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD BOOKINGS
  // ==========================================

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminBookings({
          page,
          limit: 10,

          ...(status
            ? { status }
            : {}),

          ...(submittedSearch
            ? {
                search:
                  submittedSearch,
              }
            : {}),
        });

      const result =
        response?.data;

      setBookings(
        result?.data ||
          result?.bookings ||
          []
      );

      setPagination(
        result?.pagination ||
          null
      );
    } catch (err) {
      console.error(
        "Admin bookings error:",
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
  // FETCH ON FILTER/PAGE/SEARCH CHANGE
  // ==========================================

  useEffect(() => {
    load();
  }, [
    page,
    status,
    submittedSearch,
  ]);

  // ==========================================
  // SEARCH
  // ==========================================

  const searchSubmit = (
    event
  ) => {
    event.preventDefault();

    setPage(1);

    setSubmittedSearch(
      search.trim()
    );
  };

  // ==========================================
  // APPROVE
  // ==========================================

  const approve = async (
    id
  ) => {
    try {
      setWorkingId(id);
      setError("");

      await approveBooking(id);

      await load();
    } catch (err) {
      console.error(
        "Approve error:",
        err
      );

      setError(
        getApiErrorMessage(err)
      );
    } finally {
      setWorkingId("");
    }
  };

  // ==========================================
  // REJECT
  // ==========================================

  const reject = async (
    id
  ) => {
    const reason =
      window.prompt(
        "Enter rejection reason:",
        ""
      );

    if (reason === null) {
      return;
    }

    try {
      setWorkingId(id);
      setError("");

      await rejectBooking(
        id,
        reason
      );

      await load();
    } catch (err) {
      console.error(
        "Reject error:",
        err
      );

      setError(
        getApiErrorMessage(err)
      );
    } finally {
      setWorkingId("");
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="mb-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Admin Panel
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Booking Management
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Review student bookings and
            manage their approval lifecycle.
          </p>
        </section>

        {/* Search */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <form
            onSubmit={searchSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="fas fa-search" />
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search student, hostel or booking"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </form>
        </section>

        {/* Tabs */}
        <nav className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-max gap-1">
            {tabs.map(
              (tab) => {
                const active =
                  status ===
                  tab.value;

                return (
                  <button
                    key={
                      tab.label
                    }
                    type="button"
                    onClick={() => {
                      setStatus(
                        tab.value
                      );
                      setPage(1);
                    }}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {
                      tab.label
                    }
                  </button>
                );
              }
            )}
          </div>
        </nav>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <i className="fas fa-circle-exclamation mt-0.5" />

            <span>
              {error}
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />

              Loading bookings...
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          bookings.length ===
            0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <i className="fas fa-calendar-xmark text-xl" />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                No bookings found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                There are no bookings
                matching the selected
                filter.
              </p>
            </div>
          )}

        {/* Booking List */}
        {!loading &&
          bookings.length >
            0 && (
            <section className="space-y-4">
              {bookings.map(
                (booking) => (
                  <AdminBookingCard
                    key={
                      booking._id
                    }
                    booking={
                      booking
                    }
                    workingId={
                      workingId
                    }
                    onApprove={
                      approve
                    }
                    onReject={
                      reject
                    }
                  />
                )
              )}
            </section>
          )}

        {/* Pagination */}
        {!loading &&
          pagination &&
          pagination.pages >
            1 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">

              <button
                type="button"
                disabled={
                  page <= 1
                }
                onClick={() =>
                  setPage(
                    (p) =>
                      p - 1
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                ← Previous
              </button>

              <span className="text-sm font-medium text-slate-600">
                Page{" "}
                <span className="font-bold text-slate-900">
                  {
                    pagination.page
                  }
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-900">
                  {
                    pagination.pages
                  }
                </span>
              </span>

              <button
                type="button"
                disabled={
                  page >=
                  pagination.pages
                }
                onClick={() =>
                  setPage(
                    (p) =>
                      p + 1
                  )
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
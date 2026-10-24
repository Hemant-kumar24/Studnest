import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBell,
  FaCheckDouble,
  FaExclamationCircle,
  FaRedo,
  FaSearch,
  FaInbox,
} from "react-icons/fa";

import adminNotificationService from "../../services/adminNotificationService";
import NotificationCard from "../../components/admin/NotificationCard";
import { getApiErrorMessage } from "../../utils/apiError";

const types = ["All", "Booking", "Payment", "Complaint", "Review", "System"];

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const load = async (overrides = {}) => {
    try {
      setLoading(true);
      setError("");

      const nextPage = overrides.page ?? page;
      const nextType = overrides.type ?? type;
      const nextSearch = overrides.search ?? search;

      const params = { page: nextPage, limit: 10 };

      if (nextType !== "All") params.type = nextType;
      if (nextSearch.trim()) params.search = nextSearch.trim();

      const response = await adminNotificationService.getNotifications(params);
      const data = response || {};
      const list = data.notifications || data.data || [];

      setNotifications(Array.isArray(list) ? list : []);
      setPagination(data.pagination || null);
    } catch (err) {
      setNotifications([]);
      setPagination(null);
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Initial load only; filter changes are handled explicitly below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectType = (nextType) => {
    setType(nextType);
    setPage(1);
    load({ type: nextType, page: 1 });
  };

  const submitSearch = (event) => {
    event.preventDefault();
    setPage(1);
    load({ page: 1, search });
  };

  const goToPage = (nextPage) => {
    setPage(nextPage);
    load({ page: nextPage });
  };

  const markRead = async (id) => {
    try {
      setError("");
      await adminNotificationService.markNotificationRead(id);
      setNotifications((items) =>
        items.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const markAll = async () => {
    try {
      setWorking(true);
      setError("");
      await adminNotificationService.markAllNotificationsRead();
      setNotifications((items) =>
        items.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setWorking(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this notification?")) return;

    try {
      setError("");
      await adminNotificationService.deleteNotification(id);
      setNotifications((items) =>
        items.filter((notification) => notification._id !== id)
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <section className="mb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                <FaBell />
                Admin workspace
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Notifications
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Keep track of important booking, payment, complaint and review updates.
              </p>
            </div>

            <button
              type="button"
              onClick={() => load()}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              <FaRedo className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </section>

        {/* Summary panel */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                <FaBell className="text-lg" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Notification center
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {unreadCount > 0
                    ? `${unreadCount} unread on this page`
                    : "You're all caught up on this page"}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={working || unreadCount === 0}
              onClick={markAll}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaCheckDouble />
              {working ? "Marking as read..." : "Mark all as read"}
            </button>
          </div>
          <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/50 sm:grid-cols-3">
            <SummaryItem label="Notifications on page" value={notifications.length} />
            <SummaryItem label="Unread on page" value={unreadCount} />
            <SummaryItem
              label="Current page"
              value={`${pagination?.page || page}${pagination?.pages ? ` / ${pagination.pages}` : ""}`}
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </section>

        {/* Search and filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <form onSubmit={submitSearch} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title or message..."
                aria-label="Search notifications"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              <FaSearch />
              Search
            </button>
          </form>

          <div className="mt-5">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Filter by type
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {types.map((item) => {
                const active = type === item;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectType(item)}
                    className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                      active
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300"
          >
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex gap-4">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-3 w-1/4 rounded bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
              </div>
            ))}
            <p className="py-2 text-center text-sm text-slate-500 dark:text-slate-400">
              Loading notifications...
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && notifications.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <FaInbox className="text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              No notifications found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              There are no notifications matching your current search or filter. Try changing your filters or check again later.
            </p>
            {(search || type !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setType("All");
                  setPage(1);
                  load({ search: "", type: "All", page: 1 });
                }}
                className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Notification list */}
        {!loading && notifications.length > 0 && (
          <section className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onRead={markRead}
                onDelete={remove}
              />
            ))}
          </section>
        )}

        {/* Pagination */}
        {!loading && pagination && pagination.pages > 1 && (
          <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => goToPage(page - 1)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:text-indigo-400 sm:w-auto"
            >
              <FaArrowLeft />
              Previous
            </button>

            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Page {pagination.page || page} of {pagination.pages}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {pagination.total ?? 0} notifications
              </p>
            </div>

            <button
              type="button"
              disabled={page >= pagination.pages || loading}
              onClick={() => goToPage(page + 1)}
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

function SummaryItem({ label, value, className = "" }) {
  return (
    <div className={`px-5 py-4 ${className}`}>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBell,
  FaCheckDouble,
  FaExclamationCircle,
  FaRedo,
} from "react-icons/fa";

import adminNotificationService from "../../services/adminNotificationService";
import NotificationCard from "../../components/admin/NotificationCard";

import { getApiErrorMessage } from "../../utils/apiError";

const types = [
  "All",
  "Booking",
  "Payment",
  "Complaint",
  "Review",
  "System",
];

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 10,
      };

      if (type !== "All") {
        params.type = type;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const response =
        await adminNotificationService.getNotifications(params);

      const data = response || {};

      const list =
        data.notifications ||
        data.data ||
        [];

      setNotifications(
        Array.isArray(list) ? list : []
      );

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
  }, [page, type]);

  const submitSearch = (event) => {
    event.preventDefault();
    setPage(1);
    load();
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
        items.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setWorking(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this notification?")) {
      return;
    }

    try {
      setError("");

      await adminNotificationService.deleteNotification(id);

      setNotifications((items) =>
        items.filter(
          (notification) => notification._id !== id
        )
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <section className="mb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <FaBell />
                Admin Panel
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Notifications
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                Monitor important booking, payment, complaint and review alerts.
              </p>
            </div>

            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              <FaRedo className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <FaBell />
            </div>

            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Notification Center
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {unreadCount > 0
                  ? `${unreadCount} unread on this page`
                  : "No unread notifications on this page"}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={working || unreadCount === 0}
            onClick={markAll}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaCheckDouble />
            {working ? "Marking..." : "Mark all as read"}
          </button>
        </section>

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form
            onSubmit={submitSearch}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title or message..."
              className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:ring-indigo-900/30"
            />

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {types.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setType(item);
                  setPage(1);
                }}
                className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                  type === item
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <span className="mx-auto mb-3 block h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
            <p className="text-sm font-medium text-slate-500">
              Loading notifications...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && notifications.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <FaBell className="text-2xl text-slate-400" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              No notifications found
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try another filter or check again later.
            </p>
          </div>
        )}

        {/* List */}
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
          <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto dark:border-slate-700 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              <FaArrowLeft />
              Previous
            </button>

            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Page {pagination.page || page} of {pagination.pages}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {pagination.total ?? 0} notifications
              </p>
            </div>

            <button
              type="button"
              disabled={page >= pagination.pages}
              onClick={() => setPage((current) => current + 1)}
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

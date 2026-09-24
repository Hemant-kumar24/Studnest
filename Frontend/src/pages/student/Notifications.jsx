import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBell,
  FaCheckDouble,
  FaExclamationCircle,
  FaRedo,
} from "react-icons/fa";

import NotificationItem from "../../components/notifications/NotificationItem";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
} from "../../services/notificationService";

import { getApiErrorMessage } from "../../utils/apiError";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotifications({
        page,
        limit: 15,
      });

      const data = response?.data || {};

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
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);

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

      await markAllNotificationsRead();

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
    try {
      setError("");

      await deleteNotification(id);

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
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:py-10">
      <div className="mx-auto max-w-4xl">

        <section className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <FaBell />
                Student Panel
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Notifications
              </h1>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Stay updated about your bookings, payments and support.
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

        <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
              <FaBell className="text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Your notifications
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "You're all caught up"}
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

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <section className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <NotificationSkeleton key={index} />
            ))}
          </section>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
              <FaCheckDouble className="text-2xl text-emerald-600 dark:text-emerald-400" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              You're all caught up
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No notifications available right now.
            </p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <section className="space-y-3">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onRead={markRead}
                onDelete={remove}
              />
            ))}
          </section>
        )}

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

function NotificationSkeleton() {
  return (
    <div className="flex animate-pulse gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800" />

      <div className="flex-1 space-y-3">
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

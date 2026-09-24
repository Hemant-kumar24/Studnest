import {
  FaCalendarAlt,
  FaCheck,
  FaTrash,
  FaUser,
} from "react-icons/fa";

import NotificationTypeBadge from "./NotificationTypeBadge";

export default function NotificationCard({
  notification,
  onRead,
  onDelete,
}) {
  const isRead = Boolean(notification?.isRead);

  const recipient =
    notification?.userId?.name ||
    notification?.user?.name ||
    (typeof notification?.userId === "string"
      ? notification.userId
      : "All students");

  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm transition ${
        isRead
          ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          : "border-indigo-200 bg-indigo-50/40 dark:border-indigo-900/60 dark:bg-indigo-950/20"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`break-words ${
                isRead
                  ? "font-semibold text-slate-800 dark:text-slate-200"
                  : "font-bold text-slate-900 dark:text-white"
              }`}
            >
              {notification?.title || "Notification"}
            </h3>

            {!isRead && (
              <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Unread
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {notification?.message || "—"}
          </p>
        </div>

        <NotificationTypeBadge type={notification?.type} />
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <FaUser />
            {recipient}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <FaCalendarAlt />
            {notification?.createdAt
              ? new Date(notification.createdAt).toLocaleString("en-IN")
              : "—"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isRead && onRead && (
            <button
              type="button"
              onClick={() => onRead(notification._id)}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-400"
            >
              <FaCheck />
              Mark read
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(notification._id)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:bg-slate-900 dark:text-red-400"
            >
              <FaTrash />
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

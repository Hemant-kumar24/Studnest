import { Link } from "react-router-dom";
import {
  FaBell,
  FaCalendarCheck,
  FaCheck,
  FaChevronRight,
  FaCommentAlt,
  FaCreditCard,
  FaExclamationTriangle,
  FaTrash,
} from "react-icons/fa";

const getNotificationIcon = (type) => {
  switch (String(type || "").toLowerCase()) {
    case "booking":
      return FaCalendarCheck;
    case "payment":
      return FaCreditCard;
    case "complaint":
      return FaExclamationTriangle;
    case "review":
      return FaCommentAlt;
    default:
      return FaBell;
  }
};

const getLink = (notification) => {
  if (notification?.link) return notification.link;

  const data = notification?.data || {};

  if (data.link) return data.link;

  if (data.bookingId) {
    return `/student/bookings/${data.bookingId}`;
  }

  if (data.complaintId) {
    return `/student/complaints/${data.complaintId}`;
  }

  if (data.hostelId) {
    return `/student/hostels/${data.hostelId}`;
  }

  return null;
};

export default function NotificationItem({
  notification,
  onRead,
  onDelete,
}) {
  const isRead = Boolean(notification?.isRead);
  const link = getLink(notification);
  const Icon = getNotificationIcon(notification?.type);

  const handleOpen = () => {
    if (!isRead && onRead) {
      onRead(notification._id);
    }
  };

  const content = (
    <>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          isRead
            ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        }`}
      >
        <Icon />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`break-words text-sm ${
              isRead
                ? "font-semibold text-slate-700 dark:text-slate-300"
                : "font-bold text-slate-900 dark:text-white"
            }`}
          >
            {notification?.title || notification?.type || "Notification"}
          </h3>

          {!isRead && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              New
            </span>
          )}
        </div>

        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {notification?.message || "You have a new notification."}
        </p>

        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {notification?.createdAt
            ? new Date(notification.createdAt).toLocaleString("en-IN")
            : ""}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {!isRead && (
          <button
            type="button"
            title="Mark as read"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onRead?.(notification._id);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
          >
            <FaCheck />
          </button>
        )}

        <button
          type="button"
          title="Delete notification"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDelete?.(notification._id);
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        >
          <FaTrash />
        </button>

        {link && (
          <FaChevronRight className="ml-1 text-xs text-slate-300 dark:text-slate-600" />
        )}
      </div>
    </>
  );

  const className = `group flex items-start gap-4 rounded-2xl border p-4 shadow-sm transition ${
    isRead
      ? "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
      : "border-indigo-200 bg-indigo-50/40 shadow-indigo-100/50 hover:border-indigo-300 dark:border-indigo-900/60 dark:bg-indigo-950/20 dark:hover:border-indigo-800"
  }`;

  if (link) {
    return (
      <Link
        to={link}
        onClick={handleOpen}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <article className={className}>
      {content}
    </article>
  );
}

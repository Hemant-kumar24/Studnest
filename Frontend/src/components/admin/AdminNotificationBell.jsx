import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";

import adminNotificationService from "../../services/adminNotificationService";

export default function AdminNotificationBell() {
  const [count, setCount] = useState(0);

  const loadCount = useCallback(async () => {
    try {
      const response =
        await adminNotificationService.getUnreadNotificationCount();

      const data = response?.data || response || {};

      const value =
        typeof data === "number"
          ? data
          : data.count ??
            data.unreadCount ??
            data.data?.count ??
            data.data?.unreadCount ??
            0;

      setCount(Math.max(0, Number(value) || 0));
    } catch {
      // Keep the bell usable if the count endpoint temporarily fails.
      setCount(0);
    }
  }, []);

  useEffect(() => {
    loadCount();

    const interval = setInterval(loadCount, 60000);

    return () => clearInterval(interval);
  }, [loadCount]);

  return (
    <Link
      to="/admin/notifications"
      aria-label={`Admin notifications${count > 0 ? `, ${count} unread` : ""}`}
      title={count > 0 ? `${count} unread notifications` : "Notifications"}
      className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-slate-600 transition-colors hover:border-slate-200 hover:bg-slate-100 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-indigo-300 dark:focus-visible:ring-offset-slate-950"
    >
      <FaBell className="text-lg" aria-hidden="true" />

      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold leading-none text-white dark:border-slate-900">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

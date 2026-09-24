import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";

import { getUnreadNotificationCount } from "../../services/notificationService";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  const loadCount = async () => {
    try {
      const response = await getUnreadNotificationCount();

      const data = response.data || {};

      const value =
        typeof data === "number"
          ? data
          : data.count ??
            data.unreadCount ??
            data.data?.count ??
            data.data?.unreadCount ??
            0;

      setCount(Number(value) || 0);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    loadCount();

    const interval = setInterval(loadCount, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      to="/student/notifications"
      aria-label={`Notifications${count > 0 ? `, ${count} unread` : ""}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10"
    >
      <FaBell className="text-lg" />

      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-indigo-900 bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

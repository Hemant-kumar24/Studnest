import React, { useEffect, useState } from "react";
import api from "../../../utils/axiosInstance";

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/user/notifications");
      setItems(res.data || []);
    } catch (e) {
      console.error("Failed to load notifications", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/user/notifications/${id}/read`);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (e) {
      console.error("Failed to mark read", e);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      {loading ? (
        <div className="text-gray-600 dark:text-gray-300">Loading…</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
          {items.map((n) => (
            <div
              key={n._id}
              className={`p-4 ${n.read ? "bg-white dark:bg-gray-800" : "bg-indigo-50 dark:bg-indigo-900/20"}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-800 dark:text-gray-200">{n.text}</p>
                {!n.read && (
                  <button onClick={() => markRead(n._id)} className="text-sm text-indigo-600">Mark read</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
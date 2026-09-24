import api from "../api/axios";

const adminNotificationService = {
  getNotifications: async (params = {}) => {
    const res = await api.get("/admin/notifications", { params });
    return res.data;
  },

  getUnreadNotificationCount: async () => {
    const res = await api.get("/admin/notifications/unread-count");
    return res.data;
  },

  markNotificationRead: async (id) => {
    const res = await api.patch(`/admin/notifications/${id}/read`);
    return res.data;
  },

  markAllNotificationsRead: async () => {
    const res = await api.patch("/admin/notifications/read-all");
    return res.data;
  },

  deleteNotification: async (id) => {
    const res = await api.delete(`/admin/notifications/${id}`);
    return res.data;
  },
};

export default adminNotificationService;

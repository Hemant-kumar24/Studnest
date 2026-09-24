import api from "../api/axios";

const adminSystemService = {
  getSettings: async () => {
    const res = await api.get("/admin/settings");
    return res.data;
  },

  updateSettings: async (payload) => {
    const res = await api.put("/admin/settings", payload);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get("/admin/profile");
    return res.data;
  },

  updateProfile: async (payload) => {
    const res = await api.put("/admin/profile", payload);
    return res.data;
  },

  changePassword: async (payload) => {
    const res = await api.put(
      "/admin/profile/password",
      payload
    );

    return res.data;
  },
};

export default adminSystemService;
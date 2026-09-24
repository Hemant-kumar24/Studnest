import api from "../api/axios";

const adminPaymentService = {
  getPayments: async (params = {}) => {
    const res = await api.get("/admin/payments", { params });
    return res.data;
  },

  getPaymentById: async (id) => {
    const res = await api.get(`/admin/payments/${id}`);
    return res.data;
  },

  getRevenueSummary: async (params = {}) => {
    const res = await api.get("/admin/payments/revenue-summary", { params });
    return res.data;
  },
};

export default adminPaymentService;

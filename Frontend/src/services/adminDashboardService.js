import api from "../api/axios";

export const getDashboardOverview = () => api.get("/admin/dashboard/overview");
export const getBookingAnalytics = (params = {}) => api.get("/admin/dashboard/bookings", { params });
export const getRevenueAnalytics = (params = {}) => api.get("/admin/dashboard/revenue", { params });
export const getOccupancyAnalytics = (params = {}) => api.get("/admin/dashboard/occupancy", { params });
export const getHostelAnalytics = (params = {}) => api.get("/admin/dashboard/hostels", { params });
export const getRecentBookings = (params = {}) => api.get("/admin/dashboard/recent-bookings", { params });
export const getComplaintAnalytics = (params = {}) => api.get("/admin/dashboard/complaints", { params });

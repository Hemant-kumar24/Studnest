import api from "../api/axios";

export const registerStudent = (data) => api.post("/auth/student/register", data);
export const loginStudent = (data) => api.post("/auth/student/login", data);
export const checkEmail = (email) => api.post("/auth/check-email", { email });

/**
 * src/utils/axiosInstance.js
 *
 * Legacy Axios import path.
 * Reuses the shared Axios instance from src/api/axios.js
 * so the API URL and authentication interceptors stay consistent.
 */

export { default } from "../api/axios";
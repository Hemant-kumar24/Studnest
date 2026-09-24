// src/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://studnest-backend.onrender.com/api', // ✅ Production backend URL
});

export default API;

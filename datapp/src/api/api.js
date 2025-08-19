import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
//  withCredentials: true, // optional if you need cookies
});

// Add a request interceptor to attach JWT only when available and needed
api.interceptors.request.use((config) => {
  // Skip adding Authorization header for login and register
  if (!config.url.includes("/auth/login/") && !config.url.includes("/auth/register/")) {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
   
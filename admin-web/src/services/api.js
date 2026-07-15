import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize API success flags for legacy and new endpoints
api.interceptors.response.use(
  (response) => {
    if (response?.data) {
      response.data.success = response.data.status ?? response.data.success;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/welcome";
    }
    return Promise.reject(error);
  },
);

export default api;

import axios from "axios";
import { getAccessToken } from "./auth/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.0.19:3000/api",
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

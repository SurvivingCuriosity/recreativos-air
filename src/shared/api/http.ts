import axios from "axios";
import { getAccessToken } from "./auth/authStorage";

const BASE_URL =
  import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "http://192.168.0.19:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

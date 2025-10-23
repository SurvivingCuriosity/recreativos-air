import axios from "axios";
import { getAccessToken } from "./auth/authStorage";

const BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : "http://192.168.0.19:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Inyectar token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export type ErrorResponse = {
  message: string;
  status: number;
  data: unknown;
  backendError: boolean;
};

// Interceptor de respuesta global
api.interceptors.response.use(
  (response) => response, // pasa si todo va bien
  (error) => {
    // Capturamos respuesta del backend si existe
    const res = error.response?.data;

    // Si la API devuelve su propio formato de error, lo reempaquetamos
    if (res?.message || res?.error) {
      return Promise.reject({
        message: res.message || "Error desconocido del servidor",
        status: res.statusCode || error.response?.status,
        data: res.data ?? null,
        backendError: true,
      } as ErrorResponse);
    }

    // Si no hay info del backend, devolvemos el error genérico
    return Promise.reject({
      message: error.message || "Error de red o servidor no disponible",
      status: error.response?.status,
      backendError: false,
    } as ErrorResponse);
  }
);

export default api;

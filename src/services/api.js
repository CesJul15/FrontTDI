// ============================================================
// CLIENTE HTTP (AXIOS)
// ============================================================
// Este archivo configura Axios para comunicarse con el backend
// Maneja tokens JWT automáticamente en cada petición

import axios from "axios";

// URL base del backend
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");
// Crear instancia de axios con la URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para obtener URLs de imágenes/media
export const getMediaUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

// ============================================================
// INTERCEPTOR DE PETICIÓN
// ============================================================
// Antes de enviar cada petición al backend:
// - Lee el token JWT del localStorage
// - Lo agrega al header Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================
// INTERCEPTOR DE RESPUESTA
// ============================================================
// Si el backend devuelve error 401 (no autorizado):
// - Elimina los tokens del navegador
// - Redirige al login
// Esto asegura que usuario con token expirado vuelva a iniciar sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado o no válido
      localStorage.removeItem("jwt_access");
      localStorage.removeItem("jwt_refresh");
      localStorage.removeItem("user_role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

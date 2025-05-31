// src/config/api.js
export const API_CONFIG = {
  BASE_URL: "http://localhost:8080",
  AUTH: "/auth",
  USERS: "/users",
  APPOINTMENTS: "/appointments"
};

// Ili pojedinačne konstante ako preferirate
export const API_BASE_URL = "http://localhost:8080";
export const AUTH_API_URL = `${API_BASE_URL}/auth`;
export const USERS_API_URL = `${API_BASE_URL}/users`;
export const APPOINTMENTS_API_URL = `${API_BASE_URL}/appointments`;
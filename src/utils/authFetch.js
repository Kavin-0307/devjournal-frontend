// src/utils/authFetch.js
const API_BASE = import.meta.env.VITE_API_BASE_URL; // ✅ must match LoginPage

export default function authFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const url = path.startsWith("http")
    ? path
    : `${API_BASE}${path}`;

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
}

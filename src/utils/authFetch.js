// src/utils/authFetch.js
const API_BASE = import.meta.env.VITE_API_BASE; // e.g. https://your-backend.onrender.com

export default function authFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const token = localStorage.getItem('token');
  return fetch(url, {
    credentials: 'include',
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
}

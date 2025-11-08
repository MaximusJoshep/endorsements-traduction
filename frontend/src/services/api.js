import axios from 'axios';

// Frontend en React - Configuración del API
// Por defecto apunta a localhost:3000, pero puede configurarse con REACT_APP_API_URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL.replace('/v1', '')}/auth/login`, {
    username,
    password,
  });
  return response.data;
};

export const translateEndorse = async (formData, token) => {
  const response = await api.post('/endorse/translate', formData);
  return response.data;
};

export default api;


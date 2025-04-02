import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    originalRequest._retry = true;
    
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }
    
    isRefreshing = true;
    
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      
      const response = await refreshApi.post("/api/token/refresh/", {
        refresh: refreshToken
      });
      
      const { access, refresh } = response.data;
      
      localStorage.setItem(ACCESS_TOKEN, access);
      if (refresh) { 
        localStorage.setItem(REFRESH_TOKEN, refresh);
      }
      
      originalRequest.headers.Authorization = `Bearer ${access}`;
      api.defaults.headers.common.Authorization = `Bearer ${access}`;
      
      processQueue(null, access);
      
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
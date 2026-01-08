import axios from 'axios';
import type { QueueItem } from '../types/utils';

// Get API URL from environment variable
// In production (Vercel), use relative path which will be proxied
// In development, use full URL (localhost)
const API_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance
const api = axios.create({
    baseURL: API_URL ? `${API_URL}/api` : '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});


// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor - Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('zenith_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors and refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't intercept auth endpoints (login, register, refresh)
        const isAuthEndpoint = originalRequest.url?.includes('/Auth/login') ||
            originalRequest.url?.includes('/Auth/register') ||
            originalRequest.url?.includes('/Auth/refresh');

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('zenith_refresh_token');

            if (!refreshToken) {
                // No refresh token, logout only if not on auth pages
                localStorage.removeItem('zenith_token');
                localStorage.removeItem('zenith_refresh_token');
                localStorage.removeItem('zenith_user');

                // Only redirect if not already on login/register page
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${api.defaults.baseURL}/Auth/refresh`,
                    { refreshToken },
                    { withCredentials: true }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Save new tokens
                localStorage.setItem('zenith_token', accessToken);
                if (newRefreshToken) {
                    localStorage.setItem('zenith_refresh_token', newRefreshToken);
                }

                // Update authorization header
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Process queued requests
                processQueue(null, accessToken);

                isRefreshing = false;

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;

                // Refresh failed, logout only if not on auth pages
                localStorage.removeItem('zenith_token');
                localStorage.removeItem('zenith_refresh_token');
                localStorage.removeItem('zenith_user');

                // Only redirect if not already on login/register page
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

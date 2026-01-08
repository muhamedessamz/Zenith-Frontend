import { create } from 'zustand';
import api from '../lib/axios';

interface User {
    id: string; // Added ID
    email: string;
    displayName: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
}


interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
    refreshSession: () => Promise<void>;
    setUser: (user: User, token: string) => void;
    clearError: () => void;
}

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('zenith_user') || 'null'),
    token: localStorage.getItem('zenith_token'),
    isAuthenticated: !!localStorage.getItem('zenith_token'),
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/Auth/login', { email, password });
            const { accessToken, refreshToken, user: userData } = response.data;

            // Profile pictures will use relative paths (proxied through Vercel)
            const user = {
                id: userData.id,
                email: userData.email,
                displayName: `${userData.firstName} ${userData.lastName}`,
                firstName: userData.firstName,
                lastName: userData.lastName,
                profilePicture: userData.profilePicture // Keep as-is (relative path)
            };

            localStorage.setItem('zenith_token', accessToken);
            localStorage.setItem('zenith_refresh_token', refreshToken);
            localStorage.setItem('zenith_user', JSON.stringify(user));

            set({
                user,
                token: accessToken,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
            return true; // Success
        } catch (error: any) {
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                error.response?.data?.title ||
                'Login failed. Please check your credentials and try again.';
            set({
                error: errorMessage,
                isLoading: false
            });
            return false; // Failed
        }
    },

    register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/Auth/register', {
                ...data,
                confirmPassword: data.password, // Backend requires confirmPassword
            });
            set({ isLoading: false, error: null });
            return true; // Success
        } catch (error: any) {
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                error.response?.data?.title ||
                'Registration failed. Please try again.';
            set({
                error: errorMessage,
                isLoading: false
            });
            return false; // Failed
        }
    },

    logout: () => {
        localStorage.removeItem('zenith_token');
        localStorage.removeItem('zenith_refresh_token');
        localStorage.removeItem('zenith_user');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null
        });
    },

    refreshSession: async () => {
        try {
            const response = await api.get('/Users/me');
            const userData = response.data;

            // Profile pictures use relative paths (proxied through Vercel)
            localStorage.setItem('zenith_user', JSON.stringify(userData));
            set({ user: userData });
        } catch (error) {
            console.error('Failed to refresh session:', error);
        }
    },

    setUser: (user: User, token: string) => {
        localStorage.setItem('zenith_token', token);
        localStorage.setItem('zenith_user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
    },

    clearError: () => set({ error: null }),
}));

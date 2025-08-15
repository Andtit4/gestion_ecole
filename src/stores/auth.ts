// src/stores/auth.ts
import { defineStore } from 'pinia';
// import {  } from '@/services/api';
import router from '@/router';
import apiClient from '@/services/api';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false
  }),

  getters: {
    currentUser: (state) => state.user,
    isStudent: (state) => state.user?.role === 'STUDENT',
    isAdmin: (state) => state.user?.role === 'ADMIN',
    // ... autres getters
  },

  actions: {
    async login(credentials: { email: string; password: string; tenantId: string; role?: string }) {
      try {
        let endpoint = '/users/login';
        if (credentials.role === 'STUDENT') {
          endpoint = '/users/students/login';
        }

        const response = await apiClient.post(endpoint, {
          email: credentials.email,
          password: credentials.password,
          tenantId: credentials.tenantId
        });

        const { user, token } = response.data;

        this.user = user;
        this.token = token;
        this.isAuthenticated = true;

        // Stocker le token
        localStorage.setItem('token', token);
        
        // Configurer l'en-tête d'autorisation pour les requêtes futures
        // apiClient.
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return user;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      router.push('/login');
    },

    // ... autres actions
  }
});
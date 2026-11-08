import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'annotator' | 'reviewer';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.login(email, password);
          localStorage.setItem('token', data.access_token);
          set({ token: data.access_token });
          
          const user = await api.getMe();
          set({ user, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, error: null });
      },

      fetchMe: async () => {
        try {
          const user = await api.getMe();
          set({ user });
        } catch (err) {
          localStorage.removeItem('token');
          set({ user: null, token: null });
        }
      }
    }),
    {
      name: 'labelforge-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

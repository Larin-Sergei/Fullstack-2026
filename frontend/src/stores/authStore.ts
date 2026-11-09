
import { create } from "zustand";

import type { User } from "../types";
import * as authApi from "../api/auth";

import { useTaskStore } from "./taskStore";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("access_token"),
  isAuthenticated: Boolean(localStorage.getItem("access_token")),
  isLoading: false,
  isInitialized: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const result = await authApi.login({ email, password });

      localStorage.setItem("access_token", result.access_token);

      set({
        token: result.access_token,
        isAuthenticated: true,
      });

      const user = await authApi.getCurrentUser();

      set({
        user,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      localStorage.removeItem("access_token");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: "Не удалось войти. Проверьте email и пароль.",
      });

      throw error;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });

    try {
      await authApi.register({ username, email, password });
      await useAuthStore.getState().login(email, password);
    } catch (error) {
      set({
        isLoading: false,
        isInitialized: true,
        error: "Не удалось зарегистрироваться. Возможно, email уже используется.",
      });

      throw error;
    }
  },

  fetchUser: async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
      return;
    }

    set({ isLoading: true });

    try {
      const user = await authApi.getCurrentUser();

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } catch {
      localStorage.removeItem("access_token");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    useTaskStore.getState().clearTasks();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isInitialized: true,
    });
  },
}));

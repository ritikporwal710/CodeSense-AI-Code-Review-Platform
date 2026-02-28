import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { AuthUser } from "@/types/auth";
import api from "@/lib/api";

interface AuthStoreState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser | null) => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      signIn: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const { data } = await api.post("/api/auth/login", {
            email,
            password,
          });
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            loading: false,
          });
          toast.success(`Welcome back, ${data.user.name}!`);
          return true;
        } catch (error: unknown) {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Sign in failed";
          set({ error: message, loading: false });
          toast.error(message);
          return false;
        }
      },

      signUp: async (email, password, name) => {
        try {
          set({ loading: true, error: null });
          const { data } = await api.post("/api/auth/register", {
            email,
            password,
            name,
          });
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            loading: false,
          });
          toast.success(`Welcome to AI Code Review, ${data.user.name}!`);
          return true;
        } catch (error: unknown) {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Registration failed";
          set({ error: message, loading: false });
          toast.error(message);
          return false;
        }
      },

      logout: () => {
        const { refreshToken } = get();
        if (refreshToken) {
          api.post("/api/auth/logout", { refreshToken }).catch(() => {});
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
        toast.success("Logged out successfully");
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

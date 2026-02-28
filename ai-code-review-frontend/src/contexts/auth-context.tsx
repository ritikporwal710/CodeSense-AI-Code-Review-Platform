import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useAuthStore } from "@/store/authStore";
import type { AuthUser } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const store = useAuthStore();

  return (
    <AuthContext.Provider
      value={{
        user: store.user,
        isAuthenticated: store.isAuthenticated,
        isLoading: store.loading,
        signIn: store.signIn,
        signUp: store.signUp,
        logout: store.logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

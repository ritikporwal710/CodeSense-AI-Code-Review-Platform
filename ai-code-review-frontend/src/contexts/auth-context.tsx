import type { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { AuthContext } from "./auth-context-defs";

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

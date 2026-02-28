import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.loading,
    loading: store.loading,
    error: store.error,
    signIn: store.signIn,
    signUp: store.signUp,
    logout: store.logout,
  };
};

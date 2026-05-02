import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const loading = false; 

  return { user, loading, login, logout, isAuthenticated };
};

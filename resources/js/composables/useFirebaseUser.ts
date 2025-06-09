import { useAuthStore } from '@/stores/authStore';

export const useFirebaseUser = () => {
  const authStore = useAuthStore();

  // Make sure init is called only once
  if (!authStore.user && !authStore.loading) {
    authStore.init();
  }

  return {
    firebaseUser: authStore.user,
    idToken: authStore.idToken,
    logout: authStore.logout,
  };
};


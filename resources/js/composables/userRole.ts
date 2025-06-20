import { ref, watchEffect } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // adjust path if needed

export function useUserRole() {
  const role = ref<string | null>(null);
  const isAdmin = ref(false);
  const isEditor = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore();

  const fetchUserRole = async () => {
    const uid = authStore.user?.uid;
    if (!uid) {
      throw new Error("User UID is not available.");
    }
  
    loading.value = true;
    error.value = null;
  
    try {
      const response = await axios.get(route('proxy.get'), {
        params: { endpoint: `users/${uid}` },
      });
  
      role.value = response.data.data.role;
      isAdmin.value = role.value === 'admin';
      isEditor.value = role.value === 'editor';
    } catch (err: any) {
      console.error("[User Role] Fetch Error:", err);
      error.value = err.response?.data?.message || 'Failed to fetch user role';
    } finally {
      loading.value = false;
    }
  };  

  // Auto-fetch role when user logs in
  watchEffect(() => {
    if (authStore.user?.uid) {
      fetchUserRole();
    }
  });

  return {
    role,
    isAdmin,
    isEditor,
    loading,
    error,
    fetchUserRole,
  };
}

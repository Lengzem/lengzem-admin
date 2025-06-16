<template>
  <AppLayout :breadcrumbs="breadcrumbs">

    <Head title="Profile" />

    <SettingsLayout>
      <div class="max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <!-- Glassmorphism Card Container -->
        <div
          class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/30">
          <!-- Profile Header with Gradient Background -->
          <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white relative">
            <div class="absolute inset-0 bg-noise opacity-10"></div>
            <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <!-- Avatar with Neon Effect -->
              <div class="relative group">
                <div
                  class="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                </div>

                <!-- Conditional Profile Image -->
                <div v-if="user.profile_image_url"
                  class="relative h-32 w-32 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-xl border-4 border-white/30">
                  <img :src="user.profile_image_url" alt="Profile" class="object-cover w-full h-full rounded-full" />
                </div>

                <!-- Fallback Initials -->
                <div v-else
                  class="relative h-32 w-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-5xl font-bold text-indigo-600 dark:text-indigo-300 shadow-xl border-4 border-white/30">
                  {{ getInitials(user.name) }}
                </div>
              </div>
              <div class="text-center md:text-left">
                <h1 class="text-3xl font-bold tracking-tight mb-2">{{ user.name }}</h1>
                <p class="text-indigo-100 font-medium">{{ user.email }}</p>
                <div class="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <span
                    class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clip-rule="evenodd"></path>
                    </svg>
                    Member since {{ formatDate(user.created_at) }}
                  </span>
                  <span v-if="user.role"
                    class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {{ user.role }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-12 flex justify-center items-center">
            <div class="space-y-4 text-center">
              <div class="relative mx-auto w-12 h-12">
                <div class="w-full h-full rounded-full border-4 border-purple-500 border-t-transparent animate-spin">
                </div>
                <div
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full animate-pulse">
                </div>
              </div>
              <p class="text-gray-500 dark:text-gray-400 font-medium">Loading your profile...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="p-8">
            <div
              class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 p-6 rounded-xl border border-red-200 dark:border-red-700/50">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-10 w-10 text-red-500 dark:text-red-300" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-red-800 dark:text-red-100">Profile load failed</h3>
                  <div class="mt-2 text-red-700 dark:text-red-300">
                    <p>{{ error }}</p>
                  </div>
                  <div class="mt-4">
                    <button @click="retryLoad"
                      class="text-sm font-medium text-red-700 dark:text-red-200 hover:text-red-600 dark:hover:text-red-100">
                      <span aria-hidden="true">⟳</span> Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Content -->
          <div v-else
            class="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700/50">
            <!-- Personal Information Section -->
            <div class="p-8 lg:col-span-2">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Personal Information</h2>
              </div>

              <div class="space-y-6">
                <!-- Information Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Contact</h3>
                    <p class="text-gray-800 dark:text-gray-200 font-medium flex items-center">
                      <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {{ user.email }}
                    </p>
                    <p v-if="user.phone" class="mt-3 text-gray-800 dark:text-gray-200 font-medium flex items-center">
                      <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {{ user.phone }}
                    </p>
                    <p v-else class="mt-3 text-gray-500 dark:text-gray-400 text-sm italic">No phone number provided</p>
                  </div>

                  <div
                    class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Account Details</h3>
                    <p class="text-gray-800 dark:text-gray-200 font-medium flex items-center">
                      <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      {{ user.role || 'Standard User' }}
                    </p>
                  </div>
                </div>

                <!-- Bio Section -->
                <div
                  class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                  <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">UID
                  </h3>
                  <div v-if="user.id" class="prose prose-sm dark:prose-invert max-w-none">
                    <p class="text-gray-800 dark:text-gray-200">{{ user.id }}</p>
                  </div>
                  <div v-else class="text-center py-4">
                    <p class="text-gray-500 dark:text-gray-400 italic">No uid added yet</p>
                    <button @click="openEditPro"
                      class="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Add a id</button>
                  </div>
                </div>

                <!-- Bio Section -->
                <div
                  class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                  <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Biography</h3>
                  <div v-if="user.bio" class="prose prose-sm dark:prose-invert max-w-none">
                    <p class="text-gray-800 dark:text-gray-200">{{ user.bio }}</p>
                  </div>
                  <div v-else class="text-center py-4">
                    <p class="text-gray-500 dark:text-gray-400 italic">No bio added yet</p>
                    <button @click="openEditPro"
                      class="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Add a bio</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions Sidebar -->
            <div class="p-8 bg-gray-50/50 dark:bg-gray-800/30">
              <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6">Account Actions</h2>

              <div class="space-y-4">
                <button @click="openEditPro(user.id)"
                  class="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors">
                  <div class="flex items-center">
                    <div class="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg mr-3">
                      <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <span class="font-medium text-gray-800 dark:text-gray-200">Edit Profile</span>
                  </div>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <LogoutBut class="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
    <ProfileEditModal :is-visible="showProfileEditModal" :user-id="editingProfileId" @close="closeProfileEditModal"
      @saved="handleProfileSaved" />
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { Head } from '@inertiajs/vue3';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { type BreadcrumbItem } from '@/types';
import LogoutBut from '@/components/ui/button/Logout.vue';
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios'; // Use your configured axios instance
import ProfileEditModal from '@/components/EditUserCom.vue';

const toast = useToast();
const authStore = useAuthStore();

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Profile settings', href: '/settings/profile' },
];

const user = ref<any>({}); // Use `any` for flexibility or define a strict user type
const loading = ref(true);
const error = ref<string | null>(null);

// --- NEW: State for the Edit Modal ---
const showProfileEditModal = ref(false);
const editingProfileId = ref<string | null>(null);

const isAccountComplete = computed(() =>
  !!user.value.phone && !!user.value.role
);

function getInitials(name?: string | null) {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

function formatDate(dateStr: string) {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// --- NEW: Reusable function to load profile data ---
const loadProfileData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const uid = authStore.user?.uid;
    if (!uid) {
      throw new Error("User UID is not available.");
    }

    const res = await axios.get(route('proxy.get'), {
      params: { endpoint: `users/${uid}` },
    });

    user.value = res.data.data;
  } catch (err: any) {
    const message = err.response?.data?.message || 'An unexpected error occurred while loading your profile.';
    error.value = message;
    toast.error(message);
    console.error('User fetch error:', err);
  } finally {
    loading.value = false;
  }
};

const retryLoad = () => {
  loadProfileData();
};

// --- NEW: Functions to control the modal ---
const openEditPro = () => {
  if (user.value.id) {
    editingProfileId.value = user.value.id;
    showProfileEditModal.value = true;
  } else {
    toast.error("User ID is missing, cannot edit profile.");
  }
};

const closeProfileEditModal = () => {
  showProfileEditModal.value = false;
  editingProfileId.value = null;
};

const handleProfileSaved = () => {
  closeProfileEditModal();
  toast.success("Profile updated! Refreshing data...");
  loadProfileData(); // Reload the profile data to show changes
};

onMounted(async () => {
  await authStore.initAuth();

  if (authStore.isAuthenticated) {
    await loadProfileData();
  } else {
    error.value = 'User not authenticated.';
    toast.error(error.value);
    loading.value = false;
  }
});
</script>

<style scoped>
/* Smooth transitions for all interactive elements */
body {
  transition: background-color 0.3s, color 0.3s;
}

button {
  transition: all 0.2s ease;
}

/* Animation for mode toggle */
@keyframes modeSwitch {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

button:active {
  animation: modeSwitch 0.3s ease;
}
</style>
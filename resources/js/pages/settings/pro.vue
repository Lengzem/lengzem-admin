<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Profile Settings" />

    <SettingsLayout>
      <div class="max-w-4xl mx-auto sm:px-6 lg:px-8 py-8">
        <!-- Header Section -->
        <div class="text-center mb-12">
          <div class="relative inline-block mb-4">
            <h1 class="relative text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              My Profile
            </h1>
          </div>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Profile thlakna leh enna
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-8 h-8 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error"
          class="bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 border border-red-200 dark:border-red-700 p-6 rounded-xl shadow-sm mb-8 text-center">
          <div class="flex justify-center mb-3">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-500 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Something went wrong</h3>
          <p class="text-red-600 dark:text-red-300">{{ error }}</p>
        </div>

        <!-- Profile Content -->
        <div v-else class="space-y-8">
          <!-- Profile Header -->
          <div class="flex flex-col sm:flex-row items-center gap-8 p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
            <div class="relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-75"></div>
              <div class="relative h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/80 dark:to-purple-900/80 flex items-center justify-center text-4xl font-bold text-blue-600 dark:text-blue-300 shadow-lg">
                {{ getInitials(user.name) }}
              </div>
            </div>
            <div class="text-center sm:text-left">
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-1">{{ user.name }}</h2>
              <p class="text-gray-600 dark:text-gray-300 mb-3">{{ user.mail }}</p>
            </div>
          </div>

          <!-- Profile Details -->
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <!-- Phone -->
            <div class="px-6 py-4 flex justify-between">
              <div class="flex items-center gap-3">
                <span class="text-gray-500 dark:text-gray-400">📞</span>
                <span class="font-medium text-gray-700 dark:text-gray-300">Phone</span>
              </div>
              <span class="text-gray-600 dark:text-gray-400">{{ user.call || 'Not available' }}</span>
            </div>

            <!-- Date of Birth (Editable) -->
            <div class="px-6 py-4 flex justify-between items-center">
              <div class="flex items-center gap-3">
                <span class="text-gray-500 dark:text-gray-400">🎂</span>
                <span class="font-medium text-gray-700 dark:text-gray-300">Date of Birth</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-gray-600 dark:text-gray-400">{{ user.dob || 'Not set' }}</span>
                <button @click="openDobEditor"
                  class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                    </path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Other Fields -->
            <div class="px-6 py-4 flex justify-between">
              <div class="flex items-center gap-3">
                <span class="text-gray-500 dark:text-gray-400">🆔</span>
                <span class="font-medium text-gray-700 dark:text-gray-300">UID</span>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ user.uid || 'Not available' }}</span>
            </div>

            <div class="px-6 py-4 flex justify-between">
              <div class="flex items-center gap-3">
                <span class="text-gray-500 dark:text-gray-400">🏡</span>
                <span class="font-medium text-gray-700 dark:text-gray-300">Veng</span>
              </div>
              <span class="text-gray-600 dark:text-gray-400">{{ user.veng || 'Not available' }}</span>
            </div>

            <div class="px-6 py-4 flex justify-between">
              <div class="flex items-center gap-3">
                <span class="text-gray-500 dark:text-gray-400">🌍</span>
                <span class="font-medium text-gray-700 dark:text-gray-300">Khua</span>
              </div>
              <span class="text-gray-600 dark:text-gray-400">{{ user.khua || 'Not available' }}</span>
            </div>

            <div class="px-6 py-4 flex justify-between">
              <div class="flex items-center gap-3">
                <span class="text-gray-500 dark:text-gray-400">📅</span>
                <span class="font-medium text-gray-700 dark:text-gray-300">Member nih hun</span>
              </div>
              <span class="text-gray-600 dark:text-gray-400">{{ formatDate(user.created_date) }}</span>
            </div>
          </div>
        </div>

        <!-- Complete Profile Button -->
        <div class="mt-8 text-center">
          <button @click.prevent="openEditPro"
            class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg shadow transition-colors">
            ✏️ Edit Profile
          </button>
        </div>

        <!-- Logout Button -->
        <div class="mt-8 text-center">
          <LogoutBut />
        </div>
      </div>

      <!-- DOB Edit Modal -->
      <div v-if="showDobEdit"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Pian ni thlakna</h3>
          </div>
          <div class="p-6">
            <input type="date" v-model="newDob"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 flex justify-end gap-3">
            <button @click="showDobEdit = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button @click="updateDob"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </SettingsLayout>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { type BreadcrumbItem } from '@/types';
import LogoutBut from '@/components/ui/button/Logout.vue';
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { router, Head } from '@inertiajs/vue3';
import { useToast } from 'vue-toastification';
import { useProfileEditModal } from '@/composables/useProfileEditModal';

const toast = useToast();
const { openEditPro } = useProfileEditModal();

interface Props {
  status?: string;
}
defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Profile settings', href: '/settings/profile' },
];

const user = ref<{ name: string, mail: string, call?: string, dob?: string, uid?: string, veng?: string, khua?: string, created_at: string }>({ name: '', mail: '', call: '', dob: '', uid: '', veng: '', khua: '', created_at: '' });
const loading = ref(true);
const error = ref<string | null>(null);
const ageRestriction = ref(false); // Default to Kids Mode

const isAccountComplete = computed(() =>
  !!user.value.call && !!user.value.dob && !!user.value.khua && !!user.value.veng
);

function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function setAgeRestriction(isKidMode: boolean) {
  // Block adult mode if user is under 18
  if (!isKidMode && calculateAge(user.value.dob || '') < 18) {
    toast.warning('kum 18 chunglam tan choh Adult mode hman theih a ni!');
    return;
  }

  // Store the opposite of kid mode in localStorage
  ageRestriction.value = !isKidMode;
  localStorage.setItem('age_restriction', JSON.stringify(!isKidMode));
  toast.success(`Switched to ${isKidMode ? 'Kids' : 'Adult'} Mode`);
}

function checkAgeRestriction() {
  const restriction = localStorage.getItem('age_restriction');
  // Default to Kids Mode (false) if no setting exists
  ageRestriction.value = restriction ? JSON.parse(restriction) : false;
  
  // Additionally enforce Kids Mode if user is under 18
  if (user.value.dob && calculateAge(user.value.dob) < 18) {
    ageRestriction.value = false;
    localStorage.setItem('age_restriction', JSON.stringify(false));
  }
}

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

// For DOB editing
const showDobEdit = ref(false);
const newDob = ref('');

function openDobEditor() {
  if (user.value.dob) {
    const date = new Date(user.value.dob);
    newDob.value = date.toISOString().split('T')[0];
  } else {
    newDob.value = '';
  }
  showDobEdit.value = true;
}

async function updateDob() {
  if (!newDob.value || !user.value.uid) {
    toast.error('Date or UID missing');
    return;
  }

  const formattedDob = new Date(newDob.value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  try {
    const response = await axios.get(route('proxy.get'), {
      params: {
        endpoint: 'update-dob',
        uid: user.value.uid,
        dob: formattedDob,
      },
    });

    if (response.data?.status === 'success') {
      user.value.dob = formattedDob;
      toast.success('I Date of Birth dah luh ani!');
      showDobEdit.value = false;
      checkAgeRestriction(); // Recheck age after DOB update
    } else {
      toast.error(response.data.message || 'DOB update dik lo');
    }
  } catch (err) {
    console.error(err);
    toast.error('thil enga maw fel lo a awm');
  }
}

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const uid = firebaseUser.uid;
      try {
        const res = await axios.get(route('proxy.get'), {
          params: {
            endpoint: 'user',
            uid: uid,
          },
        });
        user.value = res.data;
        checkAgeRestriction(); // Check age restriction on mount
      } catch (err) {
        error.value = 'User data a load thei lo. Refresh rawh.';
        toast.error(error.value);
        console.error(err);
      } finally {
        loading.value = false;
      }
    } else {
      error.value = 'I login lo.';
      toast.error(error.value);
      loading.value = false;
    }
  });
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
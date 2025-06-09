<template>
    <transition
      name="modal-backdrop-fade"
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isVisible && userId" 
        class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4 py-6 sm:p-0"
        aria-labelledby="user-modal-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Overlay -->
        <div class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" @click="closeModal" aria-hidden="true"></div>
  
        <!-- Modal Panel -->
        <transition
          name="modal-panel-slide"
          enter-active-class="duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-10 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-10 sm:translate-y-0 sm:scale-95"
        >
          <div 
            ref="modalPanelRef"
            tabindex="-1" 
            class="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all flex flex-col"
            style="max-height: 90vh;"
          >
            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
              <div class="flex items-center">
                <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/50">
                  <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <h3 id="user-modal-title" class="ml-3 text-lg font-semibold text-slate-700 dark:text-slate-200">
                  User Details
                </h3>
              </div>
              <button
                type="button"
                class="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                @click="closeModal"
                aria-label="Close modal"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Scrollable Content -->
            <div class="flex-grow overflow-y-auto custom-scrollbar p-6">
              <div v-if="loading" class="flex justify-center items-center h-40">
                <svg class="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div v-else-if="error" class="text-center py-10">
                <p class="text-red-500 dark:text-red-400 font-semibold">Error loading user details:</p>
                <p class="text-slate-600 dark:text-slate-400 mt-1">{{ error }}</p>
                <button @click="fetchUserDetails" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Retry
                </button>
              </div>
              <div v-else-if="userData" class="space-y-5">
                <div class="flex flex-col sm:flex-row items-center sm:items-start">
                  <img v-if="userData.profile_image_url" :src="userData.profile_image_url" :alt="userData.name" class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                  <div v-else class="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 text-4xl font-semibold mb-4 sm:mb-0 sm:mr-6 flex-shrink-0 shadow-lg">
                    {{ userData.name ? userData.name.charAt(0).toUpperCase() : 'U' }}
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ userData.name }}</h2>
                    <p class="text-sm text-slate-500 dark:text-slate-400">{{ userData.email }}</p>
                    <span :class="['mt-2 px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize', roleClass(userData.role)]">
                      {{ userData.role }}
                    </span>
                  </div>
                </div>
  
                <dl class="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div class="sm:col-span-2" v-if="userData.bio">
                    <dt class="text-sm font-medium text-slate-500 dark:text-slate-400">Bio</dt>
                    <dd class="mt-1 text-sm text-slate-900 dark:text-slate-200 prose dark:prose-invert max-w-none">{{ userData.bio }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-slate-500 dark:text-slate-400">User ID (Numeric)</dt>
                    <dd class="mt-1 text-sm text-slate-900 dark:text-slate-200">{{ userData.num }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-slate-500 dark:text-slate-400">UUID</dt>
                    <dd class="mt-1 text-sm text-slate-900 dark:text-slate-200">{{ userData.id }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-slate-500 dark:text-slate-400">Joined On</dt>
                    <dd class="mt-1 text-sm text-slate-900 dark:text-slate-200">{{ formatDate(userData.created_at) }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-slate-500 dark:text-slate-400">Last Updated</dt>
                    <dd class="mt-1 text-sm text-slate-900 dark:text-slate-200">{{ formatDate(userData.updated_at) }}</dd>
                  </div>
                </dl>
              </div>
              <div v-else class="text-center py-10 text-slate-500 dark:text-slate-400">
                No user data to display.
              </div>
            </div>
  
            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex-shrink-0 flex justify-end">
              <button
                type="button"
                class="form-button-cancel"
                @click="closeModal"
              >
                Close
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, watch, onUnmounted, nextTick } from 'vue';
  import axios from 'axios';
  
  // Assume `route` is globally available
  // const route = (name, params) => `/api/mock/${name.replace('proxy.', '')}${params ? `?endpoint=${params.endpoint}` : '' }`;
  
  
  const props = defineProps({
    isVisible: { type: Boolean, required: true },
    userId: { type: [String, Number, null], default: null },
  });
  
  const emit = defineEmits(['close']);
  
  const modalPanelRef = ref(null);
  const userData = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  const fetchUserDetails = async () => {
    if (!props.userId) {
      userData.value = null;
      error.value = 'No User ID provided.';
      return;
    }
    loading.value = true;
    error.value = null;
    userData.value = null;
  
    try {
      // The endpoint for fetching a single user is usually 'users/{id}'
      // So the proxy endpoint would be 'users/' + props.userId
      const response = await axios.get(route('proxy.get', { endpoint: `users/${props.userId}` }));
      
      if (response.data && response.data.status === true && response.data.data) {
        userData.value = response.data.data; // Assuming the single user object is directly in response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to retrieve user data.');
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      error.value = err.response?.data?.message || err.message || 'An unknown error occurred.';
    } finally {
      loading.value = false;
    }
  };
  
  const closeModal = () => {
    emit('close');
  };
  
  const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return 'Invalid Date'; }
  };
  
  const roleClass = (role) => {
    if (role === 'admin') return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300';
    if (role === 'editor') return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300';
    return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
  };
  
  let originalBodyOverflow = '';
  let firstFocusableElement = null;
  let lastFocusableElement = null;
  
  const focusTrap = (event) => {
    if (event.key !== 'Tab') return;
    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) { lastFocusableElement.focus(); event.preventDefault(); }
    } else {
      if (document.activeElement === lastFocusableElement) { firstFocusableElement.focus(); event.preventDefault(); }
    }
  };
  
  watch(() => [props.isVisible, props.userId], ([newVisible, newUserId]) => {
    if (newVisible && newUserId) {
      originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      fetchUserDetails();
      document.addEventListener('keydown', handleEscapeKey);
      nextTick(() => {
        if (modalPanelRef.value) {
          const focusable = modalPanelRef.value.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (focusable.length) {
            firstFocusableElement = focusable[0];
            lastFocusableElement = focusable[focusable.length - 1];
            firstFocusableElement.focus();
            modalPanelRef.value.addEventListener('keydown', focusTrap);
          } else { // If no focusable elements, focus panel itself
              modalPanelRef.value.focus();
          }
        }
      });
    } else if (!newVisible) {
      document.body.style.overflow = originalBodyOverflow;
      document.removeEventListener('keydown', handleEscapeKey);
      if (modalPanelRef.value) modalPanelRef.value.removeEventListener('keydown', focusTrap);
      firstFocusableElement = null; lastFocusableElement = null;
      userData.value = null; // Clear data when modal closes
      error.value = null;
    }
  }, { immediate: true }); // Use immediate if you might open modal with userId already set
  
  onUnmounted(() => {
    if (document.body.style.overflow === 'hidden') document.body.style.overflow = originalBodyOverflow;
    document.removeEventListener('keydown', handleEscapeKey);
    if (modalPanelRef.value) modalPanelRef.value.removeEventListener('keydown', focusTrap);
  });
  </script>
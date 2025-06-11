<template>
    <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 px-6 py-4 sm:px-8">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
              <svg class="w-6 h-6 mr-3 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.002 9.002 0 008.75-9c0-.854.116-1.685.34-2.478A9.005 9.005 0 0012 3a9.005 9.005 0 00-7.09 3.522A8.99 8.99 0 004.25 12a9.002 9.002 0 007.75 9z" />
              </svg>
              Subscription Management
            </h2>
          </div>
        </div>
              
        <div class="p-4 sm:p-6">
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <!-- Loading/Error/Empty States -->
            <div v-if="loading" class="p-8 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
              <svg class="animate-spin h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading subscriptions...</span>
            </div>
            <div v-else-if="error" class="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
              {{ error }}
            </div>
            <div v-else-if="subscriptions.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
              No subscriptions found.
            </div>
  
            <!-- Subscriptions Table -->
            <div v-else class="overflow-x-auto custom-scrollbar">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Subscriber</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Plan</th>
                    <th scope="col" class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                    <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="sub in subscriptions" :key="sub.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <img class="h-10 w-10 rounded-full object-cover" :src="sub.user?.profile_image_url || defaultAvatar(sub.user?.name)" :alt="sub.user?.name">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ sub.user?.name || 'N/A' }}</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">{{ sub.user?.email || 'No email' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ sub.plan?.name || 'N/A' }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">₹{{ sub.plan?.price || '0.00' }}</div>
                    </td>
                    <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      <div class="flex flex-col">
                        <span>{{ formatDate(sub.start_date) }}</span>
                        <span class="text-xs text-gray-500">to {{ formatDate(sub.end_date) }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span :class="[
                        'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize',
                        sub.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' :
                        sub.status === 'expired' ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300'
                      ]">
                        {{ sub.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button type="button" class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors font-medium">Details</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios'; // Use your configured axios instance
  
  const subscriptions = ref([]);
  const loading = ref(true);
  const error = ref(null);
  
  const fetchSubscriptions = async () => {
    loading.value = true;
    error.value = null;
  
    try {
      const response = await axios.get(route('proxy.get'), {
        params: { endpoint: 'subscriptions' }
      });
      
      // The data is directly in `response.data.data` based on your JSON structure
      if (response.data && response.data.status === true && Array.isArray(response.data.data)) {
        subscriptions.value = response.data.data;
      } else {
        throw new Error("Unexpected data format for subscriptions.");
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      if (err.response?.status === 401) {
        error.value = "You are not authorized. Please log in again.";
      } else {
        error.value = "Failed to load subscriptions. Please try again later.";
      }
    } finally {
      loading.value = false;
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };
  
  const defaultAvatar = (name = 'U') => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&color=A855F7&background=F3E8FF`;
  };
  
  onMounted(() => {
    fetchSubscriptions();
  });
  </script>
<template>
    <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
        <!-- Component Header -->
        <div class="bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 px-6 py-4 sm:px-8">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
              <svg class="w-7 h-7 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.318.232-.656.328-1.014a.75.75 0 011.066.29l2.25 3.375a.75.75 0 01-.29 1.066c-.376.25-.786.448-1.227.571z" /></svg>
              User Search
            </h2>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white/90">
              Admin Tool
            </span>
          </div>
        </div>
  
        <!-- Actions & Search Section -->
        <div class="px-6 pt-6 pb-2 sm:px-8 sm:pt-8">
          <!-- Action Button -->
          <div class="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              type="button"
              @click="toggleSearchInput"
              class="w-full sm:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              :class="{ 'ring-2 ring-offset-2 ring-blue-400 dark:ring-blue-300': showSearchInput }"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>{{ showSearchInput ? 'Hide Search Panel' : 'Search For Users' }}</span>
            </button>
            <button
              type="button"
              @click="openNewUserModal"
              class="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New User</span>
            </button>
          </div>
  
          <!-- Search Input Section with Transition -->
          <transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div v-if="showSearchInput" class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                Find Users
              </h3>
              <div class="relative flex-grow w-full">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  ref="searchInputField"
                  type="text"
                  v-model="searchQuery"
                  placeholder="Enter user name or email to search..."
                  class="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                 <div v-if="isSearching" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
              </div>
  
              <!-- Search Results Area -->
              <div v-if="searchPerformed" class="mt-6">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Search results for: <strong class="text-gray-800 dark:text-gray-200">"{{ lastSearchQuery }}"</strong>
                </p>
                <ul v-if="searchResults.length > 0" class="space-y-3 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/30 custom-scrollbar">
                  <li v-for="user in searchResults" :key="user.id"
                      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 group">
                    <div class="flex items-center justify-between p-3">
                      <div class="flex items-center space-x-4 min-w-0">
                        <img class="h-12 w-12 rounded-full object-cover" :src="user.profile_image_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'U') + '&color=FFFFFF&background=059669'" :alt="user.name">
                        <div class="min-w-0">
                            <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{{ user.name }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user.email }}</p>
                        </div>
                      </div>
                      <span class="ml-4 px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize"
                            :class="user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300'">
                        {{ user.role }}
                      </span>
                    </div>
                  </li>
                </ul>
                <div v-else-if="!isSearching" class="p-6 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  No users found matching your criteria.
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick, watch, onUnmounted } from 'vue';
  import axios from 'axios'; // Use your configured axios instance
  import { useToast } from 'vue-toastification';
  
  const showSearchInput = ref(false);
  const searchQuery = ref('');
  const lastSearchQuery = ref('');
  const searchResults = ref([]);
  const isSearching = ref(false);
  const searchPerformed = ref(false);
  const searchInputField = ref(null);
  const toast = useToast();
  
  let debounceTimer = null;
  
  const toggleSearchInput = async () => {
    showSearchInput.value = !showSearchInput.value;
    if (showSearchInput.value) {
      await nextTick();
      searchInputField.value?.focus();
    } else {
      // Reset search when hiding the panel
      searchQuery.value = '';
      searchResults.value = [];
      searchPerformed.value = false;
    }
  };
  
  const performSearch = async () => {
    const query = searchQuery.value.trim();
    if (!query) {
      searchResults.value = [];
      searchPerformed.value = false;
      return;
    }
  
    isSearching.value = true;
    searchPerformed.value = true;
    lastSearchQuery.value = query;
  
    try {
        const response = await axios.get(route('proxy.get'), {
            params: {
                endpoint: 'users/search', // The endpoint to search for users
                name: query // The query parameter
            }
        });
        searchResults.value = response.data.data || [];
    } catch (error) {
        console.error("Error searching for users:", error);
        toast.error("Failed to search for users. Please try again.");
        searchResults.value = [];
    } finally {
        isSearching.value = false;
    }
  };
  
  // Watch for changes in searchQuery to perform live search
  watch(searchQuery, (newQuery) => {
    clearTimeout(debounceTimer);
    if (newQuery.trim() === '') {
        searchResults.value = [];
        searchPerformed.value = false;
        isSearching.value = false;
        return;
    }
    isSearching.value = true; // Show spinner immediately
    debounceTimer = setTimeout(() => {
        performSearch();
    }, 500); // 500ms debounce delay
  });
  
  // Cleanup timer on component unmount
  onUnmounted(() => {
    clearTimeout(debounceTimer);
  });
  </script>
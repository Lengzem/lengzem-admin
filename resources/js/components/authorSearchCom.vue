<template>
    <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
        <!-- Component Header -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 px-6 py-4 sm:px-8">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
              <svg class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 18.75a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
              </svg>
              Author Management
            </h2>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white/90">
              Lengzem
            </span>
          </div>
        </div>

        <!-- Actions & Search Section -->
        <div class="px-6 pt-6 pb-2 sm:px-8 sm:pt-8">
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              type="button"
              @click="toggleSearchInput"
              class="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              :class="{ 'ring-2 ring-offset-2 ring-blue-400 dark:ring-blue-300': showSearchInput }"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>{{ showSearchInput ? 'Hide Search' : 'Search Author' }}</span>
            </button>
            <button
              type="button"
              @click="openAddAuthorModal"
              class="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Author</span>
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
                <svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 18.75a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
                </svg>
                Find Authors
              </h3>
              <div class="relative flex-grow w-full">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                  ref="searchInputField"
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Enter author name or email to search..." 
                  class="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                />
                 <div v-if="isSearching" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
              </div>

              <!-- Search Results Area -->
              <div v-if="searchPerformed" class="mt-6">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Search results for: <strong class="text-gray-800 dark:text-gray-200">"{{ lastSearchQuery }}"</strong>
                </p>
                <ul v-if="searchResults.length > 0" class="space-y-3 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/30 custom-scrollbar">
                  <li v-for="author in searchResults" :key="author.id"
                      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 group">
                    <div class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <div class="flex items-center space-x-3 min-w-0">
                         <img class="h-10 w-10 rounded-full object-cover flex-shrink-0" :src="author.profile_photo_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(author.name || 'A') + '&color=7F9CF5&background=EBF4FF'" :alt="author.name + ' avatar'">
                        <div class="min-w-0">
                            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ author.name }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ author.email }}</p>
                        </div>
                      </div>
                      <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </li>
                </ul>
                <div v-else-if="!isSearching" class="p-6 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  No authors found matching your criteria.
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Placeholder for Main Author List -->
        <div class="px-6 pb-6 sm:px-8 sm:pb-8" v-if="!showSearchInput || (showSearchInput && !searchPerformed)">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              All Authors (Placeholder)
            </h3>
            <div class="p-6 text-center text-gray-400 dark:text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              A list of all authors would be displayed here.
            </div>
        </div>
      </div>

      <!-- Add/Edit Author Modal -->
      <AuthorModal
        :is-visible="showAuthorModal"
        :author-data="editingAuthor"
        @close="closeAuthorModal"
        @saved="handleAuthorSaved"
      />
    </div>
</template>

<script setup>
import { ref, nextTick, watch, onUnmounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import AuthorModal from './addAuthorsCom.vue';

const authStore = useAuthStore();
const showSearchInput = ref(false);
const searchQuery = ref('');
const lastSearchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const searchPerformed = ref(false);
const searchInputField = ref(null);

const showAuthorModal = ref(false);
const editingAuthor = ref(null);

let debounceTimer = null;

const toggleSearchInput = async () => {
  showSearchInput.value = !showSearchInput.value;
  if (showSearchInput.value) {
    await nextTick();
    searchInputField.value?.focus();
  } else {
    searchQuery.value = '';
    searchResults.value = [];
    searchPerformed.value = false;
  }
};

const performSearch = async () => {
    const query = searchQuery.value.trim();
    if (!query) {
      searchResults.value = [];
      searchPerformed.value = true;
      return;
    }
    
    if (!authStore.token) {
        console.error("Authentication token not found. Please log in.");
        // Optionally show an error to the user
        return;
    }

    isSearching.value = true;
    searchPerformed.value = true;
    lastSearchQuery.value = query;

    try {
        const response = await axios.get(`https://api.lengzem.in/api/authors/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${authStore.token}`,
                'Accept': 'application/json',
            }
        });
        searchResults.value = response.data.data || [];
    } catch (error) {
        console.error("Error searching for authors:", error);
        if (error.response?.status === 401) {
          console.error("Authorization failed. The token might be expired.");
          // You could trigger a logout action here: authStore.logout();
        }
        searchResults.value = [];
    } finally {
        isSearching.value = false;
    }
};

watch(searchQuery, (newQuery) => {
    clearTimeout(debounceTimer);
    if (newQuery.trim() === '') {
        searchResults.value = [];
        searchPerformed.value = false;
        isSearching.value = false;
        return;
    }
    isSearching.value = true;
    debounceTimer = setTimeout(() => {
        performSearch();
    }, 500);
});

onUnmounted(() => {
    clearTimeout(debounceTimer);
});

const openAddAuthorModal = () => {
  editingAuthor.value = null;
  showAuthorModal.value = true;
};

const closeAuthorModal = () => {
  showAuthorModal.value = false;
};

const handleAuthorSaved = (newAuthor) => {
  closeAuthorModal();
  searchQuery.value = newAuthor.name;
  performSearch();
};
</script>
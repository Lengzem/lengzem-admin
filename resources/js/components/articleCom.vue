<template>
  <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <!-- Form Header -->
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 px-6 py-4 sm:px-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Article Management <!-- Updated title -->
          </h2>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white/90">
            Lengzem
          </span>
        </div>
      </div>

      <!-- Form Content -->
      <div class="px-6 py-6 sm:px-8 sm:py-8">
        <form class="space-y-8">
          <!-- Search Section for Show/Season (Placeholder) -->
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
              Search Article
            </h3>
            
            <div class="mb-6">
              <div class="flex flex-col sm:flex-row gap-4 mb-3">
                <div class="relative flex-grow">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="Search by title to find Show/Season..." 
                    class="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <button
                  type="button"
                  @click="performSearch"
                  class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isSearching"
                >
                  <svg v-if="!isSearching" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Search</span>
                </button>
              </div>

              <div v-if="searchResults.length > 0 || searchPerformed">
                <ul class="space-y-3 max-h-72 overflow-y-auto mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/30 custom-scrollbar">
                  <li v-if="searchResults.length === 0 && searchPerformed && !isSearching" class="p-3 text-center text-gray-500 dark:text-gray-400">
                    no article found.
                  </li>
                  <li v-for="item in searchResults" :key="item.id"
                      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 group">
                        <div class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                          <div class="flex items-center space-x-3 min-w-0">
                            <div class="w-10 h-10 flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                              </svg>
                            </div>
                            <div class="min-w-0">
                               <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ item.title }}</p>
                               <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ item.type }}</p>
                            </div>
                          </div>
                          <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                          </svg>
                        </div>
                  </li>
                </ul>
              </div>
            </div>
        </form>
      </div>
    </div>

    <!-- Article Detail Modal -->
    <ArticleDetailModal
      :is-visible="showArticleModal"
      :article-id="selectedArticleId"
      @close="closeArticleViewModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ArticleDetailModal from './articleDetailCom.vue'; 

// Mock API call for Show/Season search (placeholder)
const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const searchPerformed = ref(false);
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    searchPerformed.value = false;
    return;
  }
  isSearching.value = true;
  searchPerformed.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  const mockResults = [
    { id: 1, title: `Result for "${searchQuery.value}" 1`, type: 'Show' },
    { id: 2, title: `Another result for "${searchQuery.value}"`, type: 'Season' },
  ];
  searchResults.value = Math.random() > 0.3 ? mockResults : [];
  isSearching.value = false;
};


onMounted(() => {
});
</script>
<template>
  <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <!-- Component Header -->
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 px-6 py-4 sm:px-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Article Management
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
            <span>{{ showSearchInput ? 'Hide Search' : 'Search Articles' }}</span>
          </button>
          <button
            type="button"
            @click="openAddArticleModal"
            class="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Article</span>
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
              <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
              Find Articles
            </h3>
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <div class="relative flex-grow w-full">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input 
                  ref="searchInputField"
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Enter article title or keywords..." 
                  @keyup.enter="performSearch"
                  class="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <button
                type="button"
                @click="performSearch"
                class="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                :disabled="isSearching || !searchQuery.trim()"
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

            <!-- Search Results Area -->
            <div v-if="searchPerformed" class="mt-6">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Search results for: <strong class="text-gray-800 dark:text-gray-200">"{{ lastSearchQuery }}"</strong>
              </p>
              <ul v-if="searchResults.length > 0" class="space-y-3 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/30 custom-scrollbar">
                <li v-for="item in searchResults" :key="item.id"
                    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 group">
                  <div class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                    <div class="flex items-center space-x-3 min-w-0">
                      <div class="w-10 h-10 flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </div>
                      <div class="min-w-0">
                          <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ item.title }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">ID: {{ item.id }} - {{ item.status }}</p>
                      </div>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </li>
              </ul>
              <div v-else-if="!isSearching" class="p-6 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                No articles found matching your criteria.
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Placeholder for Article List (if any displayed by default) -->
      <!-- You can add your main article list/table here -->
      <div class="px-6 pb-6 sm:px-8 sm:pb-8" v-if="!showSearchInput || (showSearchInput && !searchPerformed)">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Recent Articles (Placeholder)
          </h3>
          <div class="p-6 text-center text-gray-400 dark:text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            Article list would be displayed here.
          </div>
      </div>

    </div>

    <!-- Add Article Modal -->
    <AddArticleModal 
      :is-visible="showAddArticleModal" 
      @close="closeAddArticleModal"
      @article-added="handleArticleAdded"
    />
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
// import axios from 'axios'; // For actual API calls
import AddArticleModal from './addArticleCom.vue'; // Adjust path if needed

const showSearchInput = ref(false);
const searchQuery = ref('');
const lastSearchQuery = ref(''); // To display what was searched for
const searchResults = ref([]);
const isSearching = ref(false);
const searchPerformed = ref(false); // To track if a search has been attempted and display messages accordingly
const searchInputField = ref(null); // Ref for the search input DOM element

const showAddArticleModal = ref(false);

const toggleSearchInput = async () => {
  showSearchInput.value = !showSearchInput.value;
  if (showSearchInput.value) {
    // Focus the input field when it becomes visible
    await nextTick(); // Wait for the DOM to update
    if (searchInputField.value) {
      searchInputField.value.focus();
    }
  } else {
    // Optionally clear search when hiding
    // searchQuery.value = '';
    // searchResults.value = [];
    // searchPerformed.value = false;
  }
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    // searchPerformed.value = false; // Keep true to show "No results" if query was empty then submitted
    return;
  }
  isSearching.value = true;
  searchPerformed.value = true;
  lastSearchQuery.value = searchQuery.value;

  console.log(`Searching for: ${searchQuery.value}`);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Example mock results - replace with actual API call
  const allMockArticles = [
    { id: 1, title: "Vue 3 Composition API", status: "Published" },
    { id: 2, title: "Getting Started with Tailwind CSS", status: "Draft" },
    { id: 3, title: "Advanced Vue Patterns", status: "Published" },
    { id: 4, title: "Understanding Pinia State Management", status: "Review" },
    { id: 5, title: "Nuxt 3 Full Stack Development", status: "Published" },
  ];

  const query = searchQuery.value.toLowerCase();
  searchResults.value = allMockArticles.filter(article => 
    article.title.toLowerCase().includes(query)
  );
  
  isSearching.value = false;
};

// Watch for search input clearing to reset searchPerformed state
watch(searchQuery, (newQuery) => {
  if (newQuery.trim() === '' && searchPerformed.value && !isSearching.value) {
    // If user clears input after a search, reset results display
    searchResults.value = [];
    // searchPerformed.value = false; // Or keep true to show 'No results for ""'
  }
});

const openAddArticleModal = () => {
  showAddArticleModal.value = true;
};

const closeAddArticleModal = () => {
  showAddArticleModal.value = false;
};

const handleArticleAdded = (newArticle) => {
  // Handle the newly added article, e.g., refresh list or add to current view
  console.log('Article added:', newArticle);
  // Potentially close modal and refresh some list
  closeAddArticleModal();
  // If you have a main list of articles, you might want to refresh it here.
  // If search was active, you might want to clear search or re-perform if relevant.
};

</script>
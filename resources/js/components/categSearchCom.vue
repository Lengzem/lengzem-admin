<template>
    <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
        <!-- Component Header -->
        <div class="bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 px-6 py-4 sm:px-8">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
              Category Management
            </h2>
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
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span>{{ showSearchInput ? 'Hide Search' : 'Search Category' }}</span>
            </button>
            <button
              type="button"
              @click="openAddCategoryModal"
              class="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
              <span>Add New Category</span>
            </button>
          </div>
  
          <!-- Search Input Section with Transition -->
          <transition
            enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div v-if="showSearchInput" class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                Find Categories
              </h3>
              <div class="relative flex-grow w-full">
                <input ref="searchInputField" type="text" v-model="searchQuery" placeholder="Enter category name to search..."
                  class="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                 <div v-if="isSearching" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg class="animate-spin h-5 w-5 text-blue-500"></svg>
                </div>
              </div>
  
              <!-- Search Results Area -->
              <div v-if="searchPerformed" class="mt-6">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Search results for: <strong class="text-gray-800 dark:text-gray-200">"{{ lastSearchQuery }}"</strong></p>
                <ul v-if="searchResults.length > 0" class="space-y-3 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/30 custom-scrollbar">
                  <li v-for="category in searchResults" :key="category.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md ...">
                    <div class="flex items-start justify-between p-3">
                      <div class="flex items-center space-x-3 min-w-0">
                        <div class="w-10 h-10 flex-shrink-0 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                          <svg class="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ category.name }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">Slug: {{ category.slug }}</p>
                            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">{{ category.description }}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-else-if="!isSearching" class="p-6 text-center text-gray-500 dark:text-gray-400 border border-dashed ...">
                  No categories found matching your criteria.
                </div>
              </div>
            </div>
          </transition>
        </div>
  
        <!-- Placeholder for Main Category List -->
        <div class="px-6 pb-6 sm:px-8 sm:pb-8" v-if="!showSearchInput || (showSearchInput && !searchPerformed)">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              All Categories (Placeholder)
            </h3>
            <div class="p-6 text-center text-gray-400 dark:text-gray-500 border border-dashed ...">
              A list of all categories would be displayed here.
            </div>
        </div>
      </div>
  
      <!-- Add/Edit Category Modal -->
      <CategoryModal
        :is-visible="showCategoryModal"
        :category-data="editingCategory"
        @close="closeCategoryModal"
        @saved="handleCategorySaved"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick, watch, onUnmounted } from 'vue';
  import axios from 'axios';
  import { useToast } from 'vue-toastification';
  // Import a modal component for categories (assuming you will create/have one)
 // import CategoryModal from './CategoryModal.vue';
  
  const showSearchInput = ref(false);
  const searchQuery = ref('');
  const lastSearchQuery = ref('');
  const searchResults = ref([]);
  const isSearching = ref(false);
  const searchPerformed = ref(false);
  const searchInputField = ref(null);
  const toast = useToast();
  
  const showCategoryModal = ref(false);
  const editingCategory = ref(null);
  
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
      searchPerformed.value = false;
      return;
    }
  
    isSearching.value = true;
    searchPerformed.value = true;
    lastSearchQuery.value = query;
  
    try {
        const response = await axios.get(route('proxy.get'), {
            params: {
                endpoint: 'categories/search',
                name: query
            }
        });
        searchResults.value = response.data.data || [];
    } catch (error) {
        console.error("Error searching for categories:", error);
        toast.error("Failed to search for categories.");
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
  
  const openAddCategoryModal = () => {
    editingCategory.value = null;
    showCategoryModal.value = true;
  };
  
  const closeCategoryModal = () => {
    showCategoryModal.value = false;
  };
  
  const handleCategorySaved = (newCategory) => {
    closeCategoryModal();
    toast.success(`Category "${newCategory.name}" saved successfully!`);
    if (showSearchInput.value) {
      searchQuery.value = newCategory.name;
    } else {
      // Optionally, if you have a main list, you would refresh it here.
    }
  };
  </script>
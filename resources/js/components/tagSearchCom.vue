<template>
  <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <!-- Component Header -->
      <div
        class="bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 px-6 py-4 sm:px-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v5z">
              </path>
            </svg>
            Tag Management
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
          <button type="button" @click="toggleSearchInput"
            class="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            :class="{ 'ring-2 ring-offset-2 ring-blue-400 dark:ring-blue-300': showSearchInput }">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>{{ showSearchInput ? 'Hide Search' : 'Search Tag' }}</span>
          </button>
          <button type="button" @click="openAddTagModal"
            class="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Tag</span>
          </button>
        </div>

        <!-- Search Input Section with Transition -->
        <transition enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95">
          <div v-if="showSearchInput" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v5z">
                </path>
              </svg>
              Find Tags
            </h3>
            <div class="relative flex-grow w-full">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <!-- Search happens automatically on input -->
              <input ref="searchInputField" type="text" v-model="searchQuery" placeholder="Enter tag name to search..."
                class="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200" />
              <div v-if="isSearching" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </div>
            </div>

            <!-- Search Results Area -->
            <div v-if="searchPerformed" class="mt-6">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Search results for: <strong class="text-gray-800 dark:text-gray-200">"{{ lastSearchQuery }}"</strong>
              </p>
              <ul v-if="searchResults.length > 0"
                class="space-y-3 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/30 custom-scrollbar">
                <li v-for="tag in searchResults" :key="tag.id"
                  class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 group">
                  <div
                    class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                    <div class="flex items-center space-x-3 min-w-0">
                      <div
                        class="w-10 h-10 flex-shrink-0 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor"
                          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v5z">
                          </path>
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ tag.name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">Slug: {{ tag.slug }}</p>
                      </div>
                    </div>
                    <!-- NEW: Action Buttons -->
                    <div class="flex-shrink-0 flex items-center space-x-3">
                      <button @click="openTagEditModal(tag.id)"
                        class="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Edit</button>
                      <button @click="openTagDeleteModal(tag.id)"
                        class="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-else-if="!isSearching"
                class="p-6 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                No tags found matching your criteria.
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Placeholder for Main Tag List -->
      <div class="px-6 pb-6 sm:px-8 sm:pb-8" v-if="!showSearchInput || (showSearchInput && !searchPerformed)">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          All Tags (Placeholder)
        </h3>
        <div
          class="p-6 text-center text-gray-400 dark:text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          A list of all tags would be displayed here.
        </div>
      </div>
    </div>

     <!-- Modals -->
     <TagAddModal :is-visible="showTagAddModal" @close="closeAddTagModal" @saved="handleTagSaved" />
    <TagEditModal :is-visible="showTagEditModal" :tag-id="tagToEdit" @close="closeTagEditModal" @saved="handleTagUpdated" />

    <!-- Delete Confirmation Modal -->
<transition
  enter-active-class="ease-out duration-300"
  enter-from-class="opacity-0"
  enter-to-class="opacity-100"
  leave-active-class="ease-in duration-200"
  leave-from-class="opacity-100"
  leave-to-class="opacity-0"
>
  <div v-if="showTagDeleteModal" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <!-- Modal Body -->
            <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                  <!-- Warning Icon -->
                  <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100" id="modal-title">Delete Tag</h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this tag? This action cannot be undone.</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal Footer -->
            <div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button 
                @click="confirmDelete" 
                :disabled="isDeleting" 
                type="button" 
                class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50"
              >
                <span v-if="isDeleting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
                <span v-else>Delete</span>
              </button>
              <button 
                @click="closeTagDeleteModal" 
                type="button" 
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</transition>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onUnmounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import TagAddModal from './tagAddCom.vue';
import TagEditModal from './tagsUpdateCom.vue';

const showSearchInput = ref(false);
const searchQuery = ref('');
const lastSearchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const searchPerformed = ref(false);
const searchInputField = ref(null);
const toast = useToast();

// Modal States
const showTagAddModal = ref(false);
const showTagEditModal = ref(false);
const tagToEdit = ref(null);
const showTagDeleteModal = ref(false);
const tagToDeleteId = ref(null);
const isDeleting = ref(false);

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
    // To prevent showing "No results" for an empty query, we can set searchPerformed to false
    searchPerformed.value = false;
    return;
  }

  isSearching.value = true;
  searchPerformed.value = true;
  lastSearchQuery.value = query;

  try {
      // **MODIFIED LINE**: Using the consistent proxy API call
      const response = await axios.get(route('proxy.get'), {
          params: {
              endpoint: `tags/search`,
              name: query
          }
      });
      searchResults.value = response.data.data.data || [];
  } catch (error) {
      console.error("Error searching for tags:", error);
      searchResults.value = [];
      // Optionally, show an error message to the user here (e.g., using a toast notification)
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
  isSearching.value = true; // Show spinner immediately while waiting for debounce
  debounceTimer = setTimeout(() => {
      performSearch();
  }, 500); // 500ms debounce delay
});

onUnmounted(() => clearTimeout(debounceTimer));

// --- Add Modal Logic ---
const openAddTagModal = () => { showTagAddModal.value = true; };
const closeAddTagModal = () => { showTagAddModal.value = false; };
const handleTagSaved = () => {
  closeAddTagModal();
  toast.success(`Tag created successfully!`);
  if (showSearchInput.value && searchQuery.value) {
    performSearch();
  }
};

// --- Edit Modal Logic ---
const openTagEditModal = (tag) => {
  tagToEdit.value = tag;
  showTagEditModal.value = true;
};
const closeTagEditModal = () => {
  showTagEditModal.value = false;
  tagToEdit.value = null;
};
const handleTagUpdated = () => {
  closeTagEditModal();
  toast.success(`Tag updated successfully!`);
  performSearch(); // Refresh search results
};

// --- Delete Modal Logic ---
const openTagDeleteModal = (tagId) => {
  tagToDeleteId.value = tagId;
  showTagDeleteModal.value = true;
};
const closeTagDeleteModal = () => {
  showTagDeleteModal.value = false;
  tagToDeleteId.value = null;
};
const confirmDelete = async () => {
  if (!tagToDeleteId.value) return;
  isDeleting.value = true;
  try {
    await axios.delete(route('proxy.delete', { endpoint: `tags/${tagToDeleteId.value}` }));
    toast.success('Tag deleted successfully!');
    performSearch(); // Refresh search results
  } catch (error) {
    console.error("Error deleting tag:", error);
    toast.error(error.response?.data?.message || "Failed to delete the tag.");
  } finally {
    isDeleting.value = false;
    closeTagDeleteModal();
  }
};
</script>
<template>
  <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <!-- Component Header -->
      <div
        class="bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 px-6 py-4 sm:px-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688 0-1.25-.562-1.25-1.25s.562-1.25 1.25-1.25 1.25.562 1.25 1.25-.562 1.25-1.25 1.25zM10.34 11.84c-.688 0-1.25-.562-1.25-1.25s.562-1.25 1.25-1.25 1.25.562 1.25 1.25-.562 1.25-1.25 1.25z" /><path stroke-linecap="round" stroke-linejoin="round" d="M3.375 5.625c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.5c0 .621.504 1.125 1.125 1.125h3.75c.621 0 1.125-.504 1.125-1.125v-1.5a3.75 3.75 0 013.75-3.75h.375c1.036 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875-1.875H5.25c-1.035 0-1.875-.84-1.875-1.875V5.625z" /></svg>
            Ad Management
          </h2>
        </div>
      </div>

      <!-- Actions & Search Section -->
      <div class="px-6 pt-6 pb-2 sm:px-8 sm:pt-8">
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 mb-6">
          <button type="button" @click="toggleSearchInput"
            class="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            :class="{ 'ring-2 ring-offset-2 ring-blue-400 dark:ring-blue-300': showSearchInput }">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span>{{ showSearchInput ? 'Hide Search' : 'Search Ad' }}</span>
          </button>
          <button type="button" @click="openAddAdModal"
            class="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
            <span>Add New Ad</span>
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
              <svg class="w-5 h-5 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              Find Ads
            </h3>
            <div class="relative flex-grow w-full">
              <input ref="searchInputField" type="text" v-model="searchQuery" placeholder="Enter ad title to search..."
                class="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-200" />
              <div v-if="isSearching" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              </div>
            </div>

            <!-- Search Results Area -->
            <div v-if="searchPerformed" class="mt-6">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Search results for: <strong class="text-gray-800 dark:text-gray-200">"{{ lastSearchQuery }}"</strong>
              </p>
              <ul v-if="searchResults.length > 0" class="space-y-3 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/30 custom-scrollbar">
                <li v-for="ad in searchResults" :key="ad.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 min-w-0">
                      <img v-if="getFirstImageUrl(ad.media)" :src="getFirstImageUrl(ad.media)" class="w-16 h-10 object-cover rounded-md bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                      <div v-else class="w-16 h-10 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0 flex items-center justify-center text-gray-400">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ ad.title }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">Type: {{ ad.type?.name || 'N/A' }}</p>
                      </div>
                    </div>
                    <div class="flex-shrink-0 flex items-center space-x-3 ml-4">
                      <button @click="openAdEditModal(ad.id)" class="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Edit</button>
                      <button @click="openAdDeleteModal(ad.id)" class="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-else-if="!isSearching" class="p-6 text-center text-gray-500 dark:text-gray-400 border border-dashed rounded-lg">
                No ads found matching your criteria.
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Placeholder for Main Ad List -->
      <div class="px-6 pb-6 sm:px-8 sm:pb-8" v-if="!showSearchInput">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          All Ads (Placeholder)
        </h3>
        <div class="p-6 text-center text-gray-400 dark:text-gray-500 border border-dashed rounded-lg">
          A list of all ads would be displayed here.
        </div>
      </div>
    </div>

     <!-- Modals -->
     <AdAddModal :is-visible="showAdAddModal" @close="closeAddAdModal" @saved="handleAdSaved" />
     <!-- You will need to create AdEditModal.vue -->
     <!-- <AdEditModal :is-visible="showAdEditModal" :ad-id="adToEditId" @close="closeAdEditModal" @saved="handleAdUpdated" /> -->

    <!-- Delete Confirmation Modal -->
    <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showAdDeleteModal" class="relative z-50"><div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div><div class="fixed inset-0 z-10 w-screen overflow-y-auto"><div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"><transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95"><div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg"><div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10"><ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" /></div><div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left"><h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Delete Ad</h3><div class="mt-2"><p class="text-sm text-gray-500 dark:text-gray-400">Are you sure? This action cannot be undone.</p></div></div></div></div><div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"><button @click="confirmDelete" :disabled="isDeleting" type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50"><span v-if="isDeleting">Deleting...</span><span v-else>Delete</span></button><button @click="closeAdDeleteModal" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 sm:mt-0 sm:w-auto">Cancel</button></div></div></transition></div></div></div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onUnmounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import AdAddModal from './adsAddCom.vue'; // Assuming the add modal is named adAddCom.vue
// import AdEditModal from './adUpdateCom.vue'; // You would create this component

const showSearchInput = ref(false);
const searchQuery = ref('');
const lastSearchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const searchPerformed = ref(false);
const searchInputField = ref(null);
const toast = useToast();

// Modal States
const showAdAddModal = ref(false);
const showAdEditModal = ref(false);
const adToEditId = ref(null);
const showAdDeleteModal = ref(false);
const adToDeleteId = ref(null);
const isDeleting = ref(false);

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

const getFirstImageUrl = (media) => {
  if (!Array.isArray(media) || media.length === 0) return null;
  const image = media.find(item => item.type === 'image');
  return image ? image.url : null;
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
              endpoint: `ads/search`, // Endpoint for searching ads
              title: query // Assuming search by title
          }
      });
      searchResults.value = response.data.data || [];
  } catch (error) {
      console.error("Error searching for ads:", error);
      toast.error("Failed to search for ads.");
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

onUnmounted(() => clearTimeout(debounceTimer));

// --- Add Modal Logic ---
const openAddAdModal = () => { showAdAddModal.value = true; };
const closeAddAdModal = () => { showAdAddModal.value = false; };
const handleAdSaved = () => {
  closeAddAdModal();
  toast.success(`Ad created successfully!`);
  if (showSearchInput.value && searchQuery.value) {
    performSearch();
  }
};

// --- Edit Modal Logic ---
const openAdEditModal = (adId) => {
  adToEditId.value = adId;
  showAdEditModal.value = true;
};
const closeAdEditModal = () => {
  showAdEditModal.value = false;
  adToEditId.value = null;
};
const handleAdUpdated = () => {
  closeAdEditModal();
  toast.success(`Ad updated successfully!`);
  performSearch();
};

// --- Delete Modal Logic ---
const openAdDeleteModal = (adId) => {
  adToDeleteId.value = adId;
  showAdDeleteModal.value = true;
};
const closeAdDeleteModal = () => {
  showAdDeleteModal.value = false;
  adToDeleteId.value = null;
};
const confirmDelete = async () => {
  if (!adToDeleteId.value) return;
  isDeleting.value = true;
  try {
    await axios.delete(route('proxy.delete', { endpoint: `ads/${adToDeleteId.value}` }));
    toast.success('Ad deleted successfully!');
    performSearch();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete the ad.");
  } finally {
    isDeleting.value = false;
    closeAdDeleteModal();
  }
};
</script>
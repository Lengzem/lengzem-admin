<template>
    <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 px-6 py-4 sm:px-8">
          <div class="flex items-center justify-between">
            <!-- CHANGE: Header is now dynamic -->
            <h2 class="text-2xl font-bold text-white tracking-tight flex items-center capitalize">
              {{ activeTab }} List
            </h2>
          </div>
        </div>

        <!-- CHANGE: New Tabs UI -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg max-w-sm">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="[
                'w-full py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-gray-800',
                activeTab === tab.value
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              ]"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
          <!-- CHANGE: Loading message is dynamic -->
          <div v-if="loading"
            class="p-8 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span class="capitalize">Loading {{ activeTab }}...</span>
          </div>
          <div v-else-if="error"
            class="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
            {{ error }}
          </div>
          <!-- CHANGE: No items found message is dynamic -->
          <div v-else-if="items.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400 capitalize">
            No {{ activeTab }} found.
          </div>
          <div v-else class="overflow-x-auto custom-scrollbar">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-1">
                <tr>
                  <!-- CHANGE: Conditional Thumbnail column -->
                  <th v-if="activeTab === 'videos'" scope="col"
                    class="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Thumbnail
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Release Date
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <!-- CHANGE: Conditional Views/Duration column -->
                  <th v-if="activeTab === 'videos'" scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Views
                  </th>
                  <th v-if="activeTab === 'audios'" scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <!-- CHANGE: Loop over generic 'items' array -->
                <tr v-for="item in items" :key="item.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150">
                  <!-- CHANGE: Conditional thumbnail cell -->
                  <td v-if="activeTab === 'videos'" class="px-4 py-3">
                    <img v-if="item.thumbnail_url" :src="item.thumbnail_url" :alt="item.title" class="h-12 w-20 object-cover rounded-md bg-gray-200 dark:bg-gray-700">
                    <div v-else class="h-12 w-20 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-3 max-w-sm"
                      :title="item.title">{{ item.title || 'N/A' }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ item.id }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {{ item.author?.name || 'Unknown Author' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {{ item.release_date || 'Not Set' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize',
                      item.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' :
                        item.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300' :
                          item.status === 'archived' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300' :
                            'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
                    ]">
                      {{ item.status || 'N/A' }}
                    </span>
                  </td>
                  <!-- CHANGE: Conditional data cell for views/duration -->
                  <td v-if="activeTab === 'videos'" class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {{ item.views ?? '0' }}
                  </td>
                   <td v-if="activeTab === 'audios'" class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {{ item.duration || 'N/A' }}
                  </td>
                  <td class="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <!-- CHANGE: Actions are now generic -->
                    <button @click="openDetailModal(item.id)" type="button" class="action-button text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30">View</button>
                    <button @click="openEditModal(item.id)" type="button" class="action-button text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30">Edit</button>
                    <button @click="goToCommentPage(item.id)" type="button" class="action-button text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/30">Comments</button>
                    <button @click="openConfirmDeleteModal(item.id)" type="button" class="action-button text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination - No change needed, logic is generic -->
          <div v-if="!loading && items.length > 0 && pagination.total > pagination.per_page"
            class="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div class="hidden sm:block text-sm text-gray-700 dark:text-gray-400">
              Showing <span class="font-semibold">{{ pagination.from }}</span> to <span class="font-semibold">{{
            pagination.to }}</span> of <span class="font-semibold">{{ pagination.total }}</span> results
            </div>
            <Pagination v-model:page="pagination.current_page" :total="pagination.total"
              :items-per-page="pagination.per_page" :sibling-count="1" show-edges class="mx-auto sm:mx-0">
              <PaginationContent v-slot="{ items: pgItems }" class="flex items-center gap-1">
                <PaginationPrevious />
                <div class="hidden sm:flex items-center gap-1">
                  <template v-for="(pgItem, index) in pgItems">
                    <PaginationItem v-if="pgItem.type === 'page'" :key="index" :value="pgItem.value">{{ pgItem.value }}
                    </PaginationItem>
                    <PaginationEllipsis v-else :key="pgItem.type" :index="index" />
                  </template>
                </div>
                <PaginationNext />
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      <!-- CHANGE: Detail Modal is now generic. Update your component to accept itemType prop. -->
      <ItemDetailModal :is-visible="showDetailModal" :item-id="selectedItemId" :item-type="activeTab" @close="closeDetailModal" />

      <!-- CHANGE: Edit Modal is now generic -->
      <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showEditModal" class="fixed inset-0 z-40 bg-gray-900 bg-opacity-75" @click.self="closeEditModal">
          <div class="fixed inset-0 z-50 flex items-center justify-center">
            <div
              class="relative bg-white dark:bg-gray-900 w-full h-full max-w-7xl mx-auto shadow-xl rounded-lg overflow-y-auto">
              <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10 p-4">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 capitalize">Edit {{ activeTab.slice(0, -1) }}</h2>
                <button @click="closeEditModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100">
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div class="p-4">
                <!-- Update your component to accept itemType prop -->
                <ItemEdit v-if="editingItemId" :item-id="editingItemId" :item-type="activeTab"
                  @item-updated="handleItemUpdated" @close-modal="closeEditModal" />
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- CHANGE: Delete Confirmation Modal is now generic -->
      <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
         <div v-if="showConfirmDeleteModal" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                      </div>
                      <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100 capitalize" id="modal-title">Delete {{ activeTab.slice(0, -1) }}</h3>
                        <div class="mt-2">
                          <p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this {{ activeTab.slice(0, -1) }}? This action cannot be undone.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button @click="confirmDelete" :disabled="isDeleting" type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50">
                      <span v-if="isDeleting">...</span>
                      <span v-else>Delete</span>
                    </button>
                    <button @click="closeConfirmDeleteModal" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto">Cancel</button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>

  <style scoped>
  .action-button {
    @apply px-3 py-1 rounded-md font-medium transition-colors;
  }
  </style>

  <script setup>
  import { ref, onMounted, reactive, watch } from 'vue';
  import axios from 'axios';
  // CHANGE: Renamed modal imports to be generic. You'll need to update/create these components.
  import ItemDetailModal from './videoDetailCom.vue'; // Placeholder: update to a generic component
  import ItemEdit from './videoUpdateCom.vue'; // Placeholder: update to a generic component
  import { useToast } from 'vue-toastification';
  import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
  import { router } from '@inertiajs/vue3';

  // CHANGE: All state is now generic
  const activeTab = ref('videos'); // 'videos' or 'audios'
  const tabs = [
    { name: 'Videos', value: 'videos' },
    { name: 'Audios', value: 'audios' },
  ];

  const items = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const toast = useToast();

  const pagination = reactive({
    current_page: 1, from: 0, to: 0, total: 0, per_page: 15, last_page: 1,
  });

  const showDetailModal = ref(false);
  const selectedItemId = ref(null);
  const showEditModal = ref(false);
  const editingItemId = ref(null);
  const showConfirmDeleteModal = ref(false);
  const itemToDeleteId = ref(null);
  const isDeleting = ref(false);

  const goToCommentPage = (itemId) => {
    const paramKey = `${activeTab.value.slice(0, -1)}_id`; // creates video_id or audio_id
    router.get(route('comment'), { [paramKey]: itemId });
  };

  const openDetailModal = (itemId) => {
    selectedItemId.value = itemId;
    showDetailModal.value = true;
  };

  const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedItemId.value = null;
  };

  const openEditModal = (itemId) => {
    editingItemId.value = itemId;
    showEditModal.value = true;
  };

  const closeEditModal = () => {
    showEditModal.value = false;
    editingItemId.value = null;
  };

  const handleItemUpdated = () => {
    closeEditModal();
    fetchData(pagination.current_page);
    toast.info(`${activeTab.value.slice(0, -1)} list has been updated.`);
  };

  const openConfirmDeleteModal = (itemId) => {
    itemToDeleteId.value = itemId;
    showConfirmDeleteModal.value = true;
  };

  const closeConfirmDeleteModal = () => {
    showConfirmDeleteModal.value = false;
    itemToDeleteId.value = null;
  };

  const confirmDelete = async () => {
    if (!itemToDeleteId.value) return;
    isDeleting.value = true;
    try {
      const endpoint = `${activeTab.value}/${itemToDeleteId.value}`;
      await axios.delete(route('proxy.delete', { endpoint }));
      toast.success(`${activeTab.value.slice(0, -1)} deleted successfully!`);

      if (items.value.length === 1 && pagination.current_page > 1) {
        fetchData(pagination.current_page - 1);
      } else {
        fetchData(pagination.current_page);
      }
    } catch (err) {
      console.error(`Error deleting item with ID ${itemToDeleteId.value}:`, err);
      toast.error(`Failed to delete the ${activeTab.value.slice(0, -1)}.`);
    } finally {
      isDeleting.value = false;
      closeConfirmDeleteModal();
    }
  };

  // CHANGE: Main data fetching function is now generic
  const fetchData = async (page = 1) => {
    loading.value = true;
    error.value = null;
    items.value = []; // Clear previous items
    try {
      const response = await axios.get(route('proxy.get'), {
        params: {
          endpoint: activeTab.value, // Use the active tab as the endpoint
          page: page,
        }
      });

      if (response.data?.status === true && Array.isArray(response.data.data?.data)) {
        items.value = response.data.data.data;
        const { current_page, from, to, total, per_page, last_page } = response.data.data;
        Object.assign(pagination, { current_page, from, to, total, per_page, last_page });
      } else {
        error.value = `Unexpected data format for ${activeTab.value} list.`;
      }
    } catch (err) {
      if (err.response?.status === 401) {
        error.value = "You are not authorized. Please refresh the page.";
      } else {
        error.value = `Failed to load ${activeTab.value}. Please try again later.`;
      }
      console.error(`Error fetching ${activeTab.value}:`, err);
    } finally {
      loading.value = false;
    }
  };

  // CHANGE: Watch for tab changes to refetch data
  watch(activeTab, (newTab) => {
    pagination.current_page = 1; // Reset to page 1 when switching tabs
    fetchData();
  });

  // Watch for pagination changes
  watch(() => pagination.current_page, (newPage, oldPage) => {
    if (newPage !== oldPage && !loading.value) {
      fetchData(newPage);
    }
  });

  // Initial fetch on component mount
  onMounted(() => {
    fetchData();
  });
  </script>

<template>
  <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 px-6 py-4 sm:px-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688 0-1.25-.562-1.25-1.25s.562-1.25 1.25-1.25 1.25.562 1.25 1.25-.562 1.25-1.25 1.25zM10.34 11.84c-.688 0-1.25-.562-1.25-1.25s.562-1.25 1.25-1.25 1.25.562 1.25 1.25-.562 1.25-1.25 1.25z" /><path stroke-linecap="round" stroke-linejoin="round" d="M3.375 5.625c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.5c0 .621.504 1.125 1.125 1.125h3.75c.621 0 1.125-.504 1.125-1.125v-1.5a3.75 3.75 0 013.75-3.75h.375c1.036 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875-1.875H5.25c-1.035 0-1.875-.84-1.875-1.875V5.625z" /></svg>
            Advertisement List
          </h2>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        <!-- Loading, Error, and Empty States -->
        <div v-if="loadingAds" class="p-8 text-center"><svg class="animate-spin mx-auto h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg><p class="mt-2 text-gray-500 dark:text-gray-400">Loading Ads...</p></div>
        <div v-else-if="adsError" class="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">{{ adsError }}</div>
        <div v-else-if="ads.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">No advertisements found.</div>
        
        <!-- Data Table -->
        <div v-else class="overflow-x-auto custom-scrollbar">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th class="table-header">Title</th>
                <th class="table-header">Media</th>
                <th class="table-header">Ad Type</th>
                <th class="table-header">Campaign Dates</th>
                <th class="table-header">Status</th>
                <th class="relative table-header"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="ad in ads" :key="ad.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 max-w-xs">{{ ad.title }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ ad.id }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <img v-if="getFirstImageUrl(ad.media)" :src="getFirstImageUrl(ad.media)" class="h-10 w-16 object-cover rounded-md bg-gray-200 dark:bg-gray-700">
                    <div v-else class="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">({{ ad.media?.length || 0 }} assets)</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  <!-- CHANGE: Simplified to use the nested object from the API -->
                  {{ ad.type?.name || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  <div class="flex flex-col">
                    <span>{{ formatDate(ad.start_date) }}</span>
                    <span class="text-xs text-gray-400">to {{ formatDate(ad.end_date) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="status-badge" :class="statusBadgeClass(ad.status)">{{ ad.status }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex justify-end space-x-1">
                    <button @click="openEditModal(ad.id)" type="button" class="action-button text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30">Edit</button>
                    <button @click="openConfirmDeleteModal(ad.id)" type="button" class="action-button text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div v-if="!loadingAds && ads.length > 0 && pagination.total > pagination.per_page" class="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6"><div class="hidden sm:block text-sm text-gray-700 dark:text-gray-400">Showing <span class="font-semibold">{{ pagination.from }}</span> to <span class="font-semibold">{{ pagination.to }}</span> of <span class="font-semibold">{{ pagination.total }}</span> results</div><Pagination v-model:page="pagination.current_page" :total="pagination.total" :items-per-page="pagination.per_page" :sibling-count="1" show-edges class="mx-auto sm:mx-0"><PaginationContent v-slot="{ items: pgItems }" class="flex items-center gap-1"><PaginationPrevious /><div class="hidden sm:flex items-center gap-1"><template v-for="(pgItem, index) in pgItems"><PaginationItem v-if="pgItem.type === 'page'" :key="index" :value="pgItem.value">{{ pgItem.value }}</PaginationItem><PaginationEllipsis v-else :key="item.type" :index="index" /></template></div><PaginationNext /></PaginationContent></Pagination></div>
      </div>
    </div>
    
    <!-- Edit Modal (You will need to create AdUpdate.vue) -->
    <!-- 
      <AdUpdateModal
        :is-visible="showEditModal"
        :ad-id="editingAdId"
        @close-modal="closeEditModal"
        @ad-updated="handleAdUpdated"
      />
    -->

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"><div v-if="showConfirmDeleteModal" class="relative z-50"><div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div><div class="fixed inset-0 z-10 w-screen overflow-y-auto"><div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"><transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95"><div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg"><div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4"><div class="sm:flex sm:items-start"><div class="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10"><ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" /></div><div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left"><h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Delete Advertisement</h3><div class="mt-2"><p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this ad? This action cannot be undone.</p></div></div></div></div><div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"><button @click="confirmDelete" :disabled="isDeleting" type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50"><span v-if="isDeleting">Deleting...</span><span v-else>Delete</span></button><button @click="closeConfirmDeleteModal" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 sm:mt-0 sm:w-auto">Cancel</button></div></div></transition></div></div></div></transition>
    </Teleport>
  </div>
</template>

<style scoped>
.table-header { @apply px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider; }
.status-badge { @apply px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize; }
.action-button { @apply px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200; }
.custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e0 #f7fafc; }
.dark .custom-scrollbar { scrollbar-color: #4a5568 #1a202c; }
</style>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
// You will need to create this AdUpdateModal component for the "Edit" button to work.
// import AdUpdateModal from './AdUpdateModal.vue';

// State
const ads = ref([]);
const loadingAds = ref(true);
const adsError = ref(null);
const toast = useToast();
const pagination = reactive({ current_page: 1, from: 0, to: 0, total: 0, per_page: 15 });

// Modal State
const showEditModal = ref(false);
const editingAdId = ref(null);
const showConfirmDeleteModal = ref(false);
const adToDeleteId = ref(null);
const isDeleting = ref(false);

// Helper functions
const formatDate = (dateString) => !dateString ? 'N/A' : new Date(dateString).toLocaleDateString();
const getFirstImageUrl = (media) => {
  if (!Array.isArray(media) || media.length === 0) return null;
  const image = media.find(item => item.type === 'image');
  return image ? image.url : null;
};
const statusBadgeClass = (status) => {
  switch(status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
    case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300';
    case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300';
    default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300';
  }
};

// Data Fetching
const fetchAds = async (page = 1) => {
  loadingAds.value = true;
  adsError.value = null;
  try {
    const response = await axios.get(route('proxy.get'), { params: { endpoint: 'ads', page, per_page: pagination.per_page } });
    
    // CHANGE: Adjusted to handle both paginated and non-paginated responses based on your example
    const responseData = response.data.data;
    if (response.data?.status === true && Array.isArray(responseData.data || responseData)) {
      ads.value = responseData.data || responseData; // Handle both paginated (responseData.data) and flat array (responseData)
      // Check for pagination data and assign it
      if (responseData.current_page) {
        const { current_page, from, to, total } = responseData;
        Object.assign(pagination, { current_page, from, to, total });
      }
    } else {
      adsError.value = "Unexpected data format for ads list.";
    }
  } catch (err) {
    adsError.value = "Failed to load advertisements. Please try again.";
  } finally {
    loadingAds.value = false;
  }
};

// Modal Handlers
const openEditModal = (adId) => { editingAdId.value = adId; showEditModal.value = true; };
const closeEditModal = () => { showEditModal.value = false; editingAdId.value = null; };
const handleAdUpdated = () => {
  closeEditModal();
  fetchAds(pagination.current_page);
  toast.success("Advertisement updated successfully!");
};

const openConfirmDeleteModal = (adId) => { adToDeleteId.value = adId; showConfirmDeleteModal.value = true; };
const closeConfirmDeleteModal = () => { showConfirmDeleteModal.value = false; adToDeleteId.value = null; };

const confirmDelete = async () => {
  if (!adToDeleteId.value) return;
  isDeleting.value = true;
  try {
    await axios.delete(route('proxy.delete', { endpoint: `ads/${adToDeleteId.value}` }));
    toast.success("Advertisement deleted successfully!");
    if (ads.value.length === 1 && pagination.current_page > 1) {
      fetchAds(pagination.current_page - 1);
    } else {
      fetchAds(pagination.current_page);
    }
  } catch (err) {
    toast.error(`Failed to delete ad. ${err.response?.data?.message || ''}`);
  } finally {
    isDeleting.value = false;
    closeConfirmDeleteModal();
  }
};

// Lifecycle and Watchers
watch(() => pagination.current_page, (newPage) => { if (!loadingAds.value) fetchAds(newPage); });

onMounted(() => {
  // No longer need to fetch types separately
  fetchAds();
});
</script>
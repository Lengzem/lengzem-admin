<template>
  <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <!-- Author List Header -->
      <div class="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 px-6 py-4 sm:px-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
            <svg class="w-6 h-6 mr-3 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 18.75a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
            </svg>
            Author List
          </h2>
        </div>
      </div>

      <div class="p-4 sm:p-6">
        <div
          class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <!-- Loading/Error/Empty States -->
          <div v-if="loadingAuthors"
            class="p-8 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>Loading authors...</span>
          </div>
          <div v-else-if="authorsError"
            class="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
            {{ authorsError }}
          </div>
          <div v-else-if="authors.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            No authors found.
          </div>

          <!-- Author Table -->
          <div v-else class="overflow-x-auto custom-scrollbar">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Author</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Phone</th>
                  <th scope="col"
                    class="hidden sm:table-cell px-6 py-3 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Articles Count</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Joined Date</th>
                  <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="author in authors" :key="author.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img v-if="author.profile_image_url" class="h-10 w-10 rounded-full object-cover"
                          :src="author.profile_image_url" :alt="author.name + ' profile image'">
                        <span v-else
                          class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold">
                          {{ author.name ? author.name.charAt(0).toUpperCase() : 'U' }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ author.name || 'N/A' }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ author.email || 'N/A' }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">  
                    {{ author.phone ? author.phone : 'N/A' }}
                  </td>
                  <td
                    class="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 text-center">
                    {{ author.articles_count !== undefined ? author.articles_count : '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{
            formatDate(author.created_at) }}</td>
                  <td class="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
  <button v-if="isAdmin || isEditor" @click="openAuthorViewModal(author.id)" type="button"
    class="px-3 py-1 rounded-md font-medium transition-colors
     text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800
     dark:text-indigo-400 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300">
    View
  </button>
  <button v-if="isAdmin" @click="openAuthorEditModal(author.id)" type="button"
    class="px-3 py-1 rounded-md font-medium transition-colors
     text-blue-600 hover:bg-blue-50 hover:text-blue-800
     dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300">
    Edit
  </button>
  <button v-if="isAdmin" @click="openConfirmDeleteModal(author.id)" type="button"
    class="px-3 py-1 rounded-md font-medium transition-colors
     text-red-600 hover:bg-red-50 hover:text-red-800
     dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300">
    Delete
  </button>
</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="!loadingAuthors && authors.length > 0 && pagination.total > pagination.per_page"
            class="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div class="hidden sm:block text-sm text-gray-700 dark:text-gray-400">
              Showing <span class="font-semibold">{{ pagination.from }}</span> to <span class="font-semibold">{{
            pagination.to }}</span> of <span class="font-semibold">{{ pagination.total }}</span> results
            </div>
            <Pagination v-model:page="pagination.current_page" :total="pagination.total"
              :items-per-page="pagination.per_page" :sibling-count="1" show-edges class="mx-auto sm:mx-0">
              <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
                <PaginationPrevious />
                <div class="hidden sm:flex items-center gap-1">
                  <template v-for="(item, index) in items">
                    <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value">{{ item.value }}
                    </PaginationItem>
                    <PaginationEllipsis v-else :key="item.type" :index="index" />
                  </template>
                </div>
                <PaginationNext />
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- NEW: Author Detail Modal -->
    <AuthorDetailModal :is-visible="showAuthorViewModal" :author-id="viewingAuthorId" @close="closeAuthorViewModal" />

    <!-- MODIFIED: Pass author-id prop -->
    <AuthorEditModal :is-visible="showAuthorEditModal" :author-id="editingAuthorId" @close="closeAuthorEditModal"
      @saved="handleAuthorSaved" />

    <!-- Delete Confirmation Modal -->
    <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showConfirmDeleteModal" class="relative z-50" aria-labelledby="modal-title" role="dialog"
        aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <transition enter-active-class="ease-out duration-300"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <div
                class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div
                      class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100" id="modal-title">
                        Delete
                        Author</h3>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this author?
                          This action cannot be undone.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button @click="confirmDelete" :disabled="isDeleting" type="button"
                    class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50">
                    <span v-if="isDeleting" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      Deleting...
                    </span>
                    <span v-else>Delete</span>
                  </button>
                  <button @click="closeConfirmDeleteModal" type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto">Cancel</button>
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
import { ref, onMounted, reactive, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination';
import AuthorDetailModal from './authorsDetailsCom.vue';
import AuthorEditModal from './authorsUpdateCom.vue';
import { useUserRole } from '@/composables/userRole';

const { isAdmin, isEditor, role, loading } = useUserRole();

const toast = useToast();
const authors = ref([]);
const loadingAuthors = ref(true);
const authorsError = ref(null);

const pagination = reactive({
  current_page: 1, from: 0, to: 0, total: 0, per_page: 15, last_page: 1,
});

// CORRECTED: Declared all necessary states
// State for View Modal
const showAuthorViewModal = ref(false);
const viewingAuthorId = ref(null);

// State for Edit Modal
const showAuthorEditModal = ref(false);
const editingAuthorId = ref(null);

// State for Delete Modal
const showConfirmDeleteModal = ref(false);
const authorToDeleteId = ref(null);
const isDeleting = ref(false);

const fetchAuthors = async (page = 1) => {
  loadingAuthors.value = true;
  authorsError.value = null;

  try {
    const response = await axios.get(route('proxy.get', { endpoint: 'users/editors', page }));

    if (response.data?.status === true && Array.isArray(response.data.data?.data)) {
      authors.value = response.data.data.data;
      const { current_page, from, to, total, per_page, last_page } = response.data.data;
      Object.assign(pagination, { current_page, from, to, total, per_page, last_page });
    } else {
      authorsError.value = "Unexpected data format for author list.";
      authors.value = [];
    }
  } catch (err) {
    if (err.response?.status === 401) {
      authorsError.value = "You are not authorized. Please refresh the page.";
    } else {
      authorsError.value = "Failed to load authors. Please try again later.";
    }
    console.error("Error fetching authors:", err);
    authors.value = [];
  } finally {
    loadingAuthors.value = false;
  }
};

watch(() => pagination.current_page, (newPage) => {
  if (!loadingAuthors.value) {
    fetchAuthors(newPage);
  }
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Invalid Date';
  }
};

// --- View Modal Logic ---
const openAuthorViewModal = (authorId) => {
  viewingAuthorId.value = authorId;
  showAuthorViewModal.value = true;
};
const closeAuthorViewModal = () => {
  showAuthorViewModal.value = false;
  viewingAuthorId.value = null;
};

// --- Edit Modal Logic ---
const openAuthorEditModal = (id) => {
  editingAuthorId.value = id;
  showAuthorEditModal.value = true;
};
const closeAuthorEditModal = () => {
  showAuthorEditModal.value = false;
  editingAuthorId.value = null;
};
const handleAuthorSaved = () => {
  closeAuthorEditModal();
  fetchAuthors(pagination.current_page);
};

// --- Delete Modal Logic ---
const openConfirmDeleteModal = (authorId) => {
  authorToDeleteId.value = authorId;
  showConfirmDeleteModal.value = true;
};
const closeConfirmDeleteModal = () => {
  showConfirmDeleteModal.value = false;
  authorToDeleteId.value = null;
};
const confirmDelete = async () => {
  if (!authorToDeleteId.value) return;
  isDeleting.value = true;
  try {
    await axios.delete(route('proxy.delete', { endpoint: `users/${authorToDeleteId.value}` }));
    toast.success('Author deleted successfully!');
    if (authors.value.length === 1 && pagination.current_page > 1) {
      fetchAuthors(pagination.current_page - 1);
    } else {
      fetchAuthors(pagination.current_page);
    }
  } catch (error) {
    console.error("Error deleting author:", error);
    const errorMsg = error.response?.status === 401 ? "Your session has expired." : "Failed to delete the author.";
    toast.error(errorMsg);
  } finally {
    isDeleting.value = false;
    closeConfirmDeleteModal();
  }
};

onMounted(() => {
  fetchAuthors();
});
</script>
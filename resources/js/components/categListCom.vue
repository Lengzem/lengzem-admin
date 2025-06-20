<template>
  <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <!-- Category List Header -->
      <div class="bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 px-6 py-4 sm:px-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
            <svg class="w-6 h-6 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            Category List
          </h2>
        </div>
      </div>
            
      <div class="p-4 sm:p-6">
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div v-if="loadingCategories" class="p-8 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading categories...</span>
          </div>
          <div v-else-if="categoriesError" class="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
            {{ categoriesError }}
          </div>
          <div v-else-if="categories.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            No categories found.
          </div>
          <div v-else class="overflow-x-auto custom-scrollbar">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Slug</th>
                  <th scope="col" class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Description</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Created Date</th>
                  <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ category.name || 'N/A' }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ category.id }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ category.slug || 'N/A' }}</td>
                  <td class="hidden sm:table-cell px-6 py-4 whitespace-normal text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">{{ category.description || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ formatDate(category.created_at) }}</td>
                  <td class="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
  <button @click="openEditCategoryModal(category.id)" type="button" 
    class="px-3 py-1 rounded-md font-medium transition-colors
     text-blue-600 hover:bg-blue-50 hover:text-blue-800
     dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300">
    Edit
  </button>
  <button v-if="isAdmin" @click="openConfirmDeleteModal(category.id)" type="button"
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
            <div v-if="categories.length > 0 && pagination.last_page > 1" class="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p class="text-sm text-gray-700 dark:text-gray-300">Showing <span class="font-medium">{{ pagination.from }}</span> to <span class="font-medium">{{ pagination.to }}</span> of <span class="font-medium">{{ pagination.total }}</span> results</p>
                <div class="flex-1 flex justify-between sm:justify-end">
                    <button @click="fetchCategories(pagination.current_page - 1)" :disabled="!pagination.prev_page_url" class="relative inline-flex items-center px-4 py-2 border ...">Previous</button>
                    <button @click="fetchCategories(pagination.current_page + 1)" :disabled="!pagination.next_page_url" class="ml-3 relative inline-flex items-center px-4 py-2 border ...">Next</button>
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Category Modal (Placeholder) -->
    <CategoryEditModal
      :is-visible="showCategoryEditModal"
      :category-id="editingCategoryId"
      @close="closeCategoryEditModal"
      @saved="handleCategorySaved"
    />


    <!-- Delete Confirmation Modal -->
    <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
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
                      <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100" id="modal-title">Delete Category</h3>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this category? All associated articles might be affected. This action cannot be undone.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button @click="confirmDelete" :disabled="isDeleting" type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50">
                    <span v-if="isDeleting" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Deleting...
                    </span>
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

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import CategoryEditModal from './categUpdateCom.vue';
import { useUserRole } from '@/composables/userRole';

const { isAdmin, isEditor, role, loading } = useUserRole();

const categories = ref([]);
const loadingCategories = ref(true);
const categoriesError = ref(null);
const toast = useToast();

const pagination = reactive({
  current_page: 1, from: 0, to: 0, total: 0, last_page: 1, prev_page_url: null, next_page_url: null,
});

const showCategoryEditModal = ref(false);
const editingCategoryId = ref(null);

// State for Delete Confirmation Modal
const showConfirmDeleteModal = ref(false);
const categoryToDeleteId = ref(null);
const isDeleting = ref(false);

const fetchCategories = async (page = 1) => {
loadingCategories.value = true;
categoriesError.value = null;
try {
  const response = await axios.get(route('proxy.get', { endpoint: 'categories', page: page }));
  if (response.data?.status === true && Array.isArray(response.data.data?.data)) {
    categories.value = response.data.data.data;
    const { current_page, from, to, total, last_page, prev_page_url, next_page_url } = response.data.data;
    Object.assign(pagination, { current_page, from, to, total, last_page, prev_page_url, next_page_url });
  } else {
    categoriesError.value = "Unexpected data format for category list.";
    categories.value = [];
  }
} catch (err) {
    if (err.response?.status === 401) {
      categoriesError.value = "You are not authorized. Please refresh the page.";
    } else {
      categoriesError.value = "Failed to load authors. Please try again later.";
    }
    console.error("Error fetching authors:", err);
    authors.value = [];
  } finally {
    loadingCategories.value = false;
  }
};

const formatDate = (dateString) => {
if (!dateString) return 'N/A';
try {
  return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
} catch (e) {
  return 'Invalid Date';
}
};

const openEditCategoryModal = (categoryId) => {
  editingCategoryId.value = categoryId;
  showCategoryEditModal.value = true;
};

const closeCategoryEditModal = () => {
  showCategoryEditModal.value = false;
  editingCategoryId.value = null;
};

const handleCategorySaved = () => {
  fetchCategories(pagination.current_page); // Refresh the list
  closeCategoryEditModal();
};

const openConfirmDeleteModal = (categoryId) => {
categoryToDeleteId.value = categoryId;
showConfirmDeleteModal.value = true;
};

const closeConfirmDeleteModal = () => {
showConfirmDeleteModal.value = false;
categoryToDeleteId.value = null;
};

const confirmDelete = async () => {
if (!categoryToDeleteId.value) return;

isDeleting.value = true;
try {
  await axios.delete(route('proxy.delete', { 
      endpoint: `categories/${categoryToDeleteId.value}` 
  }));

  toast.success('Category deleted successfully!');
  
  if (categories.value.length === 1 && pagination.current_page > 1) {
    await fetchCategories(pagination.current_page - 1);
  } else {
    await fetchCategories(pagination.current_page);
  }
} catch (error) {
  console.error("Error deleting category:", error);
  const errorMsg = error.response?.data?.message || "Failed to delete the category.";
  toast.error(errorMsg);
} finally {
  isDeleting.value = false;
  closeConfirmDeleteModal();
}
};

onMounted(() => {
fetchCategories();
});
</script>
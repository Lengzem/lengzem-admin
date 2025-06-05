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
            <button 
              @click="openAddCategoryModal" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-teal-700 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-600 focus:ring-white dark:bg-white/20 dark:text-white/90 dark:hover:bg-white/30 dark:focus:ring-offset-teal-700"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Category
            </button>
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
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Slug
                    </th>
                    <th scope="col" class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ category.name || 'N/A' }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ category.id }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {{ category.slug || 'N/A' }}
                    </td>
                    <td class="hidden sm:table-cell px-6 py-4 whitespace-normal text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {{ category.description || '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {{ formatDate(category.created_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button @click="openEditCategoryModal(category)" type="button" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium">
                        Edit
                      </button>
                      <button @click="confirmDeleteCategory(category.id)" type="button" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination (Placeholder) -->
              <div v-if="categories.length > 0 && pagination.last_page > 1" class="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span class="font-medium">{{ pagination.from }}</span>
                      to <span class="font-medium">{{ pagination.to }}</span>
                      of <span class="font-medium">{{ pagination.total }}</span> results
                  </p>
                  <div class="flex-1 flex justify-between sm:justify-end">
                      <button
                          @click="fetchCategories(pagination.current_page - 1)"
                          :disabled="!pagination.prev_page_url"
                          class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                          Previous
                      </button>
                      <button
                          @click="fetchCategories(pagination.current_page + 1)"
                          :disabled="!pagination.next_page_url"
                          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                          Next
                      </button>
                  </div>
              </div>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Category Modal (Placeholder - You'll need to create this) -->
      <!-- 
      <CategoryModal
        :is-visible="showCategoryModal"
        :category-data="editingCategory"
        @close="closeCategoryModal"
        @saved="handleCategorySaved"
      /> 
      -->
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive } from 'vue';
  import axios from 'axios';
  
  // Assume `route` is globally available
  // const route = (name, params) => `/api/mock/${name.replace('proxy.', '')}${params ? `?endpoint=${params.endpoint}` : '' }`;
  
  const categories = ref([]);
  const loadingCategories = ref(true);
  const categoriesError = ref(null);
  
  const pagination = reactive({
      current_page: 1,
      from: 0,
      to: 0,
      total: 0,
      last_page: 1,
      prev_page_url: null,
      next_page_url: null,
  });
  
  // For Add/Edit Category Modal (if you implement it)
  const showCategoryModal = ref(false);
  const editingCategory = ref(null); // null for new, object for editing
  
  const fetchCategories = async (page = 1) => {
    loadingCategories.value = true;
    categoriesError.value = null;
    try {
      const response = await axios.get(route('proxy.get', { endpoint: 'categories', page: page })); // Added page param
      
      if (response.data && response.data.status === true && response.data.data && Array.isArray(response.data.data.data)) {
        categories.value = response.data.data.data;
        // Update pagination data
        const { current_page, from, to, total, last_page, prev_page_url, next_page_url } = response.data.data;
        Object.assign(pagination, { current_page, from, to, total, last_page, prev_page_url, next_page_url });
  
      } else {
        console.warn("Fetched categories data is not in the expected format:", response.data);
        categoriesError.value = "Unexpected data format for category list.";
        categories.value = [];
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      categoriesError.value = "Failed to load categories. Please check the console for more details.";
      if (err.response) {
          categoriesError.value += ` (Status: ${err.response.status})`;
      }
      categories.value = [];
    } finally {
      loadingCategories.value = false;
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
          return 'Invalid Date';
      }
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid Date';
    }
  };
  
  const openAddCategoryModal = () => {
    editingCategory.value = null; // Signal for creating a new category
    showCategoryModal.value = true;
    console.log("Open Add Category Modal");
  };
  
  const openEditCategoryModal = (category) => {
    editingCategory.value = { ...category }; // Pass a copy to avoid direct mutation
    showCategoryModal.value = true;
    console.log("Open Edit Category Modal for:", category);
  };
  
  const closeCategoryModal = () => {
    showCategoryModal.value = false;
    editingCategory.value = null;
  };
  
  const handleCategorySaved = () => {
    // After a category is saved (created or updated)
    fetchCategories(pagination.current_page); // Refresh the current page of categories
    closeCategoryModal();
  };
  
  const confirmDeleteCategory = (categoryId) => {
    // Implement your delete confirmation logic (e.g., using a confirm dialog)
    if (window.confirm(`Are you sure you want to delete category ID: ${categoryId}?`)) {
      deleteCategory(categoryId);
    }
  };
  
  const deleteCategory = async (categoryId) => {
    console.log("Attempting to delete category:", categoryId);
    // try {
    //   await axios.delete(route('proxy.delete', { endpoint: `categories/${categoryId}` })); // Or your specific delete route
    //   fetchCategories(pagination.current_page); // Refresh list
    // } catch (error) {
    //   console.error("Error deleting category:", error);
    //   // Handle error display to user
    // }
  };
  
  
  onMounted(() => {
    fetchCategories();
  });
  </script>
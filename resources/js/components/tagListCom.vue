<template>
    <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
        <!-- Tag List Header -->
        <div class="bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 px-6 py-4 sm:px-8">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
              <svg class="w-6 h-6 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              Tag List
            </h2>
            <button 
              @click="openAddTagModal" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-600 focus:ring-white dark:bg-white/20 dark:text-white/90 dark:hover:bg-white/30 dark:focus:ring-offset-amber-700"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Tag
            </button>
          </div>
        </div>
              
        <div class="p-4 sm:p-6">
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div v-if="loadingTags" class="p-8 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
              <svg class="animate-spin h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading tags...</span>
            </div>
            <div v-else-if="tagsError" class="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
              {{ tagsError }}
            </div>
            <div v-else-if="tags.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
              No tags found.
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
                      Articles Count 
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
                  <tr v-for="tag in tags" :key="tag.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ tag.name || 'N/A' }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ tag.id }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {{ tag.slug || 'N/A' }}
                    </td>
                    <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 text-center">
                      {{ tag.articles_count !== undefined ? tag.articles_count : '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {{ formatDate(tag.created_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button @click="openEditTagModal(tag)" type="button" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium">
                        Edit
                      </button>
                      <button @click="confirmDeleteTag(tag.id)" type="button" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination (Placeholder) -->
              <div v-if="tags.length > 0 && pagination.last_page > 1" class="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span class="font-medium">{{ pagination.from }}</span>
                      to <span class="font-medium">{{ pagination.to }}</span>
                      of <span class="font-medium">{{ pagination.total }}</span> results
                  </p>
                  <div class="flex-1 flex justify-between sm:justify-end">
                      <button
                          @click="fetchTags(pagination.current_page - 1)"
                          :disabled="!pagination.prev_page_url"
                          class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                          Previous
                      </button>
                      <button
                          @click="fetchTags(pagination.current_page + 1)"
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
  
      <!-- Add/Edit Tag Modal (Placeholder - You'll need to create this) -->
      <!-- 
      <TagModal
        :is-visible="showTagModal"
        :tag-data="editingTag"
        @close="closeTagModal"
        @saved="handleTagSaved"
      /> 
      -->
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive } from 'vue';
  import axios from 'axios';
  
  // Assume `route` is globally available
  // const route = (name, params) => `/api/mock/${name.replace('proxy.', '')}${params ? `?endpoint=${params.endpoint}` : '' }`;
  
  const tags = ref([]);
  const loadingTags = ref(true);
  const tagsError = ref(null);
  
  const pagination = reactive({
      current_page: 1,
      from: 0,
      to: 0,
      total: 0,
      last_page: 1,
      prev_page_url: null,
      next_page_url: null,
  });
  
  // For Add/Edit Tag Modal (if you implement it)
  const showTagModal = ref(false);
  const editingTag = ref(null); // null for new, object for editing
  
  const fetchTags = async (page = 1) => {
    loadingTags.value = true;
    tagsError.value = null;
    try {
      // Using your specified endpoint for tags
      const response = await axios.get(route('proxy.get', { endpoint: 'tags', page: page })); // Added page param
      
      if (response.data && response.data.status === true && response.data.data && Array.isArray(response.data.data.data)) {
        tags.value = response.data.data.data;
        // Update pagination data
        const { current_page, from, to, total, last_page, prev_page_url, next_page_url } = response.data.data;
        Object.assign(pagination, { current_page, from, to, total, last_page, prev_page_url, next_page_url });
  
      } else {
        console.warn("Fetched tags data is not in the expected format:", response.data);
        tagsError.value = "Unexpected data format for tag list.";
        tags.value = [];
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
      tagsError.value = "Failed to load tags. Please check the console for more details.";
      if (err.response) {
          tagsError.value += ` (Status: ${err.response.status})`;
      }
      tags.value = [];
    } finally {
      loadingTags.value = false;
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
  
  const openAddTagModal = () => {
    editingTag.value = null; 
    showTagModal.value = true;
    console.log("Open Add Tag Modal");
  };
  
  const openEditTagModal = (tag) => {
    editingTag.value = { ...tag }; 
    showTagModal.value = true;
    console.log("Open Edit Tag Modal for:", tag);
  };
  
  const closeTagModal = () => {
    showTagModal.value = false;
    editingTag.value = null;
  };
  
  const handleTagSaved = () => {
    fetchTags(pagination.current_page); 
    closeTagModal();
  };
  
  const confirmDeleteTag = (tagId) => {
    if (window.confirm(`Are you sure you want to delete tag ID: ${tagId}?`)) {
      deleteTag(tagId);
    }
  };
  
  const deleteTag = async (tagId) => {
    console.log("Attempting to delete tag:", tagId);
    // try {
    //   await axios.delete(route('proxy.delete', { endpoint: `tags/${tagId}` })); // Or your specific delete route
    //   fetchTags(pagination.current_page); // Refresh list
    // } catch (error) {
    //   console.error("Error deleting tag:", error);
    //   // Handle error display to user
    // }
  };
  
  
  onMounted(() => {
    fetchTags();
  });
  </script>
<template>
    <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
        <!-- Author List Header -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 px-6 py-4 sm:px-8">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
              <svg class="w-6 h-6 mr-3 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 18.75a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
              </svg>
              Author List
            </h2>
          </div>
        </div>
              
        <div class="p-4 sm:p-6">
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div v-if="loadingAuthors" class="p-8 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
              <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading authors...</span>
            </div>
            <div v-else-if="authorsError" class="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
              {{ authorsError }}
            </div>
            <div v-else-if="authors.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
              No authors found.
            </div>
            <div v-else class="overflow-x-auto custom-scrollbar">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Author</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Slug</th>
                    <th scope="col" class="hidden sm:table-cell px-6 py-3 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Articles Count</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Joined Date</th>
                    <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="author in authors" :key="author.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <img class="h-10 w-10 rounded-full object-cover" :src="author.user.profile_image_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(author.name || 'A') + '&color=7F9CF5&background=EBF4FF'" :alt="author.name + ' avatar'">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ author.pen_name || 'N/A' }}</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">{{ author.email || 'N/A' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ author.slug || 'N/A' }}</td>
                    <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 text-center">{{ author.articles_count !== undefined ? author.articles_count : '-' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ formatDate(author.created_at) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button @click="openEditAuthorModal(author)" type="button" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium">Edit</button>
                      <button @click="confirmDeleteAuthor(author.id)" type="button" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <div v-if="!loadingAuthors && authors.length > 0 && pagination.total > pagination.per_page" class="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div class="hidden sm:block text-sm text-gray-700 dark:text-gray-400">
                    Showing <span class="font-semibold">{{ pagination.from }}</span> to <span class="font-semibold">{{ pagination.to }}</span> of <span class="font-semibold">{{ pagination.total }}</span> results
                </div>
                <Pagination
                  v-model:page="pagination.current_page"
                  :total="pagination.total"
                  :items-per-page="pagination.per_page"
                  :sibling-count="1"
                  show-edges
                  class="mx-auto sm:mx-0"
                >
                  <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
                    <PaginationPrevious />
                    <div class="hidden sm:flex items-center gap-1">
                      <template v-for="(item, index) in items">
                        <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value">{{ item.value }}</PaginationItem>
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
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive, watch } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/authStore';
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
  } from '@/components/ui/pagination';
  
  // Assume `route` is globally available
  // const route = (name, params) => { /* ... */ };
  
  const authStore = useAuthStore();
  const authors = ref([]);
  const loadingAuthors = ref(true);
  const authorsError = ref(null);
  
  const pagination = reactive({
      current_page: 1,
      from: 0,
      to: 0,
      total: 0,
      per_page: 15,
      last_page: 1,
  });
  
  const showAuthorModal = ref(false);
  const editingAuthor = ref(null);
  
  const fetchAuthors = async (page = 1) => {
    if (!authStore.token) {
      authorsError.value = "Authentication required. Please log in.";
      loadingAuthors.value = false;
      return;
    }
    
    loadingAuthors.value = true;
    authorsError.value = null;
  
    try {
      const response = await axios.get(route('proxy.get', { endpoint: 'authors', page }), {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Accept': 'application/json',
        }
      });
      
      if (response.data && response.data.status === true && response.data.data && Array.isArray(response.data.data.data)) {
        authors.value = response.data.data.data;
        const { current_page, from, to, total, per_page, last_page } = response.data.data;
        Object.assign(pagination, { current_page, from, to, total, per_page, last_page });
      } else {
        authorsError.value = "Unexpected data format for author list.";
        authors.value = [];
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          authorsError.value = "Your session has expired. Please log in again.";
          // Optionally, trigger a logout action from the store
          // authStore.logout();
        } else {
          authorsError.value = `Failed to load authors. (Status: ${err.response.status})`;
        }
      } else {
        authorsError.value = "Failed to load authors due to a network error.";
      }
      authors.value = [];
    } finally {
      loadingAuthors.value = false;
    }
  };
  
  watch(() => pagination.current_page, (newPage, oldPage) => {
      if (newPage !== oldPage && !loadingAuthors.value) {
          fetchAuthors(newPage);
      }
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Invalid Date';
    }
  };
  
  const openEditAuthorModal = (author) => {
    editingAuthor.value = { ...author }; 
    showAuthorModal.value = true;
  };
  
  const closeAuthorModal = () => {
    showAuthorModal.value = false;
    editingAuthor.value = null;
  };
  
  const handleAuthorSaved = () => {
    fetchAuthors(pagination.current_page); 
    closeAuthorModal();
  };
  
  const confirmDeleteAuthor = (authorId) => {
    if (window.confirm(`Are you sure you want to delete author ID: ${authorId}? This action cannot be undone.`)) {
      deleteAuthor(authorId);
    }
  };
  
  const deleteAuthor = async (authorId) => {
    if (!authStore.token) {
      alert("Authentication required. Please log in.");
      return;
    }
    
    try {
      await axios.delete(route('proxy.delete', { endpoint: `authors/${authorId}` }), {
          headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Accept': 'application/json',
          }
      });
      // Refresh the list. If it was the last item on a page, go to the previous page.
      if (authors.value.length === 1 && pagination.current_page > 1) {
          fetchAuthors(pagination.current_page - 1);
      } else {
          fetchAuthors(pagination.current_page);
      }
    } catch (error) {
      console.error("Error deleting author:", error);
      const errorMsg = error.response?.status === 401 
        ? "Your session has expired." 
        : "Failed to delete the author.";
      alert(errorMsg);
    }
  };
  
  onMounted(() => {
    fetchAuthors();
  });
  </script>
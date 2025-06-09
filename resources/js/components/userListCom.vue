<template>
  <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <!-- User List Header -->
      <div class="bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 px-6 py-4 sm:px-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
            <svg class="w-6 h-6 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            User List
          </h2>
        </div>
      </div>
            
      <div class="p-4 sm:p-6">
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <!-- Loading, error, no users states -->
          <div v-if="loadingUsers" class="p-8 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading users...</span>
          </div>
          <div v-else-if="usersError" class="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
            {{ usersError }}
          </div>
          <div v-else-if="users.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            No users found.
          </div>
          <div v-else class="overflow-x-auto custom-scrollbar">
             <!-- Table remains the same -->
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">User</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Role</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Joined Date</th>
                  <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img v-if="user.profile_image_url" class="h-10 w-10 rounded-full object-cover" :src="user.profile_image_url" :alt="user.name + ' profile image'">
                        <span v-else class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold">
                          {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.name || 'N/A' }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ user.num || user.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ user.email || 'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="['px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize', roleClass(user.role)]">
                      {{ user.role || 'N/A' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ formatDate(user.created_at) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button @click="openUserDetailModal(user.id)" type="button" class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors font-medium">View</button>
                    <button @click="openEditUserModal(user)" type="button" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium">Edit</button>
                    <button @click="confirmDeleteUser(user.id)" v-if="user.role !== 'admin'" type="button" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination using UI Library -->
          <div v-if="!loadingUsers && users.length > 0 && pagination.total > pagination.per_page" class="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div class="text-sm text-gray-700 dark:text-gray-400">
                Showing <span class="font-semibold">{{ pagination.from }}</span> to <span class="font-semibold">{{ pagination.to }}</span> of <span class="font-semibold">{{ pagination.total }}</span> results
            </div>
            <Pagination
              v-slot="{ page }"
              v-model:page="pagination.current_page"
              :total="pagination.total"
              :items-per-page="pagination.per_page"
              :sibling-count="1"
              show-edges
              class="mx-auto sm:mx-0"
            >
              <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
                <PaginationPrevious />
                
                <!-- Page numbers - hidden on mobile for a cleaner look -->
                <div class="hidden sm:flex items-center gap-1">
                  <template v-for="(item, index) in items">
                    <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value">
                      {{ item.value }}
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

    <UserDetailModal
      :is-visible="showUserModal"
      :user-id="selectedUserId"
      @close="closeUserDetailModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import axios from 'axios';
import UserDetailModal from './userDetailCom.vue';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination' // Your UI library import path

// Assume `route` is globally available, e.g., from Ziggy in a Laravel app.
// const route = (name, params) => { /* ... your route function ... */ };

const users = ref([]);
const loadingUsers = ref(true);
const usersError = ref(null);

const showUserModal = ref(false);
const selectedUserId = ref(null);

// Enhanced pagination state for the UI library
const pagination = reactive({
    current_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: 10, // Default, will be updated by API
    last_page: 1,
});

const fetchUsers = async (page = 1) => {
  loadingUsers.value = true;
  usersError.value = null;
  try {
    const response = await axios.get(route('proxy.get', { endpoint: 'users', page: page }));
    if (response.data && response.data.status === true && response.data.data && Array.isArray(response.data.data.data)) {
      users.value = response.data.data.data;
      // Update pagination from the API response (assuming Laravel's pagination structure)
      const { current_page, from, to, total, per_page, last_page } = response.data.data;
      Object.assign(pagination, { current_page, from, to, total, per_page, last_page });
    } else {
      usersError.value = "Unexpected data format for user list.";
      users.value = [];
    }
  } catch (err) {
    usersError.value = "Failed to load users.";
    if (err.response) usersError.value += ` (Status: ${err.response.status})`;
    users.value = [];
  } finally {
    loadingUsers.value = false;
  }
};

// Watch for page changes from the Pagination component and fetch new data
watch(() => pagination.current_page, (newPage, oldPage) => {
    // Check if the page number has actually changed and component is not loading
    if (newPage !== oldPage && !loadingUsers.value) {
        fetchUsers(newPage);
    }
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) { return 'Invalid Date'; }
};

const roleClass = (role) => {
  if (role === 'admin') return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300';
  if (role === 'editor') return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300';
  return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
};

const openUserDetailModal = (userId) => {
  selectedUserId.value = userId;
  showUserModal.value = true;
};

const closeUserDetailModal = () => {
  showUserModal.value = false;
  selectedUserId.value = null;
};

const openEditUserModal = (user) => console.log("Edit user:", user);
const confirmDeleteUser = (userId) => {
  if(window.confirm(`Are you sure you want to delete user ID: ${userId}?`)) {
    console.log("Delete user:", userId);
  }
};

onMounted(() => {
  fetchUsers(pagination.current_page);
});
</script>
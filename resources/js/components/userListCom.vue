<template>
  <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <!-- User List Header -->
      <div class="bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 px-6 py-4 sm:px-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
            <svg class="w-6 h-6 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            User List
          </h2>
        </div>
      </div>


      <div class="p-4 sm:p-6">
        <div
          class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <!-- Loading, error, no users states -->
          <div v-if="loadingUsers"
            class="p-8 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>Loading users...</span>
          </div>
          <div v-else-if="usersError"
            class="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
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
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    User</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Email</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Role</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Joined Date</th>
                  <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="user in users" :key="user.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img v-if="user.profile_image_url" class="h-10 w-10 rounded-full object-cover"
                          :src="user.profile_image_url" :alt="user.name + ' profile image'">
                        <span v-else
                          class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold">
                          {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.name || 'N/A' }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ user.num || user.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ user.email ||
            'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="['px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize', roleClass(user.role)]">
                      {{ user.role || 'N/A' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{formatDate(user.created_at)|| 'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button @click="openUserDetailModal(user.id)" type="button"
                      class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors font-medium">View</button>
                    <button @click="openUserEditModal(user.id)" type="button"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium">Edit</button>
                    <button @click="openConfirmDeleteModal(user.id)" v-if="user.role !== 'admin'" type="button"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination using UI Library -->
          <div v-if="!loadingUsers && users.length > 0 && pagination.total > pagination.per_page"
            class="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div class="text-sm text-gray-700 dark:text-gray-400">
              Showing <span class="font-semibold">{{ pagination.from }}</span> to <span class="font-semibold">{{
            pagination.to }}</span> of <span class="font-semibold">{{ pagination.total }}</span> results
            </div>
            <Pagination v-slot="{ page }" v-model:page="pagination.current_page" :total="pagination.total"
              :items-per-page="pagination.per_page" :sibling-count="1" show-edges class="mx-auto sm:mx-0">
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

    <UserDetailModal :is-visible="showUserModal" :user-id="selectedUserId" @close="closeUserDetailModal" />

    <!-- NEW: User Edit Modal -->
  <UserEditModal
    :is-visible="showUserEditModal"
    :user-id="editingUserId"
    @close="closeUserEditModal"
    @saved="handleUserSaved"
  />
    <!-- NEW: Delete Confirmation Modal -->
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
                        User</h3>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this user?
                          This
                          action cannot be undone.</p>
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
import UserDetailModal from './userDetailCom.vue';
import { useToast } from 'vue-toastification';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination';
import UserEditModal from './userUpdateCom.vue';

const users = ref([]);
const loadingUsers = ref(true);
const usersError = ref(null);
const toast = useToast();

const showUserModal = ref(false);
const selectedUserId = ref(null);

// 2. Add state for the Edit Modal
const showUserEditModal = ref(false);
const editingUserId = ref(null);

// State for Delete Modal
const showConfirmDeleteModal = ref(false);
const userToDeleteId = ref(null);
const isDeleting = ref(false);

const pagination = reactive({
  current_page: 1, from: 0, to: 0, total: 0, per_page: 10, last_page: 1,
});

const fetchUsers = async (page = 1) => {
  loadingUsers.value = true;
  usersError.value = null;
  try {
    const response = await axios.get(route('proxy.get', { endpoint: 'users', page: page }));
    if (response.data?.status === true && Array.isArray(response.data.data?.data)) {
      users.value = response.data.data.data;
      const { current_page, from, to, total, per_page, last_page } = response.data.data;
      Object.assign(pagination, { current_page, from, to, total, per_page, last_page });
    } else {
      usersError.value = "Unexpected data format for user list.";
      users.value = [];
    }
  } catch (err) {
    if (err.response?.status === 401) {
      usersError.value = "You are not authorized. Please refresh the page.";
    } else {
      usersError.value = "Failed to load authors. Please try again later.";
    }
    console.error("Error fetching authors:", err);
    authors.value = [];
  } finally {
    loadingUsers.value = false;
  }
};

watch(() => pagination.current_page, (newPage) => {
  if (!loadingUsers.value) {
    fetchUsers(newPage);
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
const roleClass = (role) => {
  const baseClasses = 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize';
  const roleStyles = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300',
    editor: 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300',
    reader: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  return `${baseClasses} ${roleStyles[role] || roleStyles.default}`;
};

const openUserDetailModal = (userId) => {
  selectedUserId.value = userId;
  showUserModal.value = true;
};
const closeUserDetailModal = () => {
  showUserModal.value = false;
  selectedUserId.value = null;
};

// 3. Add functions to control the Edit Modal
const openUserEditModal = (id) => {
  editingUserId.value = id;
  showUserEditModal.value = true;
};

const closeUserEditModal = () => {
  showUserEditModal.value = false;
  editingUserId.value = null;
};

// --- DELETE LOGIC ---
const openConfirmDeleteModal = (userId) => {
  userToDeleteId.value = userId;
  showConfirmDeleteModal.value = true;
};

const closeConfirmDeleteModal = () => {
  showConfirmDeleteModal.value = false;
  userToDeleteId.value = null;
};

const handleUserSaved = () => {
  closeUserEditModal();
  fetchUsers(pagination.current_page); // Refresh the list
};

const confirmDelete = async () => {
  if (!userToDeleteId.value) return;

  isDeleting.value = true;
  try {
    await axios.delete(route('proxy.delete'), {
      params: { endpoint: `users/${userToDeleteId.value}` }
    });
    toast.success('User deleted successfully!');
    // Refresh the list after deletion
    if (users.value.length === 1 && pagination.current_page > 1) {
      fetchUsers(pagination.current_page - 1);
    } else {
      fetchUsers(pagination.current_page);
    }
  } catch (err) {
    console.error(`Error deleting user ID ${userToDeleteId.value}:`, err);
    toast.error('Failed to delete the user. Please try again.');
  } finally {
    isDeleting.value = false;
    closeConfirmDeleteModal();
  }
};

onMounted(() => {
  fetchUsers(pagination.current_page);
});
</script>
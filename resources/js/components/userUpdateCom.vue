<template>
    <Teleport to="body">
      <transition
        enter-active-class="ease-out duration-200" 
        enter-from-class="opacity-0" 
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-150" 
        leave-from-class="opacity-100" 
        leave-to-class="opacity-0"
      >
        <div v-if="isVisible" class="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm" @click.self="$emit('close')">
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <transition
              enter-active-class="ease-out duration-200" 
              enter-from-class="opacity-0 scale-95" 
              enter-to-class="opacity-100 scale-100"
              leave-active-class="ease-in duration-150" 
              leave-from-class="opacity-100 scale-100" 
              leave-to-class="opacity-0 scale-95"
            >
              <form @submit.prevent="handleSubmit" class="relative bg-white dark:bg-gray-900 w-full max-w-2xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Edit User</h2>
                  <button @click="$emit('close')" type="button" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
                
                <!-- Modal Body (Form Fields) -->
                <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  <!-- Loading/Error State -->
                  <div v-if="loading" class="text-center py-10">
                    <div class="inline-flex items-center justify-center">
                      <svg class="animate-spin h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span class="ml-3 text-gray-600 dark:text-gray-400">Loading user data...</span>
                    </div>
                  </div>
                  <div v-else-if="fetchError" class="text-center py-6 px-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                    <p class="text-red-600 dark:text-red-400 font-medium">{{ fetchError }}</p>
                  </div>
                  
                  <!-- Form Fields (shown only when data is loaded) -->
                  <div v-else class="space-y-6">
                    <!-- Full Name -->
                    <div>
                      <label for="user_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input v-model="formData.name" type="text" id="user_name" required class="w-full px-4 py-2.5 rounded-lg border ..." placeholder="Enter full name">
                    </div>
  
                    <!-- Email -->
                    <div>
                      <label for="user_email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input v-model="formData.email" type="email" id="user_email" required class="w-full px-4 py-2.5 rounded-lg border ..." placeholder="user@example.com">
                    </div>

                    <div>
                      <label for="user_phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                      <input v-model="formData.phone" type="text" id="user_phone" required class="w-full px-4 py-2.5 rounded-lg border ..." placeholder="+911234567890">
                    </div>
  
                    <!-- Role -->
                    <div>
                      <label for="user_role" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                      <select v-model="formData.role" id="user_role" required class="w-full px-4 py-2.5 rounded-lg border ...">
                        <option value="reader">Reader</option>
                        <option value="editor">Author</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    
                    <!-- Bio -->
                    <div>
                      <label for="user_bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                      <textarea v-model="formData.bio" id="user_bio" rows="3" class="w-full px-4 py-2.5 rounded-lg border ..." placeholder="A short bio about the user"></textarea>
                    </div>
                    
                    <!-- Profile Image URL -->
                    <div>
                      <label for="user_profile_image_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image URL</label>
                      <input v-model="formData.profile_image_url" type="url" id="user_profile_image_url" class="w-full px-4 py-2.5 rounded-lg border ..." placeholder="https://example.com/avatar.jpg">
                    </div>
                  </div>
                  
                  <div v-if="saveError" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg ...">
                    <p class="text-sm text-red-600 dark:text-red-400">{{ saveError }}</p>
                  </div>
                </div>
    
                <!-- Modal Footer -->
                <div class="flex items-center justify-end p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <button @click="$emit('close')" type="button" class="px-5 py-2.5 text-sm font-medium rounded-lg border ...">Cancel</button>
                  <button type="submit" :disabled="isSaving || loading" class="ml-3 px-5 py-2.5 text-sm font-medium rounded-lg bg-purple-600 hover:bg-purple-700 text-white ...">
                    <span v-if="isSaving" class="inline-flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"></svg>
                      Saving...
                    </span>
                    <span v-else>Save Changes</span>
                  </button>
                </div>
              </form>
            </transition>
          </div>
        </div>
      </transition>
    </Teleport>
  </template>
    
  <script setup>
  import { ref, watch } from 'vue';
  import axios from 'axios';
  import { useToast } from 'vue-toastification';
  
  const props = defineProps({
    isVisible: { type: Boolean, default: false },
    userId: { type: [Number, String], default: null },
  });
  
  const emit = defineEmits(['close', 'saved']);
  const toast = useToast();
  
  const formData = ref({});
  const isSaving = ref(false);
  const loading = ref(false);
  const fetchError = ref(null);
  const saveError = ref(null);
  
  const fetchUserDetails = async (id) => {
    if (!id) return;
  
    loading.value = true;
    fetchError.value = null;
    formData.value = {}; // Reset form data
  
    try {
      const response = await axios.get(route('proxy.get', { endpoint: `users/${id}` }));
      if (response.data?.status === true && response.data.data) {
        const user = response.data.data;
        // Pre-fill the form with the fetched user data
        formData.value = {
          name: user.name || '',
          email: user.email || '',
          role: user.role || 'reader',
          bio: user.bio || '',
          phone: user.phone || '',
          profile_image_url: user.profile_image_url || '',
        };
      } else {
        throw new Error("User data not found.");
      }
    } catch (err) {
      console.error("Failed to fetch user for editing:", err);
      fetchError.value = "Could not load user details. Please close and try again.";
    } finally {
      loading.value = false;
    }
  };
  
  // Watch for the modal to become visible and fetch data
  watch(() => props.isVisible, (newValue) => {
    if (newValue && props.userId) {
      fetchUserDetails(props.userId);
    }
  });
  
  const handleSubmit = async () => {
    if (!props.userId) return;
  
    isSaving.value = true;
    saveError.value = null;
    
    try {
      await axios.put(route('proxy.put'), formData.value, {
          params: { endpoint: `users/${props.userId}` }
      });
      
      toast.success('User updated successfully!');
      emit('saved');
    } catch (err) {
        saveError.value = err.response?.data?.message || "An error occurred while saving the user.";
        console.error("Failed to update user:", err);
        toast.error(saveError.value);
    } finally {
      isSaving.value = false;
    }
  };
  </script>
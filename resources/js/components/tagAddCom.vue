<!-- addTag.vue -->
<template>
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
          <form @submit.prevent="handleSubmit" class="relative bg-white dark:bg-gray-900 w-full max-w-lg mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Add New Tag</h2>
              <button 
                @click="$emit('close')" 
                type="button" 
                class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            
            <!-- Modal Body (Form Fields) -->
            <div class="p-6 space-y-6">
              <!-- Tag Name -->
              <div>
                <label for="new_tag_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tag Name</label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  id="new_tag_name" 
                  required 
                  class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., Vue.js, Laravel"
                >
              </div>

              <!-- Slug -->
              <div>
                <label for="new_tag_slug" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (Optional)</label>
                <input 
                  v-model="formData.slug" 
                  type="text" 
                  id="new_tag_slug" 
                  class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., vue-js (auto-generated if empty)"
                >
              </div>
              
              <div v-if="saveError" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                <p class="text-sm text-red-600 dark:text-red-400">{{ saveError }}</p>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end items-center px-6 py-4 space-x-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
              <button @click="$emit('close')" type="button" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                Cancel
              </button>
              <button type="submit" :disabled="isSaving" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isSaving ? 'Saving...' : 'Create Tag' }}</span>
              </button>
            </div>
          </form>
        </transition>
      </div>
    </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import axios from 'axios'; // Use configured axios
  import { useToast } from 'vue-toastification';
  
  const props = defineProps({
    isVisible: { type: Boolean, default: false },
  });
  
  const emit = defineEmits(['close', 'saved']);
  const toast = useToast();
  
  const initialFormData = {
    name: '',
    slug: '',
  };
  
  const formData = ref({ ...initialFormData });
  const isSaving = ref(false);
  const saveError = ref(null);
  
  // Watch for the modal to become visible and reset the form
  watch(() => props.isVisible, (newValue) => {
    if (newValue) {
      formData.value = { ...initialFormData }; // Reset form
      saveError.value = null; // Clear previous errors
    }
  });
  
  const handleSubmit = async () => {
    isSaving.value = true;
    saveError.value = null;
    
    try {
      // Using POST method for creation
      await axios.post(route('proxy.post'), formData.value, {
          params: { endpoint: 'tags' } // Endpoint for creating new tags
      });
      
      toast.success('Tag created successfully!');
      emit('saved'); // Notify the parent component to refresh its list
    } catch (err) {
      saveError.value = err.response?.data?.message || "An error occurred while creating the tag.";
      console.error("Failed to create tag:", err);
      toast.error(saveError.value);
    } finally {
      isSaving.value = false;
    }
  };
  </script>
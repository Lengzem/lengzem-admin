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
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Add New Category</h2>
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
                <!-- Category Name -->
                <div>
                  <label for="new_category_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
                  <input 
                    v-model="formData.name" 
                    type="text" 
                    id="new_category_name" 
                    required 
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g., Technology, Lifestyle"
                  >
                </div>
  
                <!-- Slug -->
                <div>
                  <label for="new_category_slug" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (Optional)</label>
                  <input 
                    v-model="formData.slug" 
                    type="text" 
                    id="new_category_slug" 
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g., technology-news (auto-generated if empty)"
                  >
                </div>
                
                <!-- Description -->
                <div>
                  <label for="new_category_description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea 
                    v-model="formData.description" 
                    id="new_category_description" 
                    rows="3" 
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="A brief description of the category"
                  ></textarea>
                </div>
                
                <div v-if="saveError" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ saveError }}</p>
                </div>
              </div>
  
              <!-- Modal Footer -->
              <div class="flex items-center justify-end p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <button @click="$emit('close')" type="button" class="px-5 py-2.5 text-sm font-medium rounded-lg border ...">
                  Cancel
                </button>
                <button type="submit" :disabled="isSaving" class="ml-3 px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 ...">
                  <span v-if="isSaving">Creating...</span>
                  <span v-else>Create Category</span>
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
  import axios from 'axios';
  import { useToast } from 'vue-toastification';
  
  const props = defineProps({
    isVisible: { type: Boolean, default: false },
  });
  
  const emit = defineEmits(['close', 'saved']);
  const toast = useToast();
  
  const initialFormData = {
    name: '',
    slug: '',
    description: ''
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
          params: { endpoint: 'categories' } // Endpoint for creating new categories
      });
      
      toast.success('Category created successfully!');
      emit('saved'); // Notify the parent component to refresh its list
    } catch (err) {
      saveError.value = err.response?.data?.message || "An error occurred while creating the category.";
      console.error("Failed to create category:", err);
      toast.error(saveError.value);
    } finally {
      isSaving.value = false;
    }
  };
  </script>
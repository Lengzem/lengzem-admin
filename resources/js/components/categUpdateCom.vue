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
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Edit Category</h2>
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
              <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <!-- Loading/Error State -->
                <div v-if="loading" class="text-center py-10">
                  <div class="inline-flex items-center justify-center">
                    <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="ml-3 text-gray-600 dark:text-gray-400">Loading category data...</span>
                  </div>
                </div>
                <div v-else-if="fetchError" class="text-center py-6 px-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                  <p class="text-red-600 dark:text-red-400 font-medium">{{ fetchError }}</p>
                </div>
                
                <!-- Form Fields (shown only when data is loaded) -->
                <div v-else class="space-y-6">
                  <!-- Category Name -->
                  <div>
                    <label for="category_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
                    <input 
                      v-model="formData.name" 
                      type="text" 
                      id="category_name" 
                      required 
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g., Technology, Lifestyle"
                    >
                  </div>

                  <div>
                    <label for="category_slug" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Slug</label>
                    <input 
                      v-model="formData.slug" 
                      type="text" 
                      id="category_slug" 
                      required 
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g., Technology, Lifestyle"
                    >
                  </div>
                  
                  <!-- Description -->
                  <div>
                    <label for="category_description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea 
                      v-model="formData.description" 
                      id="category_description" 
                      rows="3" 
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="A brief description of the category"
                    ></textarea>
                  </div>
                </div>
                
                <div v-if="saveError" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ saveError }}</p>
                </div>
              </div>
  
              <!-- Modal Footer -->
              <div class="flex items-center justify-end p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <button @click="$emit('close')" type="button" class="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" :disabled="isSaving || loading" class="ml-3 px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span v-if="isSaving">Saving...</span>
                  <span v-else>Save Changes</span>
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
    categoryId: { type: [Number, String], default: null },
  });
  
  const emit = defineEmits(['close', 'saved']);
  const toast = useToast();
  
  const formData = ref({
    name: '',
    description: ''
  });
  const isSaving = ref(false);
  const loading = ref(false);
  const fetchError = ref(null);
  const saveError = ref(null);
  
  const fetchCategoryDetails = async (id) => {
    if (!id) return;
  
    loading.value = true;
    fetchError.value = null;
    formData.value = { name: '', description: '' }; // Reset form
  
    try {
      const response = await axios.get(route('proxy.get', { endpoint: `categories/${id}` }));
      if (response.data?.status === true && response.data.data) {
        const category = response.data.data;
        formData.value = {
          name: category.name || '',
          slug: category.slug || '',
          description: category.description || '',
        };
      } else {
        throw new Error("Category data not found.");
      }
    } catch (err) {
      console.error("Failed to fetch category for editing:", err);
      fetchError.value = "Could not load category details. Please close and try again.";
    } finally {
      loading.value = false;
    }
  };
  
  // Watch for the modal to become visible and fetch data
  watch(() => props.isVisible, (newValue) => {
    if (newValue && props.categoryId) {
      fetchCategoryDetails(props.categoryId);
    }
  });
  
  const handleSubmit = async () => {
    if (!props.categoryId) return;
  
    isSaving.value = true;
    saveError.value = null;
    
    try {
      await axios.put(route('proxy.put'), formData.value, {
          params: { endpoint: `categories/${props.categoryId}` }
      });
      
      toast.success('Category updated successfully!');
      emit('saved'); // Notify the parent component
    } catch (err) {
      saveError.value = err.response?.data?.message || "An error occurred while saving the category.";
      console.error("Failed to update category:", err);
      toast.error(saveError.value);
    } finally {
      isSaving.value = false;
    }
  };
  </script>
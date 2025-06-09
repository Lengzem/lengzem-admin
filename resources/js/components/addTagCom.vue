<!-- addTag.vue -->
<template>
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" @click.self="closeModal">
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div v-if="isVisible" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 transform">
            <!-- Modal Header -->
            <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {{ formTitle }}
              </h3>
              <button @click="closeModal" class="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
  
            <!-- Modal Body -->
            <form @submit.prevent="submitForm" class="p-6 space-y-4">
              <div>
                <label for="tagName" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tag Name</label>
                <input 
                  type="text" 
                  id="tagName" 
                  v-model="tagName" 
                  ref="tagNameInput"
                  class="block w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200" 
                  :class="{ 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500': errors.name }"
                  placeholder="e.g., Technology"
                  required
                >
                <p v-if="errors.name" class="mt-1 text-xs text-red-500 dark:text-red-400">{{ errors.name[0] }}</p>
                <p v-if="errors.general" class="mt-1 text-xs text-red-500 dark:text-red-400">{{ errors.general }}</p>
              </div>
            </form>
  
            <!-- Modal Footer -->
            <div class="flex justify-end items-center px-6 py-4 space-x-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
               <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                  Cancel
               </button>
               <button 
                  type="button" 
                  @click="submitForm"
                  :disabled="isLoading" 
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isLoading ? 'Saving...' : 'Save Tag' }}</span>
               </button>
            </div>
  
          </div>
        </transition>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, watch, computed, nextTick } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    isVisible: { type: Boolean, required: true },
    tagData: { type: Object, default: null } // For future editing functionality
  });
  
  const emit = defineEmits(['close', 'saved']);
  
  const tagName = ref('');
  const isLoading = ref(false);
  const errors = ref({});
  const tagNameInput = ref(null);
  
  const formTitle = computed(() => props.tagData ? 'Edit Tag' : 'Add New Tag');
  
  const closeModal = () => {
    if (!isLoading.value) {
      emit('close');
    }
  };
  
  const submitForm = async () => {
      isLoading.value = true;
      errors.value = {};
      
      const payload = {
          name: tagName.value
      };
  
      try {
          // As requested, this uses axios.post.
          // NOTE: The user mentioned `route('proxy.post', ...)`. If you are using Laravel/Inertia.js
          // with Ziggy, you should replace the URL string with your route helper.
          const response = await axios.post(route('proxy.post'), payload,{
            params:{
                endpoint: 'tags'
            }
          });
  
          emit('saved', response.data.data); // Emitting the new tag data
          closeModal();
  
      } catch (error) {
          if (error.response && error.response.status === 422) {
              // Handle validation errors from Laravel
              errors.value = error.response.data.errors;
          } else {
              // Handle other errors (network, server error)
              console.error('An unexpected error occurred:', error);
              errors.value = { general: 'An unexpected error occurred. Please try again.' };
          }
      } finally {
          isLoading.value = false;
      }
  };
  
  // Watch for the modal visibility to change
  watch(() => props.isVisible, async (newValue) => {
      if (newValue) {
          // Reset form state when modal becomes visible
          errors.value = {};
          if (props.tagData) {
              tagName.value = props.tagData.name; // Pre-fill for editing
          } else {
              tagName.value = ''; // Clear for adding
          }
          // Focus the input field
          await nextTick();
          tagNameInput.value?.focus();
      }
  });
  </script>
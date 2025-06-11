<!-- addAuthor.vue -->
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
          <div v-if="isVisible" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4 transform">
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
            <form @submit.prevent="submitForm" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <!-- General Error -->
              <div v-if="errors.general" class="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300" role="alert">
                {{ errors.general }}
              </div>

              <!-- Author Name -->
              <div>
                <label for="authorName" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Author Name</label>
                <input 
                  type="text" 
                  id="authorName" 
                  v-model="form.name" 
                  ref="authorNameInput"
                  class="block w-full px-3 py-2 rounded-lg"
                  :class="[errors.name ? 'input-error' : 'input-default']"
                  placeholder="e.g., John Doe"
                  required
                >
                <p v-if="errors.name" class="mt-1 text-xs text-red-500 dark:text-red-400">{{ errors.name[0] }}</p>
              </div>

              <!-- Author Email -->
              <div>
                <label for="authorEmail" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input 
                  type="email" 
                  id="authorEmail" 
                  v-model="form.email" 
                  class="block w-full px-3 py-2 rounded-lg"
                  :class="[errors.email ? 'input-error' : 'input-default']"
                  placeholder="e.g., john.doe@example.com"
                  required
                >
                <p v-if="errors.email" class="mt-1 text-xs text-red-500 dark:text-red-400">{{ errors.email[0] }}</p>
              </div>
              
              <!-- Password Fields -->
              <div>
                <label for="authorPassword" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input 
                  type="password" 
                  id="authorPassword" 
                  v-model="form.password" 
                  class="block w-full px-3 py-2 rounded-lg"
                  :class="[errors.password ? 'input-error' : 'input-default']"
                  :placeholder="isEditMode ? 'Leave blank to keep current password' : 'Enter a strong password'"
                  :required="!isEditMode"
                >
                <p v-if="errors.password" class="mt-1 text-xs text-red-500 dark:text-red-400">{{ errors.password[0] }}</p>
              </div>

              <div>
                <label for="authorPasswordConfirmation" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                <input 
                  type="password" 
                  id="authorPasswordConfirmation" 
                  v-model="form.password_confirmation" 
                  class="block w-full px-3 py-2 rounded-lg"
                  :class="[errors.password_confirmation ? 'input-error' : 'input-default']"
                  placeholder="Re-enter password"
                  :required="!isEditMode || (isEditMode && form.password)"
                >
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
                  <span>{{ isLoading ? 'Saving...' : 'Save Author' }}</span>
               </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
</template>
  
<script setup>
  import { ref, watch, computed, nextTick, reactive } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/authStore';
  
  const props = defineProps({
    isVisible: { type: Boolean, required: true },
    authorData: { type: Object, default: null }
  });
  
  const emit = defineEmits(['close', 'saved']);
  
  const authStore = useAuthStore();
  const isLoading = ref(false);
  const errors = ref({});
  const authorNameInput = ref(null);
  
  const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const isEditMode = computed(() => !!props.authorData);
  const formTitle = computed(() => isEditMode.value ? 'Edit Author' : 'Add New Author');
  
  const resetForm = () => {
    form.name = isEditMode.value ? props.authorData.name : '';
    form.email = isEditMode.value ? props.authorData.email : '';
    form.password = '';
    form.password_confirmation = '';
    errors.value = {};
  };

  const closeModal = () => {
    if (!isLoading.value) {
      emit('close');
    }
  };
  
  const submitForm = async () => {
      if (!authStore.token) {
        errors.value = { general: "Authentication required. Please log in." };
        return;
      }
      
      isLoading.value = true;
      errors.value = {};
      
      const payload = {
        name: form.name,
        email: form.email,
      };

      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      
      try {
          const config = {
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Accept': 'application/json',
            }
          };

          let response;
          if (isEditMode.value) {
            // Update existing author (PUT request)
            response = await axios.put(route('proxy.put', { endpoint: `authors/${props.authorData.id}` }), payload, config);
          } else {
            // Create new author (POST request)
            response = await axios.post(route('proxy.post', { endpoint: 'authors' }), payload, config);
          }
  
          emit('saved', response.data.data);
          closeModal();
  
      } catch (error) {
          if (error.response) {
            if (error.response.status === 422) {
              errors.value = error.response.data.errors;
            } else if (error.response.status === 401) {
              errors.value = { general: "Your session has expired. Please log in again." };
            } else {
              errors.value = { general: 'An unexpected server error occurred. Please try again.' };
            }
          } else {
              errors.value = { general: 'A network error occurred. Please check your connection.' };
          }
          console.error('An error occurred:', error);
      } finally {
          isLoading.value = false;
      }
  };
  
  watch(() => props.isVisible, async (newValue) => {
      if (newValue) {
          resetForm();
          await nextTick();
          authorNameInput.value?.focus();
      }
  });
</script>

<style scoped>
.input-default {
  @apply border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200;
}
.input-error {
  @apply border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500;
}
</style>
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
      <div class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 overflow-y-auto">
        <transition
          enter-active-class="ease-out duration-200" 
          enter-from-class="opacity-0 scale-95" 
          enter-to-class="opacity-100 scale-100"
          leave-active-class="ease-in duration-150" 
          leave-from-class="opacity-100 scale-100" 
          leave-to-class="opacity-0 scale-95"
        >
          <form v-if="isVisible" @submit.prevent="handleSubmit" class="relative bg-white dark:bg-gray-800 w-full max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Add New Advertisement</h2>
              <button @click="$emit('close')" type="button" class="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Close">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <!-- Modal Body (Form Fields) -->
            <div class="p-6 space-y-6">
              <!-- Basic Info -->
              <div>
                <label for="ad_title" class="form-label">Title <span class="text-red-500">*</span></label>
                <input v-model="formData.title" id="ad_title" type="text" required class="form-input" placeholder="e.g., Summer Sale 2023">
              </div>
              <div>
                <label for="ad_description" class="form-label">Description</label>
                <textarea v-model="formData.description" id="ad_description" rows="3" class="form-input" placeholder="A brief summary of the ad campaign..."></textarea>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label for="ad_type" class="form-label">Ad Type <span class="text-red-500">*</span></label>
                  <select v-model.number="formData.type_id" id="ad_type" required class="form-input">
                    <option value="" disabled>Select a type</option>
                    <option v-for="type in adTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                  </select>
                  <p v-if="loadingTypes" class="text-xs text-gray-500 dark:text-gray-400 mt-1">Loading types...</p>
                </div>
                <div>
                  <label for="ad_status" class="form-label">Status</label>
                  <select v-model="formData.status" id="ad_status" class="form-input">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label for="ad_start_date" class="form-label">Start Date</label>
                  <input v-model="formData.start_date" id="ad_start_date" type="date" class="form-input">
                </div>
                <div>
                  <label for="ad_end_date" class="form-label">End Date</label>
                  <input v-model="formData.end_date" id="ad_end_date" type="date" class="form-input">
                </div>
              </div>

              <!-- Dynamic Media Section -->
              <div class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 class="text-base font-semibold text-gray-800 dark:text-gray-200">Media Assets</h4>
                <div v-if="formData.media.length === 0" class="text-center text-sm text-gray-500 dark:text-gray-400 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  No media assets added yet.
                </div>
                <div v-for="(mediaItem, index) in formData.media" :key="index" class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-3 relative bg-gray-50 dark:bg-gray-700/50">
                   <button @click.prevent="removeMediaItem(index)" type="button" class="absolute -top-2 -right-2 p-1 bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-800/70 transition-colors">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div class="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                    <div class="sm:col-span-3">
                      <label :for="`media_url_${index}`" class="form-label text-xs">URL <span class="text-red-500">*</span></label>
                      <input v-model="mediaItem.url" :id="`media_url_${index}`" type="url" required class="form-input text-sm" placeholder="https://example.com/image.jpg">
                    </div>
                    <div class="sm:col-span-2">
                      <label :for="`media_type_${index}`" class="form-label text-xs">Type</label>
                      <select v-model="mediaItem.type" :id="`media_type_${index}`" class="form-input text-sm">
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button @click.prevent="addMediaItem" type="button" class="w-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 p-3 flex items-center justify-center space-x-2 transition-colors">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  <span>Add Media Asset</span>
                </button>
              </div>

              <!-- Submission Error -->
              <div v-if="saveError" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ saveError }}</p>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end items-center px-6 py-4 space-x-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
              <button @click="$emit('close')" type="button" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                Cancel
              </button>
              <button type="submit" :disabled="isSaving" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>{{ isSaving ? 'Saving...' : 'Create Ad' }}</span>
              </button>
            </div>
          </form>
        </transition>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
.form-input { @apply w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all; }
</style>

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
  title: '',
  description: '',
  type_id: '',
  start_date: '',
  end_date: '',
  status: 'active',
  media: [],
};

const formData = ref({ ...initialFormData });
const adTypes = ref([]);
const loadingTypes = ref(false);
const isSaving = ref(false);
const saveError = ref(null);

const fetchAdTypes = async () => {
  if (adTypes.value.length > 0) return; // Don't refetch if already loaded
  loadingTypes.value = true;
  try {
    const response = await axios.get(route('proxy.get'), { params: { endpoint: 'ads/types' } });
    if (response.data?.status && Array.isArray(response.data.data)) {
      adTypes.value = response.data.data;
    } 
  } catch (err) {
    toast.error("Could not load ad types.");
  } finally {
    loadingTypes.value = false;
  }
};

const addMediaItem = () => {
  formData.value.media.push({ url: '', type: 'image' });
};

const removeMediaItem = (index) => {
  formData.value.media.splice(index, 1);
};

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    // Reset form and fetch necessary data when modal becomes visible
    formData.value = { ...initialFormData, media: [] };
    saveError.value = null;
    fetchAdTypes();
  }
});

const handleSubmit = async () => {
  isSaving.value = true;
  saveError.value = null;
  
  try {
    await axios.post(route('proxy.post'), formData.value, {
      params: { endpoint: 'ads' }
    });
    
    toast.success('Advertisement created successfully!');
    emit('saved'); // Notify parent to refresh list and close
  } catch (err) {
    saveError.value = err.response?.data?.message || "An error occurred while creating the ad.";
    toast.error(saveError.value);
  } finally {
    isSaving.value = false;
  }
};
</script>
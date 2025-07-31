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
            <form @submit.prevent="handleSubmit" class="relative bg-white dark:bg-gray-900 w-full max-w-2xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Add New Video</h2>
                <button @click="$emit('close')" type="button" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                </button>
              </div>

              <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <!-- Title -->
                <div>
                  <label for="video_title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title <span class="text-red-500">*</span></label>
                  <input v-model="formData.title" type="text" id="video_title" required class="form-input" placeholder="Enter video title">
                </div>

                <!-- URLs: Main Video and Thumbnail -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label for="video_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL <span class="text-red-500">*</span></label>
                    <input v-model="formData.url" type="url" id="video_url" required class="form-input" placeholder="https://.../manifest.mpd">
                  </div>
                  <div>
                    <label for="thumbnail_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail URL</label>
                    <input v-model="formData.thumbnail_url" type="url" id="thumbnail_url" class="form-input" placeholder="https://.../image.jpg">
                  </div>
                </div>
                 <!-- Thumbnail Preview with error handling -->
                <div v-if="formData.thumbnail_url" class="mt-2">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Thumbnail Preview:</p>
                  <img :src="formData.thumbnail_url" alt="Thumbnail preview" class="max-h-32 rounded-lg border border-gray-200 dark:border-gray-600 object-cover" @error="formData.thumbnail_url = ''" />
                </div>

                <!-- Author and Status -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label for="video_status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select v-model="formData.status" id="video_status" class="form-input">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <!-- Release Date and Duration -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label for="release_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Release Date</label>
                    <input v-model="formData.release_date" type="date" id="release_date" class="form-input">
                  </div>
                  <div>
                    <label for="duration" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                    <input v-model="formData.duration" type="text" id="duration" class="form-input" placeholder="e.g., 00:15:30">
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label for="video_description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea v-model="formData.description" id="video_description" rows="3" class="form-input" placeholder="A brief description of the video"></textarea>
                </div>

                <!-- Premium Checkbox -->
                <div class="flex items-center">
                    <input v-model="formData.is_premium" id="is_premium" type="checkbox" class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:checked:bg-blue-500">
                    <label for="is_premium" class="ml-2 block text-sm text-gray-900 dark:text-gray-200">This is a premium video</label>
                </div>

                <div v-if="saveError" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ saveError }}</p>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="flex items-center justify-end p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <button @click="$emit('close')" type="button" class="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  Cancel
                </button>
                <button type="submit" :disabled="isSaving" class="ml-3 px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <span v-if="isSaving">Creating...</span>
                  <span v-else>Create Video</span>
                </button>
              </div>
            </form>
          </transition>
        </div>
      </div>
    </transition>
  </template>

  <style scoped>
  .form-input {
      @apply w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all;
  }
  </style>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps({
  isVisible: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'saved']);
const toast = useToast();
const authStore = useAuthStore();

const isSaving = ref(false);
const saveError = ref(null);

// Ensure UID is reactive after authStore is ready
const uid = ref(null);
watch(
  () => authStore.user,
  (user) => {
    uid.value = user?.uid || null;
  },
  { immediate: true }
);

// Initial form data factory function
const createInitialFormData = () => ({
  title: '',
  description: '',
  url: '',
  thumbnail_url: '',
  author_id: uid.value, // This will get set when modal opens
  status: 'draft',
  release_date: '',
  is_premium: false,
  duration: '',
  language: 'Mizo',
});

const formData = ref(createInitialFormData());

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    formData.value = createInitialFormData();
    formData.value.author_id = uid.value;
    saveError.value = null;
  }
});

const handleSubmit = async () => {
  if (!uid.value) {
    saveError.value = 'User UID is not available.';
    toast.error(saveError.value);
    return;
  }

  isSaving.value = true;
  saveError.value = null;

  try {
    const payload = {
      ...formData.value,
      author_id: uid.value,
    };

    console.log("🚀 Submitting video:", payload);

    await axios.post(route('proxy.post'), payload, {
      params: { endpoint: 'videos' },
    });

    toast.success('✅ Video created successfully!');
    emit('saved');
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'An error occurred while creating the video.';

    saveError.value = errorMessage;
    console.error("❌ Submission Error:", err.response?.data || err.message);
    if (err.config?.data) {
      try {
        console.error("📋 Sent Data:", JSON.parse(err.config.data));
      } catch (_) {}
    }

    toast.error(errorMessage);
  } finally {
    isSaving.value = false;
  }
};
</script>

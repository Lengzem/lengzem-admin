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
            <!-- Form container with increased width for more fields -->
            <form @submit.prevent="handleSubmit" class="relative bg-white dark:bg-gray-900 w-full max-w-2xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Add New Audio</h2>
                <button @click="$emit('close')" type="button" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                </button>
              </div>

              <!-- Modal Body with audio form fields -->
              <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <!-- Title -->
                <div>
                  <label for="audio_title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title <span class="text-red-500">*</span></label>
                  <input v-model="formData.title" type="text" id="audio_title" required class="form-input" placeholder="Enter audio title">
                </div>

                <!-- URLs: Main Audio and Thumbnail (for cover art) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label for="audio_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Audio URL <span class="text-red-500">*</span></label>
                    <input v-model="formData.url" type="url" id="audio_url" required class="form-input" placeholder="https://.../audio.mp3">
                  </div>
                  <div>
                    <label for="thumbnail_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Art URL</label>
                    <input v-model="formData.thumbnail_url" type="url" id="thumbnail_url" class="form-input" placeholder="https://.../cover-art.jpg">
                  </div>
                </div>
                 <!-- Thumbnail Preview -->
                <div v-if="formData.thumbnail_url" class="mt-2">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Cover Art Preview:</p>
                  <img :src="formData.thumbnail_url" alt="Cover Art preview" class="max-h-32 rounded-lg border border-gray-200 dark:border-gray-600 object-cover" @error="formData.thumbnail_url = ''" />
                </div>

                <!-- Author and Status -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label for="audio_author" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author <span class="text-red-500">*</span></label>
                    <select v-model="formData.author_id" id="audio_author" required class="form-input">
                      <option value="" disabled>Select an author</option>
                      <option v-for="author in authors" :key="author.id" :value="author.id">{{ author.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label for="audio_status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select v-model="formData.status" id="audio_status" class="form-input">
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
                    <input v-model="formData.duration" type="text" id="duration" class="form-input" placeholder="e.g., 00:04:20">
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label for="audio_description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea v-model="formData.description" id="audio_description" rows="3" class="form-input" placeholder="A brief description of the audio track"></textarea>
                </div>

                <!-- Premium Checkbox -->
                <div class="flex items-center">
                    <input v-model="formData.is_premium" id="is_premium_audio" type="checkbox" class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:checked:bg-blue-500">
                    <label for="is_premium_audio" class="ml-2 block text-sm text-gray-900 dark:text-gray-200">This is a premium audio track</label>
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
                  <span v-else>Create Audio</span>
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

  const props = defineProps({
    isVisible: { type: Boolean, default: false },
  });

  const emit = defineEmits(['close', 'saved']);
  const toast = useToast();

  // Initial form data for an audio track
  const initialFormData = {
    title: '',
    description: '',
    url: '',
    thumbnail_url: '',
    author_id: '',
    status: 'draft',
    release_date: '',
    is_premium: false,
    duration: '',
    language: 'Mizo' // Default language if needed
  };

  const formData = ref({ ...initialFormData });
  const isSaving = ref(false);
  const saveError = ref(null);

  const authors = ref([]);

  // Fetch authors when the modal becomes visible
  const fetchAuthors = async () => {
    if (authors.value.length > 0) return;

    try {
      const response = await axios.get(route('proxy.get'), { params: { endpoint: 'users/editors' } });
      if (response.data?.status && Array.isArray(response.data.data?.data)) {
        authors.value = response.data.data.data.map(author => ({
          id: author.id, // Use UID for Firebase ID
          name: author.pen_name || author.name,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch authors:", err);
      toast.error("Could not load authors list.");
    }
  };

  watch(() => props.isVisible, (newValue) => {
    if (newValue) {
      formData.value = { ...initialFormData };
      saveError.value = null;
      fetchAuthors(); // Fetch authors when modal opens
    }
  });

  const handleSubmit = async () => {
    isSaving.value = true;
    saveError.value = null;

    try {
        console.log("video data:", formData.value)
      // THE ONLY CORE CHANGE: Endpoint is now 'audios'
      await axios.post(route('proxy.post'), formData.value, {
          params: { endpoint: 'audios' }
      });

      toast.success('Audio created successfully!');
      emit('saved');
    } catch (err) {
      saveError.value = err.response?.data?.message || "An error occurred while creating the audio.";
      console.error("Failed to create audio:", err.response.data);
      toast.error(saveError.value);
    } finally {
      isSaving.value = false;
    }
  };
  </script>

<template>
    <Teleport to="body">
      <transition
        enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
      >
        <div v-if="isVisible" class="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm" @click.self="$emit('close-modal')">
          <div class="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <transition
              enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
              leave-active-class="ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95"
            >
              <div v-if="isVisible" class="relative bg-white dark:bg-gray-800 w-full max-w-4xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-4 sm:p-5 rounded-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
                  <h2 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">Edit Audio</h2>
                  <button @click="$emit('close-modal')" type="button" class="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <!-- Modal Body -->
                <div class="p-4 sm:p-6">
                  <!-- Loading State -->
                  <div v-if="isLoading" class="flex justify-center items-center h-64">
                    <div class="text-center">
                      <svg class="animate-spin mx-auto h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading audio data...</p>
                    </div>
                  </div>

                  <!-- Error State -->
                  <div v-else-if="error" class="p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h3 class="text-lg font-semibold text-red-700 dark:text-red-300">Could not load audio</h3>
                    <p class="mt-2 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
                  </div>

                  <!-- Main Form (shows after data is loaded) -->
                  <form v-else-if="formData" @submit.prevent="handleUpdate" class="space-y-6">
                    <!-- Form fields... -->
                    <div>
                      <label for="audio_title_edit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title <span class="text-red-500">*</span></label>
                      <input v-model="formData.title" type="text" id="audio_title_edit" required class="form-input" placeholder="Enter audio title">
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label for="audio_url_edit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Audio URL <span class="text-red-500">*</span></label>
                        <input v-model="formData.url" type="url" id="audio_url_edit" required class="form-input" placeholder="https://.../audio.mp3">
                      </div>
                      <div>
                        <label for="thumbnail_url_edit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Art URL</label>
                        <input v-model="formData.thumbnail_url" type="url" id="thumbnail_url_edit" class="form-input" placeholder="https://.../cover-art.jpg">
                      </div>
                    </div>
                    <div v-if="formData.thumbnail_url" class="mt-2">
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Cover Art Preview:</p>
                      <img :src="formData.thumbnail_url" alt="Cover Art preview" class="max-h-32 rounded-lg border border-gray-200 dark:border-gray-600 object-cover" @error="formData.thumbnail_url = ''" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label for="audio_status_edit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select v-model="formData.status" id="audio_status_edit" class="form-input">
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label for="release_date_edit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Release Date</label>
                        <input v-model="formData.release_date" type="date" id="release_date_edit" class="form-input">
                      </div>
                      <div>
                        <label for="duration_edit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                        <input v-model="formData.duration" type="text" id="duration_edit" class="form-input" placeholder="e.g., 00:04:20">
                      </div>
                    </div>
                    <div>
                      <label for="audio_description_edit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea v-model="formData.description" id="audio_description_edit" rows="3" class="form-input" placeholder="A brief description of the audio track"></textarea>
                    </div>
                    <div class="flex items-center">
                        <input v-model="formData.is_premium" id="is_premium_edit" type="checkbox" class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:checked:bg-blue-500">
                        <label for="is_premium_edit" class="ml-2 block text-sm text-gray-900 dark:text-gray-200">This is a premium audio track</label>
                    </div>

                    <!-- Submission Error -->
                    <div v-if="saveError" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                      <p class="text-sm text-red-600 dark:text-red-400">{{ saveError }}</p>
                    </div>

                    <!-- Modal Footer -->
                    <div class="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button @click="$emit('close-modal')" type="button" class="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        Cancel
                      </button>
                      <button type="submit" :disabled="isSaving" class="ml-3 px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <span v-if="isSaving">Saving...</span>
                        <span v-else>Save Changes</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </Teleport>
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
    audioId: { type: [String, Number], default: null },
  });

  const emit = defineEmits(['audio-updated', 'close-modal']);
  const toast = useToast();

  const formData = ref(null);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref(null);
  const saveError = ref(null);

  const fetchAudioData = async (id) => {
    isLoading.value = true;
    error.value = null;
    formData.value = null;
    try {
      const response = await axios.get(route('proxy.get'), { params: { endpoint: `audios/${id}` } });
      if (response.data?.status && response.data.data) {
          const audioData = response.data.data;
          formData.value = {
              ...audioData,
              is_premium: !!audioData.is_premium,
              release_date: audioData.release_date ? new Date(audioData.release_date).toISOString().split('T')[0] : ''
          };
      } else {
        throw new Error("Audio data not found.");
      }
    } catch (err) {
      error.value = err.response?.data?.message || "Could not retrieve audio details.";
    } finally {
      isLoading.value = false;
    }
  };

  const handleUpdate = async () => {
    if (!formData.value) return;
    isSaving.value = true;
    saveError.value = null;
    try {
      await axios.put(route('proxy.put'), formData.value, { params: { endpoint: `audios/${props.audioId}` } });
      toast.success('Audio updated successfully!');
      emit('audio-updated');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "An error occurred while saving.";
      saveError.value = errorMessage;
      toast.error(errorMessage);
    } finally {
      isSaving.value = false;
    }
  };

  watch(() => props.isVisible, (newValue) => {
    if (newValue && props.audioId) {
      fetchAudioData(props.audioId);
    } else if (!newValue) {
      formData.value = null;
      error.value = null;
      saveError.value = null;
    }
  });
  </script>

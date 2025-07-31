<template>
    <Teleport to="body">
      <transition
        enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
      >
        <div v-if="isVisible" class="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm" @click.self="$emit('close')">
          <div class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 overflow-y-auto">
            <transition
              enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
              leave-active-class="ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95"
            >
              <div v-if="isVisible" class="relative bg-white dark:bg-gray-800 w-full max-w-6xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
                  <h2 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Audio Details
                  </h2>
                  <button @click="$emit('close')" type="button" class="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <!-- Modal Body -->
                <div class="p-4 sm:p-6 lg:p-8">
                  <!-- Loading State -->
                  <div v-if="loading" class="flex justify-center items-center h-96">
                    <div class="text-center">
                      <svg class="animate-spin mx-auto h-12 w-12 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <p class="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">Loading Audio Details...</p>
                    </div>
                  </div>

                  <!-- Error State -->
                  <div v-else-if="error" class="max-w-3xl mx-auto p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                      <div class="flex">
                        <div class="flex-shrink-0"><svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"></path></svg></div>
                        <div class="ml-3"><h3 class="text-sm font-medium text-red-800 dark:text-red-300">Error</h3><div class="mt-2 text-sm text-red-700 dark:text-red-400"><p>{{ error }}</p></div></div>
                      </div>
                  </div>

                  <!-- Main Content -->
                  <div v-else-if="audio" class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-1 flex flex-col space-y-6">
                      <div class="aspect-square w-full bg-white dark:bg-gray-800/70 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                          <img v-if="audio.thumbnail_url" :src="audio.thumbnail_url" :alt="audio.title" class="w-full h-full object-cover">
                          <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>
                          </div>
                      </div>
                      <div class="w-full bg-white dark:bg-gray-800/70 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3">
                          <audio controls class="w-full" :src="audio.url" ref="audioElement">
                              Your browser does not support the audio element.
                          </audio>
                      </div>
                    </div>
                    <div class="lg:col-span-2 bg-white dark:bg-gray-800/70 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 self-start">
                      <div class="p-6">
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{{ audio.title }}</h1>
                        <div class="flex flex-wrap gap-2 mt-3">
                          <span class="badge" :class="statusBadgeClass">{{ audio.status }}</span>
                          <span v-if="audio.is_premium" class="badge bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300">Premium</span>
                        </div>
                        <div v-if="audio.author" class="mt-6 flex items-center space-x-4">
                           <img class="h-12 w-12 rounded-full object-cover bg-gray-200 dark:bg-gray-700" :src="audio.author.profile_image_url" :alt="audio.author.name" v-if="audio.author.profile_image_url" />
                           <div v-else class="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></div>
                          <div>
                            <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ audio.author.name }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Artist / Author</p>
                          </div>
                        </div>
                      </div>
                      <div class="border-t border-gray-200 dark:border-gray-700 px-6 py-5">
                         <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4"><div><dt class="detail-term">Release Date</dt><dd class="detail-value mt-1">{{ audio.release_date || 'N/A' }}</dd></div><div><dt class="detail-term">Duration</dt><dd class="detail-value mt-1">{{ audio.duration || 'N/A' }}</dd></div><div><dt class="detail-term">Language</dt><dd class="detail-value mt-1">{{ audio.language || 'N/A' }}</dd></div><div><dt class="detail-term">ID</dt><dd class="detail-value mt-1 text-gray-500 dark:text-gray-400 font-mono">{{ audio.id }}</dd></div></dl>
                      </div>
                      <div class="border-t border-gray-200 dark:border-gray-700 px-6 py-5">
                        <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">{{ audio.description || 'No description provided.' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </Teleport>
  </template>

  <style scoped>
  .badge { @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize; }
  .detail-term { @apply text-sm font-medium text-gray-500 dark:text-gray-400; }
  .detail-value { @apply text-sm font-semibold text-gray-800 dark:text-gray-200; }
  </style>

  <script setup>
  import { ref, watch, computed } from 'vue';
  import axios from 'axios';

  const props = defineProps({
    isVisible: { type: Boolean, default: false },
    audioId: { type: [String, Number], default: null },
  });

  const emit = defineEmits(['close']);

  const audio = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const audioElement = ref(null);

  const fetchAudioDetails = async (id) => {
    loading.value = true;
    error.value = null;
    audio.value = null;
    try {
      const response = await axios.get(route('proxy.get'), { params: { endpoint: `audios/${id}` } });
      if (response.data?.status && response.data.data) {
        audio.value = response.data.data;
      } else {
        throw new Error('Audio not found or invalid API response.');
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'The requested audio track could not be found.';
    } finally {
      loading.value = false;
    }
  };

  const statusBadgeClass = computed(() => {
    if (!audio.value) return '';
    switch (audio.value.status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300';
    }
  });

  watch(() => props.isVisible, (newValue) => {
    // Pause audio when modal is closed
    if (!newValue && audioElement.value) {
      audioElement.value.pause();
      audio.value = null; // Clear data
      error.value = null;
    }
    // Fetch data when modal becomes visible with a valid ID
    if (newValue && props.audioId) {
      fetchAudioDetails(props.audioId);
    }
  });
  </script>

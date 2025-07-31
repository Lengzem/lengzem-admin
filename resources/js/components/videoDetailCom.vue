<template>
    <Teleport to="body">
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isVisible" class="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm" @click.self="handleClose">
          <div class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 overflow-y-auto">
            <transition
              enter-active-class="ease-out duration-300"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="ease-in duration-200"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div v-if="isVisible" class="relative bg-white dark:bg-gray-800 w-full max-w-7xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-4 sm:p-5 rounded-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
                  <h2 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Video Details
                  </h2>
                  <button @click="handleClose" type="button" class="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <!-- Modal Body -->
                <div class="p-4 sm:p-6 lg:p-8">
                  <!-- Loading State -->
                  <div v-if="loading" class="flex justify-center items-center h-96">
                    <div class="text-center">
                      <svg class="animate-spin mx-auto h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <p class="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">Loading Video Details...</p>
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
                  <div v-else-if="video" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2 bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                        <div data-shaka-player-container class="w-full h-full aspect-video">
                            <video ref="videoElement" data-shaka-player class="w-full h-full"></video>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-gray-800/70 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                      <div class="p-6">
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{{ video.title }}</h1>
                        <div class="flex flex-wrap gap-2 mt-3">
                          <span class="badge" :class="statusBadgeClass">{{ video.status }}</span>
                          <span v-if="video.is_premium" class="badge bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300">Premium</span>
                        </div>
                        <div v-if="video.author" class="mt-6 flex items-center space-x-4">
                           <img class="h-12 w-12 rounded-full object-cover bg-gray-200 dark:bg-gray-700" :src="video.author.profile_image_url" :alt="video.author.name" v-if="video.author.profile_image_url" />
                           <div v-else class="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></div>
                          <div>
                            <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ video.author.name }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Author</p>
                          </div>
                        </div>
                      </div>
                      <div class="border-t border-gray-200 dark:border-gray-700 px-6 py-5">
                         <dl class="grid grid-cols-1 gap-y-4"><div class="flex justify-between items-center"><dt class="detail-term">Release Date</dt><dd class="detail-value">{{ video.release_date || 'N/A' }}</dd></div><div class="flex justify-between items-center"><dt class="detail-term">Duration</dt><dd class="detail-value">{{ video.duration || 'N/A' }}</dd></div><div class="flex justify-between items-center"><dt class="detail-term">Views</dt><dd class="detail-value">{{ video.views?.toLocaleString() || '0' }}</dd></div><div class="flex justify-between items-center"><dt class="detail-term">Language</dt><dd class="detail-value">{{ video.language || 'N/A' }}</dd></div></dl>
                      </div>
                      <div class="border-t border-gray-200 dark:border-gray-700 px-6 py-5">
                        <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">{{ video.description || 'No description provided.' }}</p>
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

<script setup>
import { ref, onUnmounted, watch, computed, nextTick } from 'vue';
import axios from 'axios';
import shaka from 'shaka-player/dist/shaka-player.ui.js';
import 'shaka-player/dist/controls.css';

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  videoId: { type: [String, Number], default: null },
});

const emit = defineEmits(['close']);

const video = ref(null);
const loading = ref(false);
const error = ref(null);
const videoElement = ref(null);
const player = ref(null);
const shakaOverlay = ref(null);

const destroyPlayer = async () => {
  if (player.value) {
    await player.value.destroy();
    player.value = null;
  }
  if (shakaOverlay.value) {
    shakaOverlay.value.destroy();
    shakaOverlay.value = null;
  }
};

const handleClose = () => {
  destroyPlayer();
  emit('close');
};

const initPlayer = async () => {
  await nextTick();
  if (!video.value || !videoElement.value) return;

  await destroyPlayer(); // Ensure any old instance is gone

  const shakaPlayer = new shaka.Player(videoElement.value);
  player.value = shakaPlayer;

  const ui = new shaka.ui.Overlay(shakaPlayer, videoElement.value.parentElement, videoElement.value);
  shakaOverlay.value = ui;
  ui.getControls();

  // ✅ Enable Big Play Button and essential controls
  ui.configure({
    addBigPlayButton: true,
    controlPanelElements: [
      'play_pause',
      'rewind',
      'fast_forward',
      'mute',
      'volume',
      'time_and_duration',
      'fullscreen',
      'overflow_menu',
    ],
  });

  shakaPlayer.addEventListener('error', (event) => {
    console.error('Shaka Player Error:', event.detail);
  });

  try {
    await shakaPlayer.load(video.value.url);
    console.log("response data:", video.value.url)
  } catch (err) {
    console.error('Shaka Load Error:', err);
    error.value = "Could not load video. The format may be unsupported or the URL is incorrect.";
  }
};

const fetchVideoDetails = async (id) => {
  loading.value = true;
  error.value = null;
  video.value = null;

  try {
    const response = await axios.get(route('proxy.get'), {
      params: { endpoint: `videos/${id}` },
    });

    if (response.data?.status && response.data.data) {
        console.log("response data:", response.data.data)
      video.value = response.data.data;
      console.log("response data:", video.value.url)
      initPlayer();
    } else {
      throw new Error('Video not found or invalid API response.');
    }
  } catch (err) {
    error.value =
      err.response?.data?.message || 'The requested video could not be found.';
  } finally {
    loading.value = false;
  }
};

const statusBadgeClass = computed(() => {
  if (!video.value) return '';
  switch (video.value.status) {
    case 'published':
      return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300';
  }
});

watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue && props.videoId) {
      fetchVideoDetails(props.videoId);
    } else if (!newValue) {
      destroyPlayer();
      video.value = null;
      error.value = null;
    }
  }
);

onUnmounted(() => {
  destroyPlayer();
});
</script>

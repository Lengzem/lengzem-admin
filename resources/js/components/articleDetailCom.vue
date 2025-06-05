<template>
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out"
      @click.self="closeModal"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out sm:max-w-3xl w-full m-4 max-h-[90vh]"
        :class="isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 px-6 py-4 sm:px-8">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white tracking-tight flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Article Details
            </h3>
            <button
              @click="closeModal"
              class="text-white/70 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
  
        <!-- Modal Content -->
        <div class="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-130px)] custom-scrollbar">
          <div v-if="isLoading" class="flex justify-center items-center py-10">
            <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="ml-3 text-gray-700 dark:text-gray-300">Loading article...</p>
          </div>
  
          <div v-else-if="error" class="text-center py-10">
            <p class="text-red-500 dark:text-red-400 font-semibold">Error loading article:</p>
            <p class="text-gray-600 dark:text-gray-400 mt-1">{{ error }}</p>
            <button @click="fetchArticleDetails" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Retry
            </button>
          </div>
  
          <div v-else-if="article" class="space-y-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ article.title }}</h1>
            
            <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">{{ article.category?.name || 'Uncategorized' }}</span>
                <span v-for="tag in article.tags" :key="tag.id" class="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  #{{ tag.name }}
                </span>
            </div>
  
            <div class="prose prose-indigo dark:prose-invert max-w-none">
              <p class="lead">{{ article.summary }}</p>
            </div>
  
            <div v-if="article.cover_image_url" class="my-6">
              <img :src="article.cover_image_url" alt="Cover image" class="rounded-lg shadow-md w-full object-cover max-h-96">
            </div>
            
            <div class="prose prose-indigo dark:prose-invert max-w-none" v-html="article.content"></div>
  
            <hr class="dark:border-gray-700 my-6">
  
            <!-- Author Info -->
            <div v-if="article.author" class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">About the Author</h4>
              <div class="flex items-start space-x-4">
                <img v-if="article.author.user?.profile_image_url" :src="article.author.user.profile_image_url" alt="Author" class="w-16 h-16 rounded-full object-cover">
                <div v-else class="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-2xl font-bold">
                  {{ article.author.pen_name ? article.author.pen_name.charAt(0).toUpperCase() : 'A' }}
                </div>
                <div>
                  <p class="text-md font-medium text-gray-900 dark:text-gray-100">
                    {{ article.author.pen_name || article.author.user?.name || 'Anonymous' }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ article.author.user?.role || 'Author' }}</p>
                  <p v-if="article.author.bio" class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ article.author.bio }}</p>
                  <div v-if="parsedSocialLinks" class="mt-2 space-x-2">
                     <a v-for="(link, platform) in parsedSocialLinks" :key="platform" :href="link" target="_blank" rel="noopener noreferrer"
                       class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm capitalize">
                       {{ platform }}
                     </a>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Media -->
            <div v-if="article.media && article.media.length > 0" class="mt-6">
              <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Media Attachments</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="medium in article.media" :key="medium.id" class="border dark:border-gray-700 rounded-lg overflow-hidden">
                  <div v-if="medium.media_type === 'video'" class="aspect-w-16 aspect-h-9">
                    <video controls :src="medium.media_url" class="w-full h-full object-cover"></video>
                  </div>
                  <div v-else-if="medium.media_type === 'image'">
                    <img :src="medium.media_url" :alt="medium.caption || 'Media image'" class="w-full h-auto object-cover">
                  </div>
                  <div v-else class="p-3">
                    <a :href="medium.media_url" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:underline dark:text-indigo-400">
                      View {{ medium.media_type || 'file' }}: {{ medium.caption || medium.media_url.split('/').pop() }}
                    </a>
                  </div>
                  <p v-if="medium.caption && medium.media_type !== 'file'" class="p-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">{{ medium.caption }}</p>
                </div>
              </div>
            </div>
  
            <!-- Meta Info -->
            <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-6 border-t dark:border-gray-700 pt-4">
              <p><strong>Published:</strong> {{ formatDate(article.published_at) }}</p>
              <p><strong>Last Updated:</strong> {{ formatDate(article.updated_at) }}</p>
              <p><strong>Views:</strong> {{ article.view_count?.toLocaleString() || 0 }}</p>
              <p><strong>Comments:</strong> {{ article.comments_count?.toLocaleString() || 0 }}</p>
              <p><strong>Article ID:</strong> {{ article.id }}</p>
            </div>
  
          </div>
          <div v-else class="text-center py-10">
              <p class="text-gray-500 dark:text-gray-400">No article data to display.</p>
          </div>
        </div>
  
        <!-- Modal Footer (optional) -->
         <div class="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 flex justify-end">
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    isVisible: {
      type: Boolean,
      required: true,
    },
    articleId: {
      type: [Number, String, null],
      required: false,
      default: null,
    },
  });
  
  const emit = defineEmits(['close']);
  
  const article = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  
  const closeModal = () => {
    emit('close');
  };
  
  const fetchArticleDetails = async () => {
    if (!props.articleId) {
      article.value = null;
      error.value = 'No Article ID provided.';
      return;
    }
    isLoading.value = true;
    error.value = null;
    article.value = null; // Clear previous article data
  
    try {
      const response = await axios.get(`https://api.lengzem.in/api/articles/${props.articleId}`);
      if (response.data && response.data.status === true && response.data.data) {
        article.value = response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to retrieve article data.');
      }
    } catch (err) {
      console.error("Error fetching article details:", err);
      error.value = err.response?.data?.message || err.message || 'An unknown error occurred.';
    } finally {
      isLoading.value = false;
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };
  
  const parsedSocialLinks = computed(() => {
    if (article.value?.author?.social_links) {
      try {
        return JSON.parse(article.value.author.social_links);
      } catch (e) {
        console.warn("Could not parse social links JSON:", article.value.author.social_links, e);
        return null;
      }
    }
    return null;
  });
  
  // Watch for changes in articleId or visibility to fetch data
  watch(
    () => [props.articleId, props.isVisible],
    ([newId, newVisibility]) => {
      if (newId && newVisibility) {
        fetchArticleDetails();
      } else if (!newVisibility) {
        // Optionally clear data when modal is hidden to free up memory
        // article.value = null; 
      }
    },
    { immediate: true } // Fetch immediately if modal is visible with an ID on mount
  );
  
  // Handle Escape key to close modal
  const handleEscapeKey = (event) => {
    if (event.key === 'Escape' && props.isVisible) {
      closeModal();
    }
  };
  
  watch(() => props.isVisible, (newValue) => {
    if (newValue) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    }
  });
  
  </script>
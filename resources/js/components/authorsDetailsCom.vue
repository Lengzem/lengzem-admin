<template>
    <transition
      enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div v-if="isVisible" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-75" @click.self="$emit('close')">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <transition
            enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
            leave-active-class="ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95"
          >
            <div class="relative bg-white dark:bg-gray-800 w-full max-w-2xl mx-auto shadow-xl rounded-lg overflow-hidden">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Author Details</h2>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <!-- Modal Body -->
              <div class="p-6">
                <div v-if="loading" class="text-center py-10">
                  <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>
                  <p class="mt-2">Loading author...</p>
                </div>
                <div v-else-if="error" class="text-center py-10 text-red-500">
                  <p>{{ error }}</p>
                </div>
                <div v-else-if="author" class="space-y-6">
                  <!-- Author Header -->
                  <div class="flex items-center space-x-4">
                    <img class="h-20 w-20 rounded-full object-cover border-2 border-blue-500" :src="author.user.profile_image_url || defaultAvatar" :alt="author.pen_name">
                    <div>
                      <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ author.pen_name }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ author.user.name }} ({{ author.user.email }})</p>
                    </div>
                  </div>
  
                  <!-- Bio -->
                  <div>
                    <h4 class="font-semibold text-gray-700 dark:text-gray-300">Bio</h4>
                    <p class="mt-1 text-gray-600 dark:text-gray-400 prose dark:prose-invert max-w-none">{{ author.bio || 'No bio provided.' }}</p>
                  </div>
                  
                  <!-- Social Links -->
                  <div v-if="Object.keys(parsedSocialLinks).length > 0">
                    <h4 class="font-semibold text-gray-700 dark:text-gray-300">Social Media</h4>
                    <div class="mt-2 flex flex-wrap gap-4">
                      <a v-for="(url, platform) in parsedSocialLinks" :key="platform" :href="url" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                        <span class="capitalize">{{ platform }}</span>
                      </a>
                    </div>
                  </div>
  
                  <!-- Other Details -->
                  <div>
                    <h4 class="font-semibold text-gray-700 dark:text-gray-300">Details</h4>
                    <dl class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div class="flex justify-between"><dt class="text-gray-500">Phone:</dt><dd class="text-gray-800 dark:text-gray-200">{{ author.user.phone }}</dd></div>
                      <div class="flex justify-between"><dt class="text-gray-500">Joined:</dt><dd class="text-gray-800 dark:text-gray-200">{{ formatDate(author.created_at) }}</dd></div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue';
  import axios from 'axios'; // Use configured axios
  
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false,
    },
    authorId: {
      type: [Number, String],
      default: null,
    },
  });
  
  const emit = defineEmits(['close']);
  
  const author = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  const fetchAuthorDetails = async (id) => {
    if (!id) return;
    loading.value = true;
    error.value = null;
    author.value = null;
    
    try {
      const response = await axios.get(route('proxy.get', { endpoint: `authors/${id}` }));
      if (response.data && response.data.status === true) {
        author.value = response.data.data;
      } else {
        throw new Error("Author data not found in API response.");
      }
    } catch (err) {
      console.error("Failed to fetch author details:", err);
      error.value = "Could not load author details. Please try again.";
    } finally {
      loading.value = false;
    }
  };
  
  const parsedSocialLinks = computed(() => {
    if (!author.value || !author.value.social_links) {
      return {};
    }
    try {
      const links = JSON.parse(author.value.social_links);
      // Filter out any empty values
      return Object.fromEntries(Object.entries(links).filter(([_, value]) => value));
    } catch (e) {
      console.error("Failed to parse social links JSON:", e);
      return {};
    }
  });
  
  const defaultAvatar = computed(() => {
    const name = author.value?.pen_name || 'A';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&color=7F9CF5&background=EBF4FF`;
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  watch(() => props.isVisible, (newValue) => {
    if (newValue && props.authorId) {
      fetchAuthorDetails(props.authorId);
    }
  });
  </script>
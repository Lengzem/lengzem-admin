<template>
    <div class="container mx-auto p-6">
      <!-- Page Header -->
      <div class="flex items-start mb-6">
        <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 sm:mx-0 sm:h-10 sm:w-10">
          <ChatBubbleLeftRightIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
            Add New Comment
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select an article and user to post a new comment.
          </p>
        </div>
      </div>
  
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-10">
        <svg class="animate-spin h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading articles and users...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="p-4 rounded-md bg-red-50 dark:bg-red-900/30 text-center">
        <p class="text-sm font-medium text-red-800 dark:text-red-200">{{ error }}</p>
      </div>
  
      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6 bg-white dark:bg-gray-800/50 p-6 rounded-lg border dark:border-gray-700">
        <!-- Article Selection -->
        <div>
          <label for="article_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Article <span class="text-red-500">*</span>
          </label>
          <select 
            id="article_id" 
            v-model="formData.article_id" 
            required
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 py-2.5 px-3 border">
            <option value="" disabled>Select an article</option>
            <option v-for="article in articles" :key="article.id" :value="article.id">
              {{ article.title }}
            </option>
          </select>
        </div>
  
        <!-- User (Commenter) Selection -->
        <div>
          <label for="user_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Comment As User <span class="text-red-500">*</span>
          </label>
          <select 
            id="user_id" 
            v-model="formData.user_id" 
            required
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 py-2.5 px-3 border">
            <option value="" disabled>Select a user</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }} ({{ user.email }})
            </option>
          </select>
        </div>

        <!-- Parent Comment Selection (FIXED) -->
        <div>
          <label for="parent_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reply To (Optional)
          </label>
          <select 
            id="parent_id" 
            v-model="formData.parent_id" 
            :disabled="!formData.article_id || comments.length === 0" 
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 py-2.5 px-3 border disabled:bg-gray-200 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed">
            
            <!-- FIX 2: Allow posting a top-level comment -->
            <option :value="null">Post as new (top-level) comment</option>

            <option v-for="comm in comments" :key="comm.id" :value="comm.id">
              Reply to: "{{ comm.comment.substring(0, 50) }}..."
            </option>
          </select>
          <p v-if="!formData.article_id" class="mt-1 text-xs text-gray-500 dark:text-gray-400">Please select an article first to see comments.</p>
        </div>
  
        <!-- Comment Content -->
        <div>
          <label for="comment_content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Comment <span class="text-red-500">*</span>
          </label>
          <textarea 
            id="comment_content" 
            v-model="formData.comment" 
            rows="5" 
            required
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 py-2.5 px-3 border"
            placeholder="Write the comment here..."
          ></textarea>
        </div>
        
        <!-- Submission Error -->
        <div v-if="submissionError" class="text-sm text-red-600">
          {{ submissionError }}
        </div>
  
        <!-- Action Buttons -->
        <div class="flex justify-end pt-4 space-x-3">
          <button type="submit" :disabled="isSubmitting" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm ...">
            <span v-if="isSubmitting">Posting...</span>
            <span v-else>Post Comment</span>
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'; // <-- Import watch
  import axios from 'axios';
  import { useToast } from 'vue-toastification';
  import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline';
  
  const toast = useToast();
  
  const articles = ref([]);
  const users = ref([]);
  const comments = ref([]);
  const isLoading = ref(true);
  const error = ref(null);
  const isSubmitting = ref(false);
  const submissionError = ref(null);
  
  const formData = ref({
    article_id: null,
    user_id: null,
    parent_id: null, // It's better to use null for an empty/top-level comment
    comment: '',
  });
  
  // 1. Corrected `fetchInitialData`
  const fetchInitialData = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // Fetch only articles and users initially. Comments depend on an article being selected.
      const [articlesResponse, usersResponse] = await Promise.all([
        axios.get(route('proxy.get', { endpoint: 'articles' })),
        axios.get(route('proxy.get', { endpoint: 'users' })),
      ]);
  
      if (articlesResponse.data?.status && Array.isArray(articlesResponse.data.data?.data)) {
        articles.value = articlesResponse.data.data.data;
      } else {
        throw new Error("Failed to load articles in the expected format.");
      }
      
      if (usersResponse.data?.status && Array.isArray(usersResponse.data.data?.data)) {
        users.value = usersResponse.data.data.data;
      } else {
        throw new Error("Failed to load users in the expected format.");
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
      error.value = "Could not load required data (articles/users). Please try again later.";
      toast.error(error.value);
    } finally {
      isLoading.value = false;
    }
  };
  
  // 2. NEW: Function to fetch comments for a specific article
  const fetchCommentsForArticle = async (articleId) => {
    if (!articleId) {
      comments.value = []; // Clear comments if no article is selected
      return;
    }
    try {
      // Show a loading indicator for the comment list if you want, or just fetch
      const response = await axios.get(route('proxy.get', { endpoint: `articles/${articleId}/comments` }));
      
      if (response.data?.status && Array.isArray(response.data.data?.data)) {
        comments.value = response.data.data.data;
      } else {
        // It's possible an article has no comments, so we don't throw an error, just set to empty
        comments.value = [];
        console.warn(`No comments found or API format was unexpected for article ${articleId}`);
      }
    } catch (err) {
      console.error(`Error fetching comments for article ${articleId}:`, err);
      toast.error("Could not load comments for the selected article.");
      comments.value = []; // Clear comments on error
    }
  };
  
  // 3. NEW: Watch for changes to the selected article
  watch(() => formData.value.article_id, (newArticleId) => {
    // Reset the selected parent comment whenever the article changes
    formData.value.parent_id = null;
    // Fetch the new list of comments
    fetchCommentsForArticle(newArticleId);
  });
  
  
  const handleSubmit = async () => {
    isSubmitting.value = true;
    submissionError.value = null;
    try {
      // The data to be sent. Ensure parent_id is only included if it has a value.
      const payload = {
        user_id: formData.value.user_id,
        comment: formData.value.comment,
      };
      if (formData.value.parent_id) {
          payload.parent_id = formData.value.parent_id;
      }
      
      await axios.post(route('proxy.post'), payload, {
        params: { endpoint: `articles/${formData.value.article_id}/comments` }
      });
  
      toast.success('Comment posted successfully!');
      // Optionally reset the form
      // formData.value.comment = '';
      // formData.value.parent_id = null;
    } catch (err) {
      submissionError.value = err.response?.data?.message || "An error occurred while posting the comment.";
      toast.error(submissionError.value);
    } finally {
      isSubmitting.value = false;
    }
  };
  
  onMounted(() => {
    fetchInitialData();
  });
  </script>
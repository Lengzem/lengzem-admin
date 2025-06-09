<template>
    <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
    <!-- Article List Section -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 px-6 py-4 sm:px-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
            Article List
          </h2>
        </div>
      </div>
            
            <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div v-if="loadingArticles" class="p-8 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
                <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading articles...</span>
              </div>
              <div v-else-if="articlesError" class="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
                {{ articlesError }}
              </div>
              <div v-else-if="articles.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
                No articles found.
              </div>
              <div v-else class="overflow-x-auto custom-scrollbar">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Author
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Published Date
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="article in articles" :key="article.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ article.title || 'N/A' }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ article.id }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        <!-- Updated to use author's pen_name or user's name -->
                        {{ article.author?.pen_name || article.author?.user?.name || 'Unknown Author' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {{ formatDate(article.published_at) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="[
                          'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize',
                          article.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' : 
                          article.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300' :
                          article.status === 'archived' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300' :
                          'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
                        ]">
                          {{ article.status || 'N/A' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button @click="openArticleViewModal(article.id)" type="button" class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors font-medium">
                          View
                        </button>
                        <button type="button" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium">
                          Edit
                        </button>
                        <button type="button" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium">
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Article Detail Modal -->
    <ArticleDetailModal
      :is-visible="showArticleModal"
      :article-id="selectedArticleId"
      @close="closeArticleViewModal"
    />
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ArticleDetailModal from './articleDetailCom.vue'; 
import { useAuthStore } from '@/stores/authStore'; // 1. Import the auth store

// --- (search states, modal states are unchanged) ---
const articles = ref([]);
const loadingArticles = ref(true);
const articlesError = ref(null);

// Modal states
const showArticleModal = ref(false);
const selectedArticleId = ref(null);

const authStore = useAuthStore(); // 2. Instantiate the store

const openArticleViewModal = (articleId) => {
  selectedArticleId.value = articleId;
  showArticleModal.value = true;
};

const closeArticleViewModal = () => {
  showArticleModal.value = false;
  selectedArticleId.value = null;
};

const fetchArticles = async () => {
  loadingArticles.value = true;
  articlesError.value = null;
  try {
    // 3. SIMPLIFIED API CALL
    // The Authorization header is now added AUTOMATICALLY by your authStore.
    // We just need to pass the params correctly to axios.
    const response = await axios.get(route('proxy.get'), {
      params: {
        endpoint: 'articles'
      }
    });

    // --- (The rest of your response handling logic is perfect and unchanged) ---
    if (response.data && response.data.status === true && response.data.data && Array.isArray(response.data.data.data)) {
      articles.value = response.data.data.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      articles.value = response.data.data;
    } else if (Array.isArray(response.data)) {
      articles.value = response.data;
    } else {
      console.warn("Fetched articles data is not in the expected paginated format:", response.data);
      articlesError.value = "Unexpected data format for article list.";
      articles.value = [];
    }

  } catch (err) {
    console.error("Error fetching articles:", err);
    articlesError.value = "Failed to load articles. Please check the console for more details.";
    if (err.response) {
      // Handle unauthorized error specifically
      if (err.response.status === 401 || err.response.status === 403) {
          articlesError.value = "You are not authorized to view these articles. Please log in again.";
      } else {
          articlesError.value += ` (Status: ${err.response.status})`;
      }
    }
    articles.value = [];
  } finally {
    loadingArticles.value = false;
  }
};

const formatDate = (dateString) => {
  // ... (this function is unchanged)
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Invalid Date';
  }
};

onMounted(async () => {
  // 4. CRUCIAL: Ensure auth is ready before fetching
  // We check if the token is already in the store. If not, we wait for initAuth.
  if (!authStore.token) {
    await authStore.initAuth();
  }
  
  // Now we can be sure the auth header is set on axios.
  fetchArticles();
});
</script>
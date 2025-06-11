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
                      {{ article.author?.pen_name || article.author?.user?.name || 'Unknown Author' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {{ article.published_at || article.scheduled_publish_time || 'Not Set' }} 
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
                      <button @click="openEditModal(article.id)" type="button" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium">
                  Edit
                </button>
                      <!-- Updated Delete Button -->
                      <button @click="handleDeleteArticle(article.id)" type="button" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
             <!-- Pagination -->
             <div v-if="!loadingArticles && articles.length > 0 && pagination.total > pagination.per_page" class="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div class="hidden sm:block text-sm text-gray-700 dark:text-gray-400">
                    Showing <span class="font-semibold">{{ pagination.from }}</span> to <span class="font-semibold">{{ pagination.to }}</span> of <span class="font-semibold">{{ pagination.total }}</span> results
                </div>
                <Pagination
                  v-model:page="pagination.current_page"
                  :total="pagination.total"
                  :items-per-page="pagination.per_page"
                  :sibling-count="1"
                  show-edges
                  class="mx-auto sm:mx-0"
                >
                  <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
                    <PaginationPrevious />
                    <div class="hidden sm:flex items-center gap-1">
                      <template v-for="(item, index) in items">
                        <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value">{{ item.value }}</PaginationItem>
                        <PaginationEllipsis v-else :key="item.type" :index="index" />
                      </template>
                    </div>
                    <PaginationNext />
                  </PaginationContent>
                </Pagination>
            </div>
          </div>
        </div>

        <!-- Article Detail Modal -->
  <ArticleDetailModal
    :is-visible="showArticleModal"
    :article-id="selectedArticleId"
    @close="closeArticleViewModal"
  />

   <!-- Article Edit Modal -->
   <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <div v-if="showEditModal" class="fixed inset-0 z-40 bg-gray-900 bg-opacity-75" @click.self="closeEditModal">
            <div class="fixed inset-0 z-50 flex items-center justify-center">
              <div class="relative bg-white dark:bg-gray-900 w-full h-full max-w-7xl mx-auto shadow-xl rounded-lg overflow-y-auto">
                <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10 p-4">
                  <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Edit Article</h2>
                  <button @click="closeEditModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100">
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                <div class="p-4">
                  <ArticleEdit v-if="editingArticleId" :article-id="editingArticleId" @article-updated="handleArticleUpdated" @close-modal="closeEditModal"/>
                </div>
              </div>
            </div>
          </div>
        </transition>
        </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import axios from 'axios';
import ArticleDetailModal from './articleDetailCom.vue';
import ArticleEdit from './articleUpdateCom.vue';
import { useToast } from 'vue-toastification';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious} from '@/components/ui/pagination';

const articles = ref([]);
const loadingArticles = ref(true);
const articlesError = ref(null);
const toast = useToast();

const pagination = reactive({
  current_page: 1,
  from: 0,
  to: 0,
  total: 0,
  per_page: 15,
  last_page: 1,
});

const showArticleModal = ref(false);
const selectedArticleId = ref(null);

const showEditModal = ref(false);
const editingArticleId = ref(null);

const openArticleViewModal = (articleId) => {
  selectedArticleId.value = articleId;
  showArticleModal.value = true;
};

const closeArticleViewModal = () => {
  showArticleModal.value = false;
  selectedArticleId.value = null;
};

const openEditModal = (articleId) => {
  editingArticleId.value = articleId;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingArticleId.value = null;
};

const handleArticleUpdated = () => {
  closeEditModal();
  fetchArticles(pagination.current_page); // Re-fetch the current page
  toast.info("Article list has been updated.");
};

const handleDeleteArticle = async (articleId) => {
  if (!window.confirm('Are you sure you want to delete this article?')) {
    return;
  }
  try {
    await axios.delete(route('proxy.delete', { endpoint: `articles/${articleId}` }));
    toast.success('Article deleted successfully!');
    // Re-fetch the current page, or previous page if it was the last item
    if (articles.value.length === 1 && pagination.current_page > 1) {
      fetchArticles(pagination.current_page - 1);
    } else {
      fetchArticles(pagination.current_page);
    }
  } catch (err) {
    console.error(`Error deleting article with ID ${articleId}:`, err);
    toast.error('Failed to delete the article.');
  }
};

const fetchArticles = async (page = 1) => {
  loadingArticles.value = true;
  articlesError.value = null;
  try {
    const response = await axios.get(route('proxy.get'), {
      params: {
        endpoint: 'articles',
        page: page,
      }
    });

    if (response.data?.status === true && Array.isArray(response.data.data?.data)) {
      articles.value = response.data.data.data;
      const { current_page, from, to, total, per_page, last_page } = response.data.data;
      Object.assign(pagination, { current_page, from, to, total, per_page, last_page });
    } else {
      articlesError.value = "Unexpected data format for article list.";
      articles.value = [];
    }
  } catch (err) {
    console.error("Error fetching articles:", err);
    if (err.response?.status === 401) {
      articlesError.value = "You are not authorized. Please log in again.";
    } else {
      articlesError.value = "Failed to load articles. Please try again later.";
    }
    articles.value = [];
  } finally {
    loadingArticles.value = false;
  }
};

watch(() => pagination.current_page, (newPage) => {
  if (!loadingArticles.value) {
    fetchArticles(newPage);
  }
});

onMounted(() => {
  fetchArticles();
});
</script>
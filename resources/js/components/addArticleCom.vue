<template>
  <div class="container mx-auto p-4">
    <div class="flex items-start mb-4">
      <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 sm:mx-0 sm:h-10 sm:w-10">
        <PlusIcon class="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
      </div>
      <div class="ml-4">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
          Create New Article
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Fill in the details below to create a new article
        </p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitArticle" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column - Form Fields -->
        <div class="lg:col-span-4 space-y-6">
          <!-- Title -->
          <div>
            <label for="articleTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span class="text-red-500">*</span>
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input type="text" id="articleTitle" v-model="article.title" required
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 py-2.5 px-3 border"
                placeholder="Enter article title" />
            </div>
          </div>

          <!-- Author and Category -->
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="authorId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Author <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <select id="authorId" v-model.number="article.author_id" required
                  class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 py-2.5 px-3 border">
                  <option value="" disabled selected>Select author</option>
                  <option v-for="author in authors" :key="author.id" :value="author.id">
                    {{ author.name }}
                  </option>
                </select>
              </div>
            </div>
            <div>
              <label for="categoryId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <select id="categoryId" v-model.number="article.category_id" required
                  class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 py-2.5 px-3 border">
                  <option value="" disabled selected>Select category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div>
            <label for="articleSummary" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Summary
            </label>
            <div class="mt-1">
              <textarea id="articleSummary" v-model="article.summary" rows="3"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 py-2.5 px-3 border"
                placeholder="A brief summary of the article (max 200 characters)" maxlength="200"></textarea>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ article.summary ? article.summary.length : 0 }}/200 characters
            </p>
          </div>

          <!-- Status and Publish Time -->
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="articleStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <select id="articleStatus" v-model="article.status" required @change="handleStatusChange"
                  class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 py-2.5 px-3 border">
                  <option value="Draft">Draft</option>
                  <option value="Published">Publish Now</option>
                  <option value="Scheduled">Schedule</option>
                </select>
              </div>
            </div>

            <div v-if="article.status === 'Published' || article.status === 'Scheduled'">
              <label for="publishOrScheduleTime" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ article.status === 'Published' ? 'Publish At' : 'Schedule At' }}
                <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input type="date" id="publishOrScheduleTime" v-model="dateTimeModel"
                  class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 py-2.5 px-3 border"
                  required />
              </div>
            </div>
          </div>

          <!-- Commentable Option -->
          <div class="pt-2">
            <div class="relative flex items-start">
              <div class="flex h-6 items-center">
                <input id="isCommentable" aria-describedby="isCommentable-description" name="isCommentable" type="checkbox"
                  v-model="article.isCommentable"
                  class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 dark:bg-gray-700 dark:checked:bg-green-500" />
              </div>
              <div class="ml-3 text-sm leading-6">
                <label for="isCommentable" class="font-medium text-gray-800 dark:text-gray-200 cursor-pointer">
                  Allow Comments
                </label>
                <p id="isCommentable-description" class="text-gray-500 dark:text-gray-400 text-xs">
                  Enable or disable comments for this article.
                </p>
              </div>
            </div>
          </div>

          <!-- Cover Image -->
          <div>
            <label for="coverImageUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cover Image URL
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input type="url" id="coverImageUrl" v-model="article.cover_image_url"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 py-2.5 px-3 border"
                placeholder="https://example.com/image.jpg" />
            </div>
            <div v-if="article.cover_image_url" class="mt-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Image Preview:</div>
              <img :src="article.cover_image_url" alt="Cover preview"
                class="max-h-32 rounded-md border border-gray-200 dark:border-gray-600 object-cover"
                @error="article.cover_image_url = ''" />
            </div>
          </div>

          <!-- Tags Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>

            <!-- Selected Tags Display -->
            <div v-if="selectedTags.length > 0" class="mb-2 p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in selectedTags" :key="`selected-${tag.id}`"
                  class="inline-flex items-center py-1 pl-2.5 pr-1 text-sm font-medium bg-green-100 text-green-700 dark:bg-green-700/50 dark:text-green-200 rounded-full">
                  {{ tag.name }}
                  <button type="button" @click="deselectTag(tag.id)"
                    class="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-500 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-600/50 hover:text-green-600 dark:hover:text-green-100 focus:outline-none focus:bg-green-500 focus:text-white">
                    <span class="sr-only">Remove {{ tag.name }}</span>
                    <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              </div>
            </div>

            <!-- Search Input -->
            <div class="mb-2">
              <input type="text" v-model="tagSearchQuery" placeholder="Search and select tags..."
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 py-2 px-3 border" />
            </div>

            <div v-if="loadingTags" class="text-sm text-gray-500 dark:text-gray-400 p-3">Loading tags...</div>
            <div v-else-if="tagsError" class="text-sm text-red-500 dark:text-red-400 p-3">{{ tagsError }}</div>
            <div v-else-if="filteredAvailableTags.length === 0" class="text-sm text-gray-500 dark:text-gray-400 p-3">
              {{ tagSearchQuery ? 'No matching tags found.' : 'All available tags are selected or none exist.' }}
            </div>
            <div v-else
              class="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-3 space-y-2 bg-gray-50 dark:bg-gray-700/50 custom-scrollbar-slim">
              <div v-for="tag in filteredAvailableTags" :key="tag.id" class="flex items-center">
                <input :id="'tag-' + tag.id" type="checkbox" :value="tag.id" v-model="article.tags"
                  class="h-4 w-4 text-green-600 border-gray-300 dark:border-gray-500 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 dark:bg-gray-700" />
                <label :for="'tag-' + tag.id"
                  class="ml-2 block text-sm text-gray-900 dark:text-gray-200 cursor-pointer">
                  {{ tag.name }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Content Editor -->
        <div class="lg:col-span-8">
          <div class="sticky top-4">
            <div class="flex justify-between items-center mb-4">
              <label for="articleContent" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content <span class="text-red-500">*</span>
              </label>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Word count: {{ wordCount }}
              </div>
            </div>
            <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <!-- Tiptap Editor with increased height -->
              <Tiptap v-model="article.content" class="min-h-[calc(100vh-300px)]" />
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="submissionError" class="p-4 rounded-md bg-red-50 dark:bg-red-900/30">
        <div class="flex">
          <div class="flex-shrink-0">
            <ExclamationCircleIcon class="h-5 w-5 text-red-400 dark:text-red-300" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error submitting article</h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              {{ submissionError }}
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-4">
        <button type="button" @click="closeModal" :disabled="isSubmitting"
          class="mt-3 inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 sm:mt-0">
          Cancel
        </button>
        <button type="submit" :disabled="isSubmitting"
          class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50">
          <span v-if="isSubmitting" class="flex items-center">
            <Spinner class="h-4 w-4 mr-2" />
            Saving...
          </span>
          <span v-else>Save Article</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Tiptap from './Tiptap.vue';
import { PlusIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const article = ref({
  title: '', summary: '', content: '', author_id: null, category_id: null,
  status: 'Draft', scheduled_publish_time: null, published_at: null, cover_image_url: '', tags: [], isCommentable: true
});
const isSubmitting = ref(false);
const submissionError = ref(null);

const authors = ref([]);
const categories = ref([]);

// --- TAGS STATE AND LOGIC ---
const availableTags = ref([]);
const tagCache = ref({});
const loadingTags = ref(false);
const tagsError = ref(null);
const tagSearchQuery = ref('');
let debounceTimeout = null;

// Helper function to format JS Date to MySQL DATETIME string
const formatDateForMySQL = (date) => {
  if (!date || !(date instanceof Date)) return null;
  const pad = (num) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


const selectedTags = computed(() => {
  return article.value.tags
    .map(tagId => tagCache.value[tagId])
    .filter(Boolean);
});

const filteredAvailableTags = computed(() => {
  const selectedIds = new Set(article.value.tags);
  return availableTags.value.filter(tag => !selectedIds.has(tag.id));
});

const deselectTag = (tagIdToRemove) => {
  article.value.tags = article.value.tags.filter(id => id !== tagIdToRemove);
};
// --- END TAGS LOGIC ---

const fetchData = async (endpoint, dataRef, loadingRef, errorRef, nameField = 'name') => {
  loadingRef.value = true;
  errorRef.value = null;
  try {
    const response = await axios.get(route('proxy.get'), { params: { endpoint } });
    if (response.data?.status === true && Array.isArray(response.data.data?.data)) {
      dataRef.value = response.data.data.data.map(item => ({
        id: item.id,
        name: item[nameField] || item.name || item.title || `Unnamed (ID: ${item.id})`,
      }));
    } else {
      errorRef.value = `Failed to load ${endpoint}: Invalid data format.`;
      dataRef.value = [];
    }
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    errorRef.value = `Failed to load ${endpoint}. Please check console for details.`;
    dataRef.value = [];
  } finally {
    loadingRef.value = false;
  }
};

const searchTags = async (query) => {
  loadingTags.value = true;
  tagsError.value = null;
  const endpoint = query ? 'tags/search' : 'tags';
  const params = { endpoint };
  if (query) {
    params.name = query;
  }
  try {
    const response = await axios.get(route('proxy.get'), { params });
    const dataList = response.data?.data?.data || response.data?.data || [];
    if (response.data?.status === true && Array.isArray(dataList)) {
      const newTags = dataList.map(item => ({ id: item.id, name: item.name }));
      availableTags.value = newTags;
      newTags.forEach(tag => {
        if (!tagCache.value[tag.id]) {
          tagCache.value[tag.id] = tag;
        }
      });
    } else {
      tagsError.value = 'Failed to load tags: Invalid data format.';
      availableTags.value = [];
    }
  } catch (err) {
    console.error(`Error fetching/searching tags:`, err);
    tagsError.value = 'Failed to load tags.';
    availableTags.value = [];
  } finally {
    loadingTags.value = false;
  }
};

watch(tagSearchQuery, (newQuery) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    searchTags(newQuery);
  }, 300);
});

const submitArticle = async () => {
  isSubmitting.value = true;
  submissionError.value = null;

  try {
    // Create a deep copy to avoid mutating reactive state directly
    const payload = JSON.parse(JSON.stringify(article.value));

    // Format dates for MySQL if they exist
    if (payload.published_at) {
      payload.published_at = formatDateForMySQL(new Date(payload.published_at));
    }
    if (payload.scheduled_publish_time) {
      payload.scheduled_publish_time = formatDateForMySQL(new Date(payload.scheduled_publish_time));
    }

    // --- CONSOLE LOGGING THE FINAL PAYLOAD ---
    console.log("--- Submitting Article Data ---");
    console.log("Payload being sent:", payload);
    console.log("-------------------------------");
    // --- END CONSOLE LOGGING ---

    const response = await axios.post(
      route('proxy.post'),
      payload, // Send the formatted payload
      { params: { endpoint: 'articles' } }
    );

    toast.success('Article submitted successfully!');
  } catch (error) {
    console.error('Error submitting article:', error.response || error);
    // Log the payload that caused the error
    console.error('Data that caused the error:', error.config?.data);
    const data = error.response?.data;
    submissionError.value = data?.message || data?.error || 'An unknown error occurred.';
    toast.error(submissionError.value);
  } finally {
    isSubmitting.value = false;
  }
};

const handleStatusChange = () => {
  if (article.value.status === 'Published') {
    if (!article.value.published_at) {
      article.value.published_at = new Date();
    }
    article.value.scheduled_publish_time = null;
  } else if (article.value.status === 'Scheduled') {
    article.value.published_at = null;
    if (!article.value.scheduled_publish_time) {
      const oneHourFromNow = new Date(new Date().getTime() + 60 * 60 * 1000);
      article.value.scheduled_publish_time = oneHourFromNow;
    }
  } else {
    article.value.published_at = null;
    article.value.scheduled_publish_time = null;
  }
};

const dateTimeModel = computed({
  get() {
    let date;
    if (article.value.status === 'Published') {
      date = article.value.published_at;
    } else if (article.value.status === 'Scheduled') {
      date = article.value.scheduled_publish_time;
    }
    return date ? new Date(date).toISOString().split('T')[0] : '';
  },
  set(newValue) {
    if (!newValue) return;
    const newDate = new Date(newValue);
    if (article.value.status === 'Published') {
      article.value.published_at = newDate;
    } else if (article.value.status === 'Scheduled') {
      article.value.scheduled_publish_time = newDate;
    }
  }
});

const wordCount = computed(() => {
    if (!article.value.content) return 0;
    const text = article.value.content.replace(/<[^>]+>/g, '');
    const matches = text.match(/[\w\d\'-]+/gi);
    return matches ? matches.length : 0;
});

const closeModal = () => {
  console.log('Cancel button clicked. Implement navigation or modal close logic.');
};

// Initial data fetch
fetchData('authors', authors, ref(false), ref(null), 'pen_name');
fetchData('categories', categories, ref(false), ref(null));
searchTags('');

</script>
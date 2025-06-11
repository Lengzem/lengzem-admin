<template>
    <div class="container mx-auto p-4">
        <!-- Loading State for the entire page -->
        <div v-if="isLoadingPage" class="flex justify-center items-center h-96">
            <div class="text-center">
                <svg class="animate-spin h-8 w-8 text-green-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">Loading article data...</p>
            </div>
        </div>

        <!-- Page Content -->
        <div v-else>
            <div class="flex items-start mb-4">
                <div
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 sm:mx-0 sm:h-10 sm:w-10">
                    <PencilIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div class="ml-4">
                    <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                        Edit Article
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Update the article details below
                    </p>
                </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="updateArticle" class="space-y-6">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <!-- Left Column - Form Fields -->
                    <div class="lg:col-span-4 space-y-6">
                        <!-- Title -->
                        <div>
                            <label for="articleTitle"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                                <label for="authorId"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                                <label for="categoryId"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                            <label for="articleSummary"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Summary
                            </label>
                            <div class="mt-1">
                                <textarea id="articleSummary" v-model="article.summary" rows="3"
                                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 py-2.5 px-3 border"
                                    placeholder="A brief summary of the article (max 200 characters)"
                                    maxlength="200"></textarea>
                            </div>
                            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {{ article.summary ? article.summary.length : 0 }}/200 characters
                            </p>
                        </div>

                        <!-- Status and Publish Time -->
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label for="articleStatus"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status <span class="text-red-500">*</span>
                                </label>
                                <div class="mt-1 relative rounded-md shadow-sm">
                                    <select id="articleStatus" v-model="article.status" required
                                        @change="handleStatusChange"
                                        class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 py-2.5 px-3 border">
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Publish Now</option>
                                        <option value="Scheduled">Schedule</option>
                                    </select>
                                </div>
                            </div>

                            <div v-if="article.status === 'Published' || article.status === 'Scheduled'">
                                <label for="publishOrScheduleTime"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                                    <input id="isCommentable" aria-describedby="isCommentable-description"
                                        name="isCommentable" type="checkbox" v-model="article.isCommentable"
                                        class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 dark:bg-gray-700 dark:checked:bg-green-500" />
                                </div>
                                <div class="ml-3 text-sm leading-6">
                                    <label for="isCommentable"
                                        class="font-medium text-gray-800 dark:text-gray-200 cursor-pointer">
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
                            <label for="coverImageUrl"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                            <div v-if="selectedTags.length > 0"
                                class="mb-2 p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
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

                            <div v-if="loadingTags" class="text-sm text-gray-500 dark:text-gray-400 p-3">Loading tags...
                            </div>
                            <div v-else-if="tagsError" class="text-sm text-red-500 dark:text-red-400 p-3">{{ tagsError
                                }}</div>
                            <div v-else-if="filteredAvailableTags.length === 0"
                                class="text-sm text-gray-500 dark:text-gray-400 p-3">
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
                                <label for="articleContent"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error updating article</h3>
                            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                                {{ submissionError }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-4">
                    <button type="button" @click="cancelEdit" :disabled="isSubmitting"
                        class="mt-3 inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 sm:mt-0">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isSubmitting"
                        class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50">
                        <span v-if="isSubmitting" class="flex items-center">
                            <Spinner class="h-4 w-4 mr-2" />
                            Updating...
                        </span>
                        <span v-else>Update Article</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Tiptap from './Tiptap.vue';
import { PencilIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'; // Use PencilIcon for edit
import axios from 'axios';
import { useToast } from 'vue-toastification';

const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['articleUpdated', 'closeModal']);
const toast = useToast();

const article = ref({
    title: '', summary: '', content: '', author_id: null, category_id: null,
    status: 'Draft', scheduled_publish_time: null, published_at: null, cover_image_url: '', tags: [], isCommentable: true
});

const isLoadingPage = ref(true);
const isSubmitting = ref(false);
const submissionError = ref(null);

// All other state refs are the same as the create form
const authors = ref([]);
const categories = ref([]);
const availableTags = ref([]);
const tagCache = ref({});
const loadingTags = ref(false);
const tagsError = ref(null);
const tagSearchQuery = ref('');
let debounceTimeout = null;

// --- HELPER & COMPUTED PROPERTIES (Identical to create form) ---
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

const dateTimeModel = computed({
    get() {
        let date;
        if (article.value.status.toLowerCase() === 'published') {
            date = article.value.published_at;
        } else if (article.value.status.toLowerCase() === 'scheduled') {
            date = article.value.scheduled_publish_time;
        }
        return date ? new Date(date).toISOString().split('T')[0] : '';
    },
    set(newValue) {
        if (!newValue) return;
        const newDate = new Date(newValue);
        if (article.value.status.toLowerCase() === 'published') {
            article.value.published_at = newDate;
        } else if (article.value.status.toLowerCase() === 'scheduled') {
            article.value.scheduled_publish_time = newDate;
        }
    }
});


// Fetches authors, categories, etc. (Identical to create form)
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

// NEW: Function to fetch the specific article data
const fetchArticleData = async (id) => {
    try {
        const response = await axios.get(route('proxy.get'), { params: { endpoint: `articles/${id}` } });
        const articleData = response.data.data;

        // Pre-fill the form with the fetched data
        article.value.title = articleData.title;
        article.value.summary = articleData.summary;
        article.value.content = articleData.content;
        article.value.author_id = articleData.author_id;
        article.value.category_id = articleData.category_id;
        article.value.status = articleData.status; // e.g., 'Published', 'Draft'
        article.value.cover_image_url = articleData.cover_image_url;
        article.value.isCommentable = !!articleData.isCommentable; // Ensure it's a boolean

        // Handle dates - they come as strings, convert to Date objects for the picker
        article.value.published_at = articleData.published_at ? new Date(articleData.published_at) : null;
        article.value.scheduled_publish_time = articleData.scheduled_publish_time ? new Date(articleData.scheduled_publish_time) : null;

        // Handle tags - API returns array of objects, we need an array of IDs
        if (articleData.tags && Array.isArray(articleData.tags)) {
            article.value.tags = articleData.tags.map(tag => tag.id);
            // Also populate the tag cache so their names appear in the "selected" area
            articleData.tags.forEach(tag => {
                if (!tagCache.value[tag.id]) {
                    tagCache.value[tag.id] = tag;
                }
            });
        }

    } catch (error) {
        console.error("Failed to fetch article data:", error);
        toast.error("Could not load article data. Please try again.");
        router.push({ name: 'articles.index' }); // Redirect if article can't be found
    }
};

// --- FORM ACTIONS ---
const deselectTag = (tagIdToRemove) => {
  article.value.tags = article.value.tags.filter(id => id !== tagIdToRemove);
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
// MODIFIED: This function now updates instead of creates
const updateArticle = async () => {
    isSubmitting.value = true;
    submissionError.value = null;

    try {
        const payload = JSON.parse(JSON.stringify(article.value));
        if (payload.published_at) {
            payload.published_at = formatDateForMySQL(new Date(payload.published_at));
        }
        if (payload.scheduled_publish_time) {
            payload.scheduled_publish_time = formatDateForMySQL(new Date(payload.scheduled_publish_time));
        }

        // Use PUT request for updating
        await axios.put(
            route('proxy.put'),
            payload,
            { params: { endpoint: `articles/${props.articleId}` } } // Target the specific article ID
        );

        toast.success('Article updated successfully!');
        emit('articleUpdated');

    } catch (error) {
        console.error('Error updating article:', error.response || error);
        const data = error.response?.data;
        submissionError.value = data?.message || data?.error || 'An unknown error occurred.';
        toast.error(submissionError.value);
    } finally {
        isSubmitting.value = false;
    }
};

const cancelEdit = () => {
    emit('closeModal'); // EMIT close event
};

// --- LIFECYCLE HOOK ---
onMounted(async () => {
    // Fetch all necessary data in parallel for speed
    await Promise.all([
    fetchArticleData(props.articleId),
    fetchData('authors', authors, ref(false), ref(null), 'pen_name'),
fetchData('categories', categories, ref(false), ref(null)),
        searchTags('') // Initial fetch for all tags
    ]);
    isLoadingPage.value = false;
});
</script>
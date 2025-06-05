<template>
    <TransitionRoot appear :show="isVisible" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>
  
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
            <DialogPanel class="w-full max-w-screen-xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div class="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    class="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                    @click="closeModal"
                    :disabled="isSubmitting"
                  >
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
  
                <div class="flex items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 sm:mx-0 sm:h-10 sm:w-10">
                    <PlusIcon class="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                  </div>
                  <div class="ml-4">
                    <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                      Create New Article
                    </DialogTitle>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Fill in the details below to create a new article
                    </p>
                  </div>
                </div>
                
                <form @submit.prevent="submitArticle" class="mt-6 space-y-6">
                  <div class="space-y-4">
                    <!-- Title -->
                    <div>
                      <label for="articleTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title <span class="text-red-500">*</span>
                      </label>
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <input 
                          type="text" 
                          id="articleTitle" 
                          v-model="article.title"
                          required
                          class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 py-2.5 px-3 border"
                          placeholder="Enter article title"
                        />
                      </div>
                    </div>
  
                    <!-- Author and Category -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label for="authorId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Author <span class="text-red-500">*</span>
                        </label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                          <select
                            id="authorId"
                            v-model.number="article.author_id"
                            required
                            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 py-2.5 px-3 border"
                          >
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
                          <select
                            id="categoryId"
                            v-model.number="article.category_id"
                            required
                            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 py-2.5 px-3 border"
                          >
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
                        <textarea 
                          id="articleSummary" 
                          v-model="article.summary"
                          rows="3"
                          class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 py-2.5 px-3 border"
                          placeholder="A brief summary of the article (max 200 characters)"
                          maxlength="200"
                        ></textarea>
                      </div>
                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {{ article.summary ? article.summary.length : 0 }}/200 characters
                      </p>
                    </div>
  
                    <!-- Content -->
                    <div>
                      <div class="flex justify-between items-center">
                        <label for="articleContent" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Content <span class="text-red-500">*</span>
                        </label>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          Supports <span class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">Markdown</span>
                        </span>
                      </div>
                      <div class="mt-1">
                        <textarea 
                          id="articleContent" 
                          v-model="article.content"
                          rows="8"
                          required
                          class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 py-2.5 px-3 border font-mono text-sm"
                          placeholder="Write your article content here..."
                        ></textarea>
                      </div>
                    </div>
  
                    <!-- Status and Publish Time -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label for="articleStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Status <span class="text-red-500">*</span>
                        </label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                          <select 
                            id="articleStatus" 
                            v-model="article.status"
                            required
                            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 py-2.5 px-3 border"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="review">Needs Review</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label for="scheduledPublishTime" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Scheduled Publish Time
                        </label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                          <input 
                            type="date" 
                            id="scheduledPublishTime" 
                            v-model="article.scheduled_publish_time"
                            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 py-2.5 px-3 border"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="pt-2">
                    <div class="relative flex items-start">
                      <div class="flex h-6 items-center">
                        <input
                          id="isCommentable"
                          aria-describedby="isCommentable-description"
                          name="isCommentable"
                          type="checkbox"
                          v-model="article.isCommentable"
                          class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 dark:bg-gray-700 dark:checked:bg-green-500"
                        />
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
                        <input 
                          type="url" 
                          id="coverImageUrl" 
                          v-model="article.cover_image_url"
                          class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 py-2.5 px-3 border"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div v-if="article.cover_image_url" class="mt-2">
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Image Preview:</div>
                        <img 
                          :src="article.cover_image_url" 
                          alt="Cover preview" 
                          class="max-h-32 rounded-md border border-gray-200 dark:border-gray-600 object-cover"
                          @error="article.cover_image_url = ''"
                        />
                      </div>
                    </div>
  
                    <!-- Tags Selection -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                    <div v-if="loadingTags" class="text-gray-500 dark:text-gray-400">Loading tags...</div>
                    <div v-else-if="tagsError" class="text-red-500 dark:text-red-400">{{ tagsError }}</div>
                    <div v-else-if="availableTags.length === 0" class="text-gray-500 dark:text-gray-400">No tags available.</div>
                    <div v-else class="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-3 space-y-2 bg-gray-50 dark:bg-gray-700/50 custom-scrollbar-slim">
                      <div v-for="tag in availableTags" :key="tag.id" class="flex items-center">
                        <input
                          :id="'tag-' + tag.id"
                          type="checkbox"
                          :value="tag.id"
                          v-model="article.tags" 
                          class="h-4 w-4 text-green-600 border-gray-300 dark:border-gray-500 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 dark:bg-gray-700"
                        />
                        <label :for="'tag-' + tag.id" class="ml-2 block text-sm text-gray-900 dark:text-gray-200 cursor-pointer">
                          {{ tag.name }}
                        </label>
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
                    <button
                      type="button"
                      @click="closeModal"
                      :disabled="isSubmitting"
                      class="mt-3 inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 sm:mt-0"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      :disabled="isSubmitting"
                      class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                    >
                      <span v-if="isSubmitting" class="flex items-center">
                        <Spinner class="h-4 w-4 mr-2" />
                        Saving...
                      </span>
                      <span v-else>Save Article</span>
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
  <script setup>

  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ref, watch, onUnmounted, nextTick } from 'vue';
import axios from 'axios';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['close', 'article-added']);

const modalPanelRef = ref(null);

const initialArticleState = () => ({
  title: '', summary: '', content: '', author_id: null, category_id: null,
  status: 'draft', scheduled_publish_time: null, cover_image_url: '', tags: [],
  isCommentable: false,
});
const article = ref(initialArticleState());
const isSubmitting = ref(false);
const submissionError = ref(null);

const authors = ref([]); const loadingAuthors = ref(false); const authorsError = ref(null);
const categories = ref([]); const loadingCategories = ref(false); const categoriesError = ref(null);
const availableTags = ref([]); const loadingTags = ref(false); const tagsError = ref(null);

const selectOptionText = (loading, error, count, type) => {
  if (loading) return 'Loading...';
  if (error) return `Error loading ${type}s`;
  if (count === 0) return `No ${type}s available`;
  return `Select ${type}`;
};

const fetchData = async (endpoint, dataRef, loadingRef, errorRef, nameField = 'name') => {
  if (dataRef.value.length > 0 && !errorRef.value) return;
  loadingRef.value = true; errorRef.value = null;
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
    errorRef.value = `Failed to load ${endpoint}.`;
    dataRef.value = [];
  } finally {
    loadingRef.value = false;
  }
};

const closeModal = () => {
  if (isSubmitting.value) return;
  submissionError.value = null;
  emit('close');
};

const closeModalOnOverlay = () => {
  // Only close if not submitting, to prevent accidental close during API call
  if (!isSubmitting.value) {
    closeModal();
  }
}

const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && !isSubmitting.value) {
    closeModal();
  }
};

const handleImageError = () => { article.value.cover_image_url = ''; };

const submitArticle = async () => {
  isSubmitting.value = true; submissionError.value = null;
  if (article.value.status !== 'scheduled') article.value.scheduled_publish_time = null;
  const articleData = { ...article.value, scheduled_publish_time: article.value.scheduled_publish_time || null };
  const bodydataForArticle = { ...articleData, params: { endpoint: 'articles' } };
  try {
    const response = await axios.post(route('proxy.post'), bodydataForArticle);
    emit('article-added', response.data?.data || { ...articleData, id: Date.now() });
    closeModal();
  } catch (error) {
    const data = error.response?.data;
    submissionError.value = data?.message || 'An unknown error occurred.';
    if (data?.errors) {
      const firstErrorKey = Object.keys(data.errors)[0];
      if (firstErrorKey) submissionError.value += ` (${data.errors[firstErrorKey][0]})`;
    }
  } finally {
    isSubmitting.value = false;
  }
};

let originalBodyOverflow = '';
let firstFocusableElement = null;
let lastFocusableElement = null;

const focusTrap = (event) => {
  if (event.key !== 'Tab') return;
  if (event.shiftKey) {
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus(); event.preventDefault();
    }
  } else {
    if (document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus(); event.preventDefault();
    }
  }
};

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    fetchData('authors', authors, loadingAuthors, authorsError, 'pen_name');
    fetchData('categories', categories, loadingCategories, categoriesError);
    fetchData('tags', availableTags, loadingTags, tagsError);
    document.addEventListener('keydown', handleEscapeKey);
    nextTick(() => {
      if (modalPanelRef.value) {
        const focusable = modalPanelRef.value.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length) {
          firstFocusableElement = focusable[0];
          lastFocusableElement = focusable[focusable.length - 1];
          firstFocusableElement.focus();
          modalPanelRef.value.addEventListener('keydown', focusTrap);
        }
      }
    });
  } else {
    document.body.style.overflow = originalBodyOverflow;
    document.removeEventListener('keydown', handleEscapeKey);
    if (modalPanelRef.value) modalPanelRef.value.removeEventListener('keydown', focusTrap);
    firstFocusableElement = null; lastFocusableElement = null;
    if (!isSubmitting.value) {
      setTimeout(() => { article.value = initialArticleState(); submissionError.value = null; }, 300);
    }
  }
});
onUnmounted(() => {
  if (document.body.style.overflow === 'hidden') document.body.style.overflow = originalBodyOverflow;
  document.removeEventListener('keydown', handleEscapeKey);
  if (modalPanelRef.value) modalPanelRef.value.removeEventListener('keydown', focusTrap);
});
</script>
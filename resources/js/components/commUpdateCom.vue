<template>
    <transition
      enter-active-class="ease-out duration-200" 
      enter-from-class="opacity-0" 
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-150" 
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0"
    >
      <div v-if="isVisible" class="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <transition
            enter-active-class="ease-out duration-200" 
            enter-from-class="opacity-0 scale-95" 
            enter-to-class="opacity-100 scale-100"
            leave-active-class="ease-in duration-150" 
            leave-from-class="opacity-100 scale-100" 
            leave-to-class="opacity-0 scale-95"
          >
            <form @submit.prevent="handleSubmit" class="relative bg-white dark:bg-gray-900 w-full max-w-xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Edit {{ commentData && commentData.parent_id ? 'Reply' : 'Comment' }}
                </h2>
                <button 
                  @click="$emit('close')" 
                  type="button" 
                  class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <!-- Modal Body -->
              <div class="p-6 space-y-4">
                <div>
                  <label for="comment_content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                  <textarea 
                    v-model="formData.comment" 
                    id="comment_content" 
                    rows="5" 
                    required 
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your comment..."
                  ></textarea>
                </div>
                <div v-if="saveError" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ saveError }}</p>
                </div>
              </div>
  
              <!-- Modal Footer -->
              <div class="flex items-center justify-end p-5 border-t border-gray-100 dark:border-gray-800">
                <button @click="$emit('close')" type="button" class="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >Cancel</button>
                <button type="submit" :disabled="isSaving" class="ml-3 px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span v-if="isSaving">Saving...</span>
                  <span v-else>Save Changes</span>
                </button>
              </div>
            </form>
          </transition>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  articleId: { type: [Number, String], required: true },
  commentId: { type: [Number, String], default: null },
});

const emit = defineEmits(['close', 'saved']);
const toast = useToast();

const formData = ref({
  comment: '',
  is_approved: false,
});
const isSaving = ref(false);
const saveError = ref(null);
const loading = ref(false);
const fetchError = ref(null);

const fetchCommentDetails = async () => {
  if (!props.articleId || !props.commentId) return;

  loading.value = true;
  fetchError.value = null;
  try {
    const endpoint = `articles/${props.articleId}/comments/${props.commentId}`;
    const response = await axios.get(route('proxy.get', { endpoint: endpoint }));
    
    // The response has a nested structure, so we access `response.data.data.comment`
    if (response.data?.status === true && response.data.data?.comment) {
      const commentData = response.data.data.comment;
      formData.value.comment = commentData.comment || '';
      formData.value.is_approved = !!commentData.is_approved;
    } else {
      throw new Error("Comment data not found in API response.");
    }
  } catch (err) {
    console.error("Failed to fetch comment for editing:", err);
    fetchError.value = "Could not load comment details. Please close and try again.";
  } finally {
    loading.value = false;
  }
};

// Watch for the modal to become visible with a valid ID, then fetch data
watch(() => [props.isVisible, props.commentId], ([newIsVisible, newCommentId]) => {
  if (newIsVisible && newCommentId) {
    fetchCommentDetails();
  } else {
    // Reset form when modal is hidden or ID is cleared
    formData.value = { comment: '', is_approved: false };
    fetchError.value = null;
    saveError.value = null;
  }
});

const handleSubmit = async () => {
  if (!props.commentId) {
    toast.error("No comment selected for editing.");
    return;
  }

  isSaving.value = true;
  saveError.value = null;
  
  try {
    // A comment/reply is always updated by its own unique ID.
    const endpoint = `articles/${props.articleId}/comments/${props.commentId}`;

    await axios.put(route('proxy.put'), formData.value, {
      params: { endpoint: endpoint }
    });
    
    toast.success('Saved successfully!');
    emit('saved'); // Notify the parent to refresh
  } catch (err) {
    saveError.value = err.response?.data?.message || "An error occurred while saving.";
    toast.error(saveError.value);
  } finally {
    isSaving.value = false;
  }
};
</script>
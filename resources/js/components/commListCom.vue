<template>
    <div class="max-w-10xl px-4 sm:px-6 lg:px-8 py-8">
        <div
            class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
            <!-- Component Header -->
            <div class="bg-gradient-to-r from-gray-700 via-gray-900 to-black px-6 py-4 sm:px-8">
                <div class="flex items-center justify-between">
                    <div class="min-w-0">
                        <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
                            <svg class="w-6 h-6 mr-3 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Comment Management
                        </h2>
                        <p v-if="article.title" class="text-sm text-gray-300 mt-1 truncate">
                            For article: "{{ article.title }}"
                        </p>
                    </div>
                </div>
            </div>

            <div class="p-4 sm:p-6">
                <div
                    class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                    <!-- Loading/Error/Empty States -->
                    <div v-if="loadingComments"
                        class="p-8 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
                        <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span>Loading comments...</span>
                    </div>
                    <div v-else-if="commentsError"
                        class="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
                        {{ commentsError }}
                    </div>
                    <div v-else-if="comments.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
                        No comments found for this article.
                    </div>

                    <!-- Comments Table -->
                    <div v-else class="overflow-x-auto custom-scrollbar">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                                <tr>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Commenter</th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Comment</th>
                                    <th scope="col"
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Replies</th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Date</th>
                                    <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                <template v-for="comment in comments" :key="comment.id">
                                    <!-- Main Comment Row -->
                                    <tr
                                        class="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150">
                                        <!-- Commenter Column -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div class="flex-shrink-0 h-10 w-10">
                                                    <img class="h-10 w-10 rounded-full object-cover"
                                                        :src="comment.user?.profile_image_url || defaultAvatar(comment.user?.name)"
                                                        :alt="comment.user?.name">
                                                </div>
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {{ comment.user?.name || 'Anonymous' }}
                                                    </div>
                                                    <div class="text-xs text-gray-500 dark:text-gray-400">
                                                        ID: {{ comment.user?.id }}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <!-- Comment Column -->
                                        <td
                                            class="px-6 py-4 whitespace-normal text-sm text-gray-600 dark:text-gray-300 max-w-sm">
                                            <p class="line-clamp-3">{{ comment.comment }}</p>
                                            <!-- Reply Toggle Button -->
                                            <button v-if="comment.replies_count > 0" @click="toggleReplies(comment)"
                                                class="mt-2 flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                                                <svg class="w-4 h-4 mr-1 transition-transform duration-200"
                                                    :class="{ 'rotate-90': isRepliesVisible(comment.id) }" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                                {{ isRepliesVisible(comment.id) ? 'Hide' : 'Show' }} {{
                                                comment.replies_count }}
                                                {{ comment.replies_count === 1 ? 'reply' : 'replies' }}
                                            </button>
                                        </td>

                                        <!-- Replies Count Column -->
                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                :class="comment.replies_count > 0
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'">
                                                {{ comment.replies_count }}
                                            </span>
                                        </td>

                                        <!-- Date Column -->
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            {{ formatDate(comment.created_at) }}
                                        </td>

                                        <!-- Actions Column -->
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <!-- View Button -->
                                            <button @click="openViewModal(comment.id)" class="px-3 py-1 rounded-md font-medium transition-colors
               text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800
               dark:text-indigo-400 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300">
                                                View
                                            </button>

                                            <!-- Edit Button -->
                                            <button @click="openEditModal(comment)" class="px-3 py-1 rounded-md font-medium transition-colors
               text-blue-600 hover:bg-blue-50 hover:text-blue-800
               dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300">
                                                Edit
                                            </button>

                                            <!-- Delete Button -->
                                            <button @click="openDeleteModal(comment.id)" class="px-3 py-1 rounded-md font-medium transition-colors
               text-red-600 hover:bg-red-50 hover:text-red-800
               dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>

                                    <!-- Replies Section -->
                                    <tr v-if="isRepliesVisible(comment.id)" class="bg-gray-50/50 dark:bg-gray-800/30">
                                        <td colspan="5" class="px-6 py-4 border-t-0">
                                            <div class="pl-14 border-l-2 border-indigo-200 dark:border-indigo-800/50">
                                                <!-- Loading State -->
                                                <div v-if="comment.loadingReplies" class="flex justify-center py-3">
                                                    <svg class="animate-spin h-5 w-5 text-gray-500"
                                                        xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24">
                                                        <circle class="opacity-25" cx="12" cy="12" r="10"
                                                            stroke="currentColor" stroke-width="4"></circle>
                                                        <path class="opacity-75" fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                        </path>
                                                    </svg>
                                                </div>

                                                <!-- Replies List -->
                                                <div v-else-if="comment.replies && comment.replies.length > 0"
                                                    class="space-y-4">
                                                    <div v-for="reply in comment.replies" :key="reply.id"
                                                        class="group flex items-start space-x-3">
                                                        <img class="h-8 w-8 rounded-full object-cover flex-shrink-0 mt-1"
                                                            :src="reply.user?.profile_image_url || defaultAvatar(reply.user?.name)"
                                                            :alt="reply.user?.name">
                                                        <div class="flex-1 min-w-0">
                                                            <div class="flex items-baseline space-x-2">
                                                                <p
                                                                    class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                    {{ reply.user?.name || 'Anonymous' }}
                                                                </p>
                                                                <span
                                                                    class="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                                                    {{ formatDate(reply.created_at) }}
                                                                </span>
                                                            </div>
                                                            <p
                                                                class="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line">
                                                                {{ reply.comment }}
                                                            </p>
                                                            <div
                                                                class="mt-1 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:underline">
                                                                    View
                                                                </button>
                                                                <button @click="openEditModal(reply)"
                                                                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline font-small">
                                                                    Edit
                                                                </button>
                                                                <button @click="openDeleteModal(reply.id)"
                                                                    class="test-xs text-red-600 hover:text-red-800 dark:text-red-400 hover:underline">
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Empty State -->
                                                <div v-else
                                                    class="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    No replies found
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div v-if="!loadingComments && comments.length > 0 && pagination.total > pagination.per_page"
                        class="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                        <div class="hidden sm:block text-sm text-gray-700 dark:text-gray-400">
                            Showing <span class="font-semibold">{{ pagination.from }}</span> to <span
                                class="font-semibold">{{ pagination.to
                                }}</span> of <span class="font-semibold">{{
                                pagination.total }}</span> results
                        </div>
                        <Pagination v-model:page="pagination.current_page" :total="pagination.total"
                            :items-per-page="pagination.per_page" :sibling-count="1" show-edges class="mx-auto sm:mx-0">
                            <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
                                <PaginationPrevious />
                                <div class="hidden sm:flex items-center gap-1">
                                    <template v-for="(item, index) in items">
                                        <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value">{{
                                            item.value }}</PaginationItem>
                                        <PaginationEllipsis v-else :key="item.type" :index="index" />
                                    </template>
                                </div>
                                <PaginationNext />
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <!-- <CommentDetailModal :is-visible="showViewModal" :comment-id="viewingCommentId" @close="closeViewModal" /> -->
        <CommentEditModal 
    :is-visible="showEditModal" 
    :article-id="articleId" 
    :comment-id="editingCommentId" 
    @close="closeEditModal" 
    @saved="handleCommentSaved" 
/>

        <!-- Delete Confirmation Modal -->
        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
            leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showDeleteModal" class="relative z-50" aria-labelledby="modal-title" role="dialog"
                aria-modal="true">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <transition enter-active-class="ease-out duration-300"
                            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
                            leave-active-class="ease-in duration-200"
                            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <div
                                class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div class="sm:flex sm:items-start">
                                        <div
                                            class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400"
                                                aria-hidden="true" />
                                        </div>
                                        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
                                                id="modal-title">Delete Comment</h3>
                                            <div class="mt-2">
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you
                                                    want to
                                                    delete this comment? This action cannot be undone.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button @click="confirmDelete" :disabled="isDeleting" type="button"
                                        class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50">
                                        <span v-if="isDeleting" class="flex items-center">
                                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4">
                                                </circle>
                                                <path class="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                            Deleting...
                                        </span>
                                        <span v-else>Delete</span>
                                    </button>
                                    <button @click="closeDeleteModal" type="button"
                                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto">Cancel</button>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import axios from 'axios'; // Use your configured axios instance
import { usePage } from '@inertiajs/vue3';
import { useToast } from 'vue-toastification';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import CommentEditModal from './commUpdateCom.vue';

const toast = useToast();
const page = usePage();

// THE SINGLE SOURCE OF TRUTH for the article ID
const articleId = computed(() => page.props.article_id || null);

const article = ref({});
const comments = ref([]);
const loadingComments = ref(true);
const commentsError = ref(null);
const expandedCommentIds = ref([]);

const pagination = reactive({
    current_page: 1, from: 0, to: 0, total: 0, per_page: 15, last_page: 1,
});

// Modal states
const showEditModal = ref(false);
// We need to store both the article and comment ID for the edit modal
const editingCommentId = ref(null);

// ... other modal states are unchanged ...
const showViewModal = ref(false);
const viewingCommentId = ref(null);
const showDeleteModal = ref(false);
const commentToDeleteId = ref(null);
const isDeleting = ref(false);

const isRepliesVisible = (commentId) => {
    return expandedCommentIds.value.includes(commentId);
};

const fetchArticleDetails = async () => {
    if (!articleId.value) return; // Safety check
    try {
        const response = await axios.get(route('proxy.get', { endpoint: `articles/${articleId.value}` }));
        article.value = response.data.data;
    } catch (err) {
        console.error("Failed to fetch article details:", err);
        toast.error("Could not load article details.");
    }
};

const fetchComments = async (pageNum = 1) => {
    if (!articleId.value) return; // Safety check
    loadingComments.value = true;
    commentsError.value = null;

    try {
        const response = await axios.get(route('proxy.get', {
            endpoint: `articles/${articleId.value}/comments`,
            page: pageNum
        }));

        if (response.data?.status === true && Array.isArray(response.data.data?.data)) {
            comments.value = response.data.data.data.map(comment => ({
                ...comment,
                replies: [],
                loadingReplies: false,
            }));
            const { current_page, from, to, total, per_page, last_page } = response.data.data;
            Object.assign(pagination, { current_page, from, to, total, per_page, last_page });
        } else {
            throw new Error("Unexpected data format for comments.");
        }
    } catch (err) {
        commentsError.value = "Failed to load comments.";
        console.error(err);
    } finally {
        loadingComments.value = false;
    }
};

const fetchReplies = async (comment) => {
    // Don't re-fetch if replies are already loaded
    if (!comment || (comment.replies && comment.replies.length > 0)) {
        return;
    }

    comment.loadingReplies = true;
    try {
        const response = await axios.get(route('proxy.get', {
            endpoint: `articles/${articleId.value}/comments/${comment.id}`
        }));

        // FIXED: Access the correct nested path for the replies array
        if (response.data?.status === true && Array.isArray(response.data.data?.replies?.data)) {
            comment.replies = response.data.data.replies.data;
        } else {
            console.warn(`No replies found or unexpected format for comment ${comment.id}`);
            comment.replies = []; // Ensure it's an empty array if none are found
        }
    } catch (error) {
        console.error(`Failed to fetch replies for comment ${comment.id}:`, error);
        toast.error("Could not load replies.");
    } finally {
        comment.loadingReplies = false;
    }
};
const toggleReplies = (comment) => {
    const index = expandedCommentIds.value.indexOf(comment.id);
    if (index > -1) {
        expandedCommentIds.value.splice(index, 1);
    } else {
        expandedCommentIds.value.push(comment.id);
        fetchReplies(comment);
    }
};

const confirmDelete = async () => {
    if (!commentToDeleteId.value) return;
    isDeleting.value = true;

    try {
        // Corrected: Standard RESTful endpoint for deleting a comment by its own ID.
        await axios.delete(route('proxy.delete', {
            endpoint: `articles/${articleId.value}/comments/${commentToDeleteId.value}`
        }));
        toast.success('Comment deleted successfully!');
        if (comments.value.length === 1 && pagination.current_page > 1) {
            await fetchComments(pagination.current_page - 1);
        } else {
            await fetchComments(pagination.current_page);
        }
    } catch (err) {
        toast.error("Failed to delete comment.");
    } finally {
        isDeleting.value = false;
        closeDeleteModal();
    }
};

// Modal control functions
const openViewModal = (id) => {
    viewingCommentId.value = id;
    showViewModal.value = true;
};
const closeViewModal = () => {
    showViewModal.value = false;
    viewingCommentId.value = null;
};

const openEditModal = (comment) => {
    // Set the ID of the specific comment/reply to be edited
    editingCommentId.value = comment.id;
    console.log("ID:", comment.id)
    showEditModal.value = true;
};

const closeEditModal = () => {
    showEditModal.value = false;
    editingCommentId.value = null; // Reset the ID
};
const handleCommentSaved = () => {
    closeEditModal();
    fetchComments(pagination.current_page);
};

const openDeleteModal = (id) => {
    commentToDeleteId.value = id;
    showDeleteModal.value = true;
};
const closeDeleteModal = () => {
    showDeleteModal.value = false;
    commentToDeleteId.value = null;
};

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
};

const defaultAvatar = (name = 'U') => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&color=4F46E5&background=E0E7FF`;
};

// Watch pagination page change
watch(() => pagination.current_page, (newPage) => {
    if (!loadingComments.value) {
        fetchComments(newPage);
    }
});

watch(articleId, (newId) => {
    if (newId) {
        console.log('✅ Inertia prop detected. Fetching data for article_id:', newId);
        fetchArticleDetails();
        fetchComments();
    }
}, { immediate: true }); // `immediate` ensures it runs on component load

// onMounted is now clean, as the watcher handles the initial load.
onMounted(() => {
    // Logic is now handled by the `watch(articleId, ...)` effect.
});
</script>
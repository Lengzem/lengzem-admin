// /resources/js/utils/authRedirect.js

import { router } from '@inertiajs/vue3';

const LAST_PAGE_KEY = 'last_visited_page';

// Save the current page before navigating to login or register
export function saveLastPage() {
  const currentPage = window.location.pathname + window.location.search;
  localStorage.setItem(LAST_PAGE_KEY, currentPage);
}

// This function navigates directly. It's useful for cases like onAuthStateChanged
// where you want an immediate redirect.
export function redirectToLastPage(fallback = '/') {
  const lastPage = localStorage.getItem(LAST_PAGE_KEY);
  localStorage.removeItem(LAST_PAGE_KEY); // Remove immediately after fetching for this use case

  if (lastPage && lastPage !== '/login' && lastPage !== '/register') {
    router.visit(lastPage);
  } else {
    router.visit(fallback);
  }
}

// This function retrieves the last page URL and clears it,
// allowing the caller to decide when and how to navigate.
// THIS IS THE FUNCTION Login.vue NEEDS.
export function restoreLastPage() {
  const lastPage = localStorage.getItem(LAST_PAGE_KEY);
  localStorage.removeItem(LAST_PAGE_KEY); // Clear the item after retrieving it

  // Only return the lastPage if it's valid and not one of the auth pages
  if (lastPage && lastPage !== '/login' && lastPage !== '/register') {
    return lastPage;
  }
  return null; // Return null if no valid page, so the caller can use a fallback
}

// Clear the last page on logout or other appropriate times
export function clearLastPage() {
  localStorage.removeItem(LAST_PAGE_KEY);
}
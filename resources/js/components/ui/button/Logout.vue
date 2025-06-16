<template>
    <div class="border border-red-300 dark:border-red-600 rounded-xl p-4 bg-red-50/40 dark:bg-red-900/20">
      <h2 class="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
        I log out duh em?
      </h2>
      <p class="text-xs text-red-600 dark:text-red-400 mb-3">
        I duh chuan a hnuai a Log out tih hi hmet rawh
      </p>
  
      <button
      @click="handleLogout"
        class="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800 transition rounded-md"
      >
        <LogOut class="h-4 w-4 " />
        <span>Log out</span>
      </button>
    </div>
  </template>
  
  <script setup>
  import { router } from '@inertiajs/vue3';
  import { LogOut } from 'lucide-vue-next';
  import { getAuth, signOut } from 'firebase/auth';
  
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);

      router.visit('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  </script>
  
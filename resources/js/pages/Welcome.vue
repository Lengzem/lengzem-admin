<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { useAuthStore } from '@/stores/authStore';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Welcome',
    href: '/',
  },
];

// Initialize the auth store
const authStore = useAuthStore();
</script>

<template>
    <Head title="Welcome" />

    <div class="relative flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] transition-colors duration-300 dark:bg-[#0a0a0a] lg:justify-center lg:p-8">
        <!-- Warning Sign (example - can be conditionally shown) -->

        <!-- Show the nav only after the auth state has been checked to prevent flickering -->
        <header v-if="!authStore.loading" class="mb-8 w-full max-w-[375px] lg:max-w-6xl">
            <nav class="flex items-center justify-end gap-3">
                <!-- Check if user is logged in via Firebase -->
                <template v-if="authStore.isLoggedIn">
                    <Link
                        :href="route('dashboard')"
                        class="inline-flex items-center rounded-lg border border-transparent bg-[#1b1b18] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#2e2e2a] focus:outline-none focus:ring-2 focus:ring-[#1b1b18] focus:ring-offset-2 dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#f5f5f4] dark:focus:ring-[#EDEDEC]"
                    >
                        Dashboard
                        <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </Link>
                </template>
                
                <!-- Show login/register if not logged in -->
                <template v-else>
                    <Link
                        :href="route('login')"
                        class="inline-flex items-center rounded-lg border border-[#e0e0dc] px-5 py-2 text-sm font-medium text-[#1b1b18] transition-all hover:border-[#1b1b18] hover:bg-[#f5f5f3] focus:outline-none focus:ring-2 focus:ring-[#1b1b18] focus:ring-offset-2 dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] dark:hover:bg-[#1f1f1c] dark:focus:ring-[#EDEDEC]"
                    >
                        Log in
                        <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                        </svg>
                    </Link>
                </template>
            </nav>
        </header>

        <!-- Main Content -->
        <div class="duration-750 starting:opacity-0 flex w-full flex-1 items-center justify-center opacity-100 transition-opacity">
            <main class="flex w-full max-w-[375px] flex-col-reverse overflow-hidden rounded-xl bg-white shadow-lg dark:bg-[#121212] lg:max-w-6xl lg:flex-row lg:rounded-2xl">
                <!-- Left Column -->
                <div class="flex flex-1 flex-col p-8 lg:p-12">
                    <h1 class="mb-6 text-3xl font-bold tracking-tight text-[#1b1b18] dark:text-[#EDEDEC] lg:text-4xl">
                        Welcome to <span class="text-[#3b82f6]">Lengzem Admin</span>
                    </h1>
                    
                    <p class="mb-8 text-lg text-[#3f3f3a] dark:text-[#a1a1a0]">
                        Manage Lengzem Data here
                    </p>
                    
                    <div class="mb-8 flex flex-col gap-3">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                            <span class="text-[#1b1b18] dark:text-[#d4d4d4]">Feature one description</span>
                        </div>
                        <!-- Add more features as needed -->
                    </div>
                    
                    <div class="mt-auto">
                        <Link 
                            href="#"
                            class="inline-flex w-full items-center justify-center rounded-lg bg-[#1b1b18] px-6 py-3 text-base font-medium text-white hover:bg-[#2e2e2a] focus:outline-none focus:ring-2 focus:ring-[#1b1b18] focus:ring-offset-2 dark:bg-[#3b82f6] dark:hover:bg-[#2563eb] dark:focus:ring-[#3b82f6] sm:w-auto"
                        >
                            Get Started
                            <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
                
                <!-- Right Column (Image/Illustration) -->
                <div class="hidden bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] lg:block lg:w-1/2">
                    <div class="flex h-full items-center justify-center p-12">
                        <!-- Placeholder for illustration -->
                        <div class="text-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <h3 class="mt-4 text-xl font-semibold">Your App Illustration</h3>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        
        <footer class="mt-8 w-full max-w-[375px] text-center text-sm text-[#6b6b66] dark:text-[#8a8a85] lg:max-w-6xl">
            © 2025 Your Company. All rights reserved.
        </footer>
    </div>
</template>
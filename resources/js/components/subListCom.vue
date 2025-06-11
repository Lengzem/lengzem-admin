<template>
    <div class="bg-gray-50 dark:bg-gray-900 min-h-[50vh]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Subscription List
          </h1>
        </div>
  
        <!-- Loading State -->
        <div v-if="isLoading" class="mt-12 flex justify-center items-center">
          <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading plans...</span>
        </div>
  
        <!-- Error State -->
        <div v-else-if="error" class="mt-12 text-center bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <p class="font-semibold text-red-600 dark:text-red-400">Could not load subscription plans.</p>
          <p class="text-sm text-red-500 dark:text-red-500 mt-1">{{ error }}</p>
          <button @click="fetchPlans" class="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Retry</button>
        </div>
  
        <!-- Subscription Plans Grid -->
        <div v-else class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div 
            v-for="plan in plans" 
            :key="plan.id"
            class="relative flex flex-col rounded-2xl border shadow-lg transition-transform duration-300 hover:scale-105"
            :class="plan.current_plan ? 'border-indigo-500 bg-white dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'"
          >
            <!-- Current Plan Badge -->
            <div v-if="plan.current_plan" class="absolute top-0 right-0 -mt-3 -mr-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500 text-white">
                Current Plan
              </span>
            </div>
  
            <div class="p-6 flex-grow flex flex-col">
              <!-- Plan Name -->
              <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ plan.name }}</h3>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ plan.description }}</p>
  
              <!-- Price -->
              <div class="mt-4">
                <span class="text-4xl font-extrabold text-gray-900 dark:text-white">₹{{ plan.price.split('.')[0] }}</span>
                <span class="text-base font-medium text-gray-500 dark:text-gray-400">/ {{ plan.interval_unit }}</span>
              </div>
  
              <!-- Features -->
              <ul class="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <li class="flex items-center"><svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>Access to all articles</li>
                <li class="flex items-center"><svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>Ad-free experience</li>
                <li class="flex items-center"><svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>Cancel anytime</li>
              </ul>
              
              <!-- Action Button -->
              <div class="mt-auto pt-6">
                <button 
                  @click="handleChoosePlan(plan.id)"
                  :disabled="plan.current_plan || isSubscribing === plan.id"
                  class="w-full py-3 px-6 text-base font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60"
                  :class="{
                    'bg-indigo-600 text-white hover:bg-indigo-700': !plan.current_plan,
                    'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400': plan.current_plan
                  }"
                >
                  <span v-if="isSubscribing === plan.id">Processing...</span>
                  <span v-else-if="plan.current_plan">Your Current Plan</span>
                  <span v-else>Choose Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import { useToast } from 'vue-toastification';
  import { useAuthStore } from '@/stores/authStore'; // 1. Import the auth store
  
  const plans = ref([]);
  const isLoading = ref(true);
  const error = ref(null);
  const isSubscribing = ref(null); // Store the ID of the plan being subscribed to
  const toast = useToast();
  
  // 2. Instantiate the store
  const authStore = useAuthStore();
  
  // 3. Get the firebaseUid dynamically from the store
  const firebaseUid = computed(() => authStore.user?.uid);
  
  const fetchPlans = async () => {
    isLoading.value = true;
    error.value = null;
  
    // Check if the UID is available before making the call
    if (!firebaseUid.value) {
      error.value = "User not authenticated. Please log in to view subscription plans.";
      isLoading.value = false;
      return;
    }
  
    try {
      const response = await axios.get(route('proxy.get'), {
        params: {
          endpoint: 'subscription-plans',
          user_id: firebaseUid.value // Use the computed value
        }
      });
  
      if (response.data && response.data.status === true && Array.isArray(response.data.data)) {
        plans.value = response.data.data;
      } else {
        throw new Error("Invalid data format received from the server.");
      }
    } catch (err) {
      console.error("Error fetching subscription plans:", err);
      error.value = err.response?.data?.message || "Could not connect to the server.";
    } finally {
      isLoading.value = false;
    }
  };
  
  const handleChoosePlan = async (planId) => {
    isSubscribing.value = planId;
    toast.info(`Proceeding to checkout for plan ID: ${planId}`);
    
    // Here you would typically initiate a checkout process, e.g., redirect to Stripe/PayPal,
    // or make another API call to your backend to create a subscription.
    
    // Simulating an async action
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Checkout process would start now!");
    isSubscribing.value = null;
  };
  
  // 4. Ensure auth state is ready before fetching
  onMounted(async () => {
    // If the token isn't in the store, wait for the store to initialize it
    if (!authStore.token) {
      await authStore.initAuth();
    }
    
    // Now we can safely fetch the plans, knowing the user's UID is likely available
    fetchPlans();
  });
  </script>
<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { Link, usePage } from '@inertiajs/vue3';

const page = usePage();
const name = page.props.name;
const quote = page.props.quote;

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div class="grid h-dvh grid-cols-1 lg:grid-cols-2">
      <!-- Left side with background image -->
      <div class="relative hidden lg:flex flex-col items-start justify-between p-10 text-white">
        <div
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: 'url(https://png.pngtree.com/background/20250111/original/pngtree-nice-background-beautiful-h5-wallpaper-imag-picture-image_15708053.jpg)' }"
        ></div>
        <div class="relative z-10 flex items-center text-2xl font-semibold">
          <AppLogoIcon class="mr-3 size-10 text-white" />
          {{ name }}
        </div>
        <div v-if="quote" class="relative z-10 mt-auto">
          <blockquote class="space-y-4">
            <p class="text-xl font-light leading-snug">&ldquo;{{ quote.message }}&rdquo;</p>
            <footer class="mt-2 text-sm text-neutral-300">{{ quote.author }}</footer>
          </blockquote>
        </div>
      </div>
  
      <!-- Right side: Login form -->
      <div class="flex flex-col justify-center px-8 py-12 sm:px-16">
        <div class="mx-auto w-full max-w-md space-y-8">
          <div class="text-center">
            <h1 v-if="title" class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {{ title }}
            </h1>
            <p v-if="description" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ description }}
            </p>
          </div>
          <slot />
        </div>
      </div>
    </div>
  </template>
  
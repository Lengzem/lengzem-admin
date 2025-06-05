<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next';
import { useAppearance } from '@/composables/useAppearance';

interface Props {
  class?: string;
}

const props = defineProps<Props>();
const { appearance, updateAppearance } = useAppearance();
</script>

<template>
  <div 
    :class="[
      'inline-flex items-center rounded-full p-1 backdrop-blur-sm border border-neutral-200/70 dark:border-neutral-700/30 bg-white/30 dark:bg-neutral-900/30',
      props.class
    ]"
  >
    <!-- Light Mode Button -->
    <button
      @click="updateAppearance('light')"
      :class="[
        'flex items-center justify-center rounded-full p-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none',
        appearance === 'light'
          ? 'bg-white/90 text-amber-500 shadow-sm'
          : 'text-neutral-400 hover:bg-white/20 hover:text-neutral-600'
      ]"
      aria-label="Switch to light mode"
      :aria-pressed="appearance === 'light'"
    >
      <Sun class="h-5 w-5" />
    </button>

    <!-- Dark Mode Button -->
    <button
      @click="updateAppearance('dark')"
      :class="[
        'flex items-center justify-center rounded-full p-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none',
        appearance === 'dark'
          ? 'bg-neutral-800/90 text-indigo-300 shadow-sm'
          : 'text-neutral-500 hover:bg-neutral-800/20 hover:text-neutral-300'
      ]"
      aria-label="Switch to dark mode"
      :aria-pressed="appearance === 'dark'"
    >
      <Moon class="h-5 w-5" />
    </button>
  </div>
</template>
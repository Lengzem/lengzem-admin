<script setup lang="ts">
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';


const page = usePage();

const currentPath = page.props.ziggy?.location ? new URL(page.props.ziggy.location).pathname : '';
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 mt-16 rounded-t-3xl flex items-center justify-center">

    <div class="w-full max-w-4xl mx-auto">
      <section
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 transition-all duration-300 space-y-8 min-h-[800px]">
        <slot />
      </section>
    </div>

  </div>
</template>

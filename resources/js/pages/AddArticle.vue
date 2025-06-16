<script setup lang="ts">
import { onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import addArticle from '@/components/articleAddCom.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Article-Add',
        href: '/articalAdd',
    },
];

// Redirect to /login if no Firebase user
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = '/login';
    }
  });
});
</script>

<template>
    <Head title="Article-Add" />

    <AppLayout :breadcrumbs="breadcrumbs">
      <addArticle />
    </AppLayout>
</template>

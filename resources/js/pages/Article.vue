<script setup lang="ts">
import { onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import articleCom from '@/components/articleSearchCom.vue';
import articleList from '@/components/articleListCom.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Article',
        href: '/article',
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
    <Head title="Article" />

    <AppLayout :breadcrumbs="breadcrumbs">
            <articleCom />
            <articleList />
    </AppLayout>
</template>

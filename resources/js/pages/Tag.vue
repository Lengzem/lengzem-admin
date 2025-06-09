<script setup lang="ts">
import { onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import tagList from '../components/tagListCom.vue';
import tagSearch from '@/components/tagSearchCom.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tag',
        href: '/tag',
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
    <Head title="Tag" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <tagSearch />
        <tagList />
    </AppLayout>
</template>

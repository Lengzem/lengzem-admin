<script setup lang="ts">
import { onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import videoSearch from '@/components/mediaSearchCom.vue';
import videoList from '@/components/mediaListCom.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Video & Audio',
        href: '/media',
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
    <Head title="Video & Audio" />

    <AppLayout :breadcrumbs="breadcrumbs">
            <videoSearch />
            <videoList />
    </AppLayout>
</template>

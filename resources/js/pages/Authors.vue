<script setup lang="ts">
import { onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import authorSearch from '@/components/authorSearchCom.vue';
import authors from '../components/authorsListCom.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Authors',
        href: '/author',
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
    <Head title="Authors" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <authorSearch />
        <authors />
    </AppLayout>
</template>

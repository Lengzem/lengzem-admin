<script setup lang="ts">
import { onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import commAdd from '@/components/commAddCom.vue';
import commList from '@/components/commListCom.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Comments',
        href: '/comment',
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
    <Head title="Comments" />

    <AppLayout :breadcrumbs="breadcrumbs">
      <commList />  
      <commAdd />
    </AppLayout>
</template>

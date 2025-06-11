<script setup lang="ts">
import { onMounted } from 'vue';
import { getAuth, onAuthStateChanged, getIdToken } from 'firebase/auth';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard Panel',
    href: '/dashboard',
  },
];

// Redirect to /login if no Firebase user
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = '/login'; // Redirect to login if no user
    } else {
      // Log the user's token
      getIdToken(user).then((idToken) => {
        console.log('Current User Token:', idToken);
      }).catch((error) => {
        console.error('Error getting user token:', error);
      });
    }
  });
});
</script>

<template>
    <Head title="Dashboard Panel" />

    <AppLayout :breadcrumbs="breadcrumbs">
               
    </AppLayout>
</template>
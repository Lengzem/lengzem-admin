<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import tagList from '../components/tagListCom.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tag',
        href: '/tag',
    },
];
</script>

<template>
    <Head title="Tag" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <tagList />
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import articleCom from '@/components/articleCom.vue';
import articleList from '@/components/articleListCom.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Article',
        href: '/article',
    },
];
</script>

<template>
    <Head title="Article" />

    <AppLayout :breadcrumbs="breadcrumbs">
            <articleCom />
            <articleList />
    </AppLayout>
</template>

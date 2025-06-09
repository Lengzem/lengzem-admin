<template>
    <img :src="logoUrl" :alt="altText" :class="className" v-bind="$attrs" />
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

defineOptions({
    inheritAttrs: false,
});

interface Props {
    altText?: string; // Optional alt text
    className?: HTMLAttributes['class'];
}

defineProps<Props>();

const logoUrl = '/images/app_icon.png'; // Directly from the public folder
</script>

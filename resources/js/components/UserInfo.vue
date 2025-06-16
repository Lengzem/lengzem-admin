<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/composables/useInitials';
import type { User } from '@/types';
import { computed } from 'vue';

interface Props {
  user?: User | null;
  showEmail?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  showEmail: false,
});

const { getInitials } = useInitials();

const showAvatar = computed(() => props.user?.photoURL && props.user.photoURL !== '');
</script>

<template>
  <div v-if="user" class="flex items-center space-x-3">
    <Avatar class="h-8 w-8 overflow-hidden rounded-lg">
      <AvatarImage v-if="showAvatar" :src="user.photoURL" :alt="user.displayName || 'User'" />
      <AvatarFallback class="rounded-lg text-black dark:text-white">
        {{ getInitials(user.displayName || user.phoneNumber || 'U') }}
      </AvatarFallback>
    </Avatar>

    <div class="grid flex-1 text-left text-sm leading-tight">
      <span class="truncate text-xs text-muted-foreground">
        {{ user.phoneNumber || user.email }}
      </span>
    </div>
  </div>
</template>

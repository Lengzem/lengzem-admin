<script setup lang="ts">
import UserInfo from '@/components/UserInfo.vue';
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { User } from '@/types';
import { Link } from '@inertiajs/vue3';
import { LogOut, UserRound } from 'lucide-vue-next';
import { getAuth, signOut } from 'firebase/auth';
import { router } from '@inertiajs/vue3';
import { saveLastPage } from '@/utils/authRedirect';

interface Props {
    user: User;
}

defineProps<Props>();

const handleLogout = async () => {
    saveLastPage();
  const auth = getAuth();
  try {
    await signOut(auth);

    // Optional: You can redirect or refresh the page
    router.visit('/login'); // or wherever you want to send them
  } catch (error) {
    console.error('Logout error:', error);
  }
};

</script>

<template>
    <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserInfo :user="user" :show-contact="true" />
        </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
        <DropdownMenuItem :as-child="true">
            <Link class="block w-full" :href="route('profile.edit')" as="button">
                <UserRound class="mr-2 h-4 w-4" />
                Profile
            </Link>
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem @click="handleLogout" class="cursor-pointer">
    <LogOut class="mr-2 h-4 w-4" />
    Log out
</DropdownMenuItem>
</template>

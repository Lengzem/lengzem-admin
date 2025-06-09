<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuContent,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import UserMenuContent from '@/components/UserMenuContent.vue';
import { getInitials } from '@/composables/useInitials';
import type { BreadcrumbItem, NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';
// Ensure NotebookIcon and ChevronDownIcon are imported
import { BookOpen, Folder, Home, LayoutGrid, Menu, Search, Crown, NotebookIcon, Bell, Play, ChevronDownIcon } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import Switch from '../components/ui/button/lightDark.vue';

// ✅ Import from your working firebase file
import { auth } from '@/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const inertiaUser = computed(() => page.props.auth);

const firebaseUser = ref<User | null>(null);

onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        firebaseUser.value = user;
    });
});

const avatarError = ref(false);

const isCurrentRoute = computed(() => (url: string) => {
    const normalize = (path: string) => path.replace(/\/+$/, '') || '/';
    return normalize(page.url) === normalize(url);
});

const activeItemStyles = computed(
    () => (url: string) => (isCurrentRoute.value(url) ? 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100' : '')
);

const mainNavItems: NavItem[] = [
    { title: 'Home', href: '/', icon: Home },
    { title: 'Search', href: '/search', icon: Search },
    { title: 'Subscription', href: '/subscription', icon: Crown },
    { title: 'Category', href: '/category', icon: LayoutGrid },
];

// Updated "components" data structure
const components: { title: string, href: string }[] = [
    {
        title: 'About us',
        href: '/about', // Assuming these are actual routes
    },
    {
        title: 'Contact us',
        href: '/contact',
    },
    {
        title: 'Help Centre',
        href: '/help',
    },
    {
        title: 'FAQ',
        href: '/faq',
    },
];

const currentPath = ref('/');
onMounted(() => {
    currentPath.value = window.location.pathname;
});

// Ref for mobile components dropdown
const mobileComponentsOpen = ref(false);
</script>

<template>
    <div>
        <!-- Top Navigation Bar -->
        <div
            class="fixed top-0 left-0 right-0 z-50 bg-white/30 dark:bg-gray-900/40 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-3xl shadow-md ring-1 ring-black/5 dark:ring-white/10 mx-2 mt-2">
            <div class="w-full flex h-14 items-center px-4">

                <!-- Mobile Menu Button -->
                <div class="lg:hidden">
                    <Sheet>
                        <SheetTrigger :as-child="true">
                            <Button variant="ghost" size="icon" class="mr-2 h-9 w-9">
                                <Menu class="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" class="w-[300px] p-6">
                            <SheetTitle class="sr-only">Navigation Menu</SheetTitle>
                            <SheetHeader class="flex justify-start text-left mb-4">
                                <AppLogoIcon class="size-6 fill-current text-black dark:text-white" />
                            </SheetHeader>
                            <div class="flex h-full flex-1 flex-col justify-between space-y-4">
                                <nav class="-mx-3 space-y-1">
                                    <Link v-for="item in mainNavItems" :key="item.title" :href="item.href"
                                        class="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                                        :class="activeItemStyles(item.href)"
                                        :aria-current="isCurrentRoute(item.href) ? 'page' : null">
                                    <component v-if="item.icon" :is="item.icon" class="h-5 w-5" />
                                    {{ item.title }}
                                    </Link>

                                    <!-- Components section for mobile -->
                                    <div class="pt-2">
                                        <button @click="mobileComponentsOpen = !mobileComponentsOpen"
                                            class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                                            :aria-expanded="mobileComponentsOpen">
                                            <span class="flex items-center gap-x-3">
                                                <NotebookIcon class="h-5 w-5" />
                                                Components
                                            </span>
                                            <ChevronDownIcon class="h-4 w-4 transform transition-transform duration-200"
                                                :class="{ 'rotate-180': mobileComponentsOpen }" />
                                        </button>
                                        <div v-if="mobileComponentsOpen" class="mt-1 space-y-1 pl-6">
                                            <!-- If these are Inertia routes, use <Link :href="componentItem.href"> -->
                                            <a v-for="componentItem in components" :key="componentItem.title"
                                                :href="componentItem.href"
                                                class="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                                                :class="activeItemStyles(componentItem.href)"
                                                :aria-current="isCurrentRoute(componentItem.href) ? 'page' : null">
                                                {{ componentItem.title }}
                                            </a>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <!-- Logo -->
                <Link :href="route('home')" class="flex items-center gap-x-2" aria-label="Home">
                <AppLogo />
                </Link>

                <!-- Desktop Navigation -->
                <div class="hidden h-full lg:flex lg:flex-1 justify-center">
                    <NavigationMenu class="flex h-full items-stretch">
                        <NavigationMenuList class="flex h-full items-stretch space-x-2">
                            <NavigationMenuItem v-for="(item, index) in mainNavItems" :key="index"
                                class="relative flex h-full items-center">
                                <Link :href="item.href" :aria-current="isCurrentRoute(item.href) ? 'page' : null">
                                <NavigationMenuLink
                                    :class="[navigationMenuTriggerStyle(), activeItemStyles(item.href), 'h-9 cursor-pointer px-3']">
                                    <component v-if="item.icon" :is="item.icon" class="mr-2 h-4 w-4" />
                                    {{ item.title }}
                                </NavigationMenuLink>
                                </Link>
                                <div v-if="isCurrentRoute(item.href)"
                                    class="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white">
                                </div>
                            </NavigationMenuItem>

                            <!-- "Components" Dropdown Menu Item -->
                            <NavigationMenuItem class="relative flex h-full items-center">
                                <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                                <NavigationMenuContent class="left-1/2 -translate-x-1/2">
                                    <ul class="grid w-[400px] gap-1 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                        <li v-for="component in components" :key="component.title">
                                            <NavigationMenuLink as-child>
                                                <a :href="component.href"
                                                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                                    <div class="text-sm font-medium leading-none">{{ component.title }}
                                                    </div>
                                                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                        {{ component.description }}
                                                    </p>
                                                </a>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <!-- Right-side actions -->
                <div class="ml-auto flex items-center space-x-2">
                    <Switch />

                    <!-- User Menu or Login/Register -->
                    <div class="ml-auto flex items-center space-x-3">
                        <DropdownMenu>
                            <template v-if="firebaseUser">
                                <DropdownMenuTrigger as-child>
                                    <Button variant="ghost" size="icon"
                                        class="relative size-10 w-auto rounded-full p-1 focus:ring-2 focus:ring-blue-500">
                                        <Avatar class="size-9 overflow-hidden rounded-full">
                                            <AvatarImage v-if="firebaseUser?.photoURL && !avatarError"
                                                :src="firebaseUser.photoURL"
                                                :alt="firebaseUser?.displayName ?? 'User Avatar'"
                                                @error="avatarError = true" />
                                            <AvatarFallback
                                                class="rounded-lg bg-gray-300 dark:bg-gray-600 font-semibold text-black dark:text-white">
                                                {{ getInitials(firebaseUser?.displayName ?? firebaseUser?.email ?? '')
                                                }}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end"
                                    class="w-56 shadow-lg rounded-md bg-white dark:bg-gray-800">
                                    <UserMenuContent :user="firebaseUser" />
                                </DropdownMenuContent>
                            </template>
                            <template v-else>
                                <DropdownMenuTrigger as-child>
                                    <Button variant="outline"
                                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700">
                                        Login
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" class="w-48">
                                    <SidebarMenuButton as="a" :href="route('login')">Login
                                    </SidebarMenuButton>
                                    <SidebarMenuButton as="a" :href="route('register')">
                                        Register</SidebarMenuButton>
                                </DropdownMenuContent>
                            </template>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>

        <!-- Breadcrumbs -->
        <div v-if="props.breadcrumbs.length > 1" class="flex w-full border-b border-sidebar-border/70">
            <div class="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                <Breadcrumbs :breadcrumbs="breadcrumbs" />
            </div>
        </div>
    </div>
</template>
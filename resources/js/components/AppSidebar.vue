<script setup lang="ts">
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/vue3';
import { BookOpen, ChartBar, Crown, Folder, LayoutGrid, Newspaper, Notebook, Pencil, Tag, User } from 'lucide-vue-next';
import AppLogo from './AppLogo.vue';
import Comment from '@/pages/Comment.vue';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Article',
        href: '/article',
        icon: Newspaper,
    },
    {
        title: 'Author',
        href: '/author',
        icon: Pencil,
    },
    {
        title: 'User',
        href: '/user',
        icon: User,
    },
    {
        title: 'Category',
        href: '/category',
        icon: ChartBar,
    },
    {
        title: 'Tag',
        href: '/tag',
        icon: Tag,
    },
    {
        title: 'Subscription',
        href: '/subscription',
        icon: Crown,
    },
    {
        title: 'Comment',
        href: 'article/comment',
        icon: Notebook,
    },
];
</script>

<template>
    <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="route('dashboard')">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
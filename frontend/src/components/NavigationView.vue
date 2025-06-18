<template>
    <!-- Desktop Nav -->
    <nav class="d-none d-lg-flex align-center flex-row flex-nowrap overflow-x-auto">
        <NavButton v-for="route in routes" :key="route.path" :href="route.path" :label="route.name"
            :isActive="route.path === currentPath" class="ma-2 text-capitalize" />
    </nav>

    <!-- Mobile Nav (Menu Icon + Drawer) -->
    <div class="d-flex d-lg-none align-center">
        <v-btn variant="outlined"  @click="isDrawerOpen = true">
            <v-icon>
                <Menu />
            </v-icon>
        </v-btn>

        <v-navigation-drawer v-model="isDrawerOpen" location="left" temporary width="250">
            <v-list class="pt-4">
                <v-list-item v-for="route in routes" :key="route.path" @click="navigate(route.path)"
                    :active="currentPath === route.path" rounded>
                    {{ route.name }}
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavButton from '../components/NavButton.vue';
import { Menu } from 'lucide-vue-next';

const isDrawerOpen = ref(false);
const route = useRoute();
const router = useRouter();

const currentPath = computed(() => route.path);

function navigate(path) {
    router.push(path);
    isDrawerOpen.value = false;
}

const routes = [
    { name: 'Overview', path: '/', requiresAuth: true },
    { name: 'Transactions', path: '/transactions', requiresAuth: true },
    { name: 'Accounts', path: '/accounts', requiresAuth: true },
    { name: 'Categories', path: '/categories', requiresAuth: true },
    { name: 'Settings', path: '/settings', requiresAuth: true },
];
</script>

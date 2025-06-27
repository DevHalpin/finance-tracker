<template>
    <v-app>
        <NewAccountDrawer v-model="newAccountOpen" />
        <EditAccountDrawer v-model="editAccountOpen" />
        <EditCategoryDrawer v-model="editCategoryOpen" />
        <NewCategoryDrawer v-model="newCategoryOpen" />
        <HeaderView />
        <router-view />
    </v-app>
</template>

<script setup lang="ts">
// import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@clerk/vue';
import { watchEffect } from 'vue';
import HeaderView from './components/HeaderView.vue';
import NewAccountDrawer from './features/accounts/components/NewAccount.vue';
import EditAccountDrawer from './features/accounts/components/EditAccount.vue';
import EditCategoryDrawer from './features/categories/components/EditCategory.vue';
import NewCategoryDrawer from './features/categories/components/NewCategory.vue';
import { useNewAccount } from './features/accounts/hooks/useNewAccount';
import { useOpenAccount } from './features/accounts/hooks/useOpenAccount';
import { useNewCategory } from './features/categories/hooks/useNewCategory';
import { useOpenCategory } from './features/categories/hooks/useOpenCategory';
const { drawerOpen: newAccountOpen } = useNewAccount();
const { drawerOpen: editAccountOpen } = useOpenAccount();
const { drawerOpen: newCategoryOpen } = useNewCategory();
const { drawerOpen: editCategoryOpen } = useOpenCategory();

const { isLoaded, isSignedIn } = useAuth();
const router = useRouter();
const route = useRoute();

watchEffect(() => {
    if (!isLoaded.value) return

    // Only redirect if trying to access a protected page
    if (route.meta.requiresAuth && !isSignedIn.value) {
        router.push('/sign-in')
    }
})

</script>

<style>
html,
body,
#app {
    height: 100%;
    margin: 0;
}

.text-muted-foreground {
    color: #6B7280;
}
</style>

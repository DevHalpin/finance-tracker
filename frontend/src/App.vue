<template>
    <v-app>
        <HeaderView />
        <router-view />
    </v-app>
</template>

<script setup>
// import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@clerk/vue';
import { watchEffect } from 'vue';
import HeaderView from './views/HeaderView.vue';

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

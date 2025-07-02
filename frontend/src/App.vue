<template>
    <AppLayout>
        <router-view />
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from './layouts/AppLayout.vue';
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

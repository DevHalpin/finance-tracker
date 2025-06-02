<template>
    <a href="/">
        <div class="d-none d-lg-flex align-center">
            <v-img :src="logo" alt="Logo" class="logo-img" />
            <p class="logo-text ml-2">Finance Tracker</p>
        </div>
    </a>
</template>

<script setup>
import logo from '@/assets/cat-logo.svg';
</script>

<style scoped>
a {
    text-decoration: none;
}

.logo-img {
    height: 7rem;
    width: 7rem;
}

.logo-text {
    font-weight: 600;
    color: white;
    font-size: 1.5rem;
    margin-left: 0.625rem;
}
</style>

<template>
    <v-btn :to="href" :class="[
        'nav-button',
        isActive ? 'active' : ''
    ]" variant="outlined" size="small" exact router>
        {{ label }}
    </v-btn>
</template>

<script setup>
defineProps({
    href: String,
    label: String,
    isActive: Boolean,
});
</script>

<style scoped>
.nav-button {
    justify-content: space-between;
    font-weight: 400;
    color: white;
    border: none;
    outline: none;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
}

.nav-button:focus,
.nav-button:focus-visible {
    background-color: rgba(255, 255, 255, 0.3);
    outline: none;
    box-shadow: none;
}

.active {
    background-color: rgba(255, 255, 255, 0.1);
    font-weight: 600;
    text-decoration: underline;
}
</style>

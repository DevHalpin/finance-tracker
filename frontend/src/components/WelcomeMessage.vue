<template>
<div class="space-y-2 mb-4">
    <h2 class="header">
        Welcome Back{{ isAuthenticated ? ", " : " " }}{{ user?.name }}
    </h2>
    <p class="title">
        This is your Financial Overview
    </p>
</div>

</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';

const { user, isAuthenticated } = useAuth0();
</script>

<style scoped>
.header {
  font-size: 1.5rem;      /* 24px */
  line-height: 2rem;      /* 32px */
  color: white;
  font-weight: 500;       /* medium */
}

@media (min-width: 1024px) {
  .header {
    font-size: 2.25rem;   /* 36px */
    line-height: 2.5rem;  /* 40px */
  }
}
.title {
  font-size: 0.875rem;     /* 14px */
  line-height: 1.25rem;    /* 20px */
  color: #89b6fd;
}

@media (min-width: 1024px) {
  .title {
    font-size: 1rem;        /* 16px */
    line-height: 1.5rem;    /* 24px */
  }
}

</style>

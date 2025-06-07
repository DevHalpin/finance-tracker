<template>
  <v-app>
    <v-main>
      <v-container>
        <v-btn color="primary" class="mb-4" @click="openDrawer">
          Add an account
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// import { ref } from 'vue'
// import { useAuthFetch } from '../features/api/authFetch'
import { useNewAccount } from '../features/api/accounts/hooks/useNewAccount'

const { openDrawer } = useNewAccount()

// const message = ref('Loading data from API...')


// onMounted(async () => {
// })
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>

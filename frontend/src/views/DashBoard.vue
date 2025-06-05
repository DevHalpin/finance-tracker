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
  <NewAccountDrawer v-model="drawerOpen" />
</template>

<script setup>
// import { ref } from 'vue'
// import { useAuthFetch } from '../features/api/authFetch'
import NewAccountDrawer from '../features/api/accounts/components/NewAccount.vue'
import { useNewAccount } from '../features/api/accounts/hooks/useNewAccount'

const { drawerOpen, openDrawer } = useNewAccount()

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

<template>
    <v-app>
        <v-main>
            <v-container class="fill-height" fluid>
                <v-row class="justify-center align-center">
                    <v-col cols="auto">
                        <v-card class="pa-5" elevation="8">
                            <v-card-title class="text-h5">Welcome to Vuetify + Bun + Vue 3</v-card-title>
                            <v-card-text>
                                <v-btn color="primary" @click="clickCount++">
                                    You clicked me {{ clickCount }} times
                                </v-btn>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="auto">
                        <v-card class="pa-5" elevation="8">
                            <v-card-title class="text-h5">API Response</v-card-title>
                            <v-card-text>
                                <h2>{{ message }}</h2>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>

        </v-main>
    </v-app>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useAuthFetch } from '../features/api/authFetch'

const clickCount = ref(0)
const message = ref('Loading data from API...')

onMounted(async () => {
    const { authFetch } = useAuthFetch()
    const data = await authFetch('/api/hello/')
    console.log(data.message)
    message.value = data.message
})

</script>

<style>
html,
body,
#app {
    height: 100%;
    margin: 0;
}
</style>

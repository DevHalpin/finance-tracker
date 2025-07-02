import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Toast, { POSITION } from "vue-toastification";
import type { PluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css'

// Vuetify
import vuetify from './plugins/vuetify'

// Clerk
import { clerkPlugin } from '@clerk/vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) throw new Error('Missing Clerk key')

const options: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 5000,
  closeOnClick: true,
}

const app = createApp(App)

const queryClient = new QueryClient()

app.use(router)
app.use(vuetify)
app.use(Toast, options)
app.use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY })
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')

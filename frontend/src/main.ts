
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Toast, { POSITION } from "vue-toastification";
import type { PluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css'

// Vuetify
import vuetify from './plugins/vuetify'

import { createAuth0 } from '@auth0/auth0-vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App)

const queryClient = new QueryClient()

const options: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 5000,
  closeOnClick: true
}
app.use(router)
app.use(vuetify)
app.use(Toast, options)
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: `${window.location.origin}`,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE
    }
  })
)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')

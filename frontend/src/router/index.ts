import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/DashBoard.vue'
import NotFound from '../views/NotFound.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import AccountsView from '../views/AccountsView.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/sign-in', name: 'Sign In', component: SignIn },
  { path: '/sign-up', name: 'Sign Up', component: SignUp },
  { path: '/accounts', name: 'Accounts', component: AccountsView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
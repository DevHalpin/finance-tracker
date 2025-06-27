import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard/DashBoard.vue'
import NotFound from '../views/NotFound/NotFound.vue'
import SignIn from '../views/SignIn/SignIn.vue'
import SignUp from '../views/SignUp/SignUp.vue'
import AccountsView from '../features/accounts/pages/AccountsView.vue'
import CategoriesView from '../features/categories/pages/CategoriesView.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/sign-in', name: 'Sign In', component: SignIn },
  { path: '/sign-up', name: 'Sign Up', component: SignUp },
  { path: '/accounts', name: 'Accounts', component: AccountsView, meta: { requiresAuth: true } },
  { path: '/categories', name: 'Categories', component: CategoriesView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
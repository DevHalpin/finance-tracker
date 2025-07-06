import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue';

const routes = [
  { path: '/', name: 'Dashboard', component: () => import('../views/Dashboard/DashBoard.vue'), beforeEnter: authGuard },
  { path: '/sign-in', name: 'Sign In', component: () => import('../views/SignIn/SignIn.vue') },
  { path: '/sign-up', name: 'Sign Up', component: () => import('../views/SignUp/SignUp.vue') },
  { path: '/transactions', name: 'Transactions', component: () => import('../features/transactions/pages/TransactionsView.vue'), beforeEnter: authGuard },
  { path: '/accounts', name: 'Accounts', component: () => import('../features/accounts/pages/AccountsView.vue'), beforeEnter: authGuard },
  { path: '/categories', name: 'Categories', component: () => import('../features/categories/pages/CategoriesView.vue'), beforeEnter: authGuard },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router;

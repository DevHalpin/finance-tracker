import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@clerk/vue'
import { watch } from 'vue'
const routes = [
  { path: '/', name: 'Dashboard', component: () => import('../views/Dashboard/DashBoard.vue'), meta: { requiresAuth: true } },
  { path: '/sign-in', name: 'Sign In', component: () => import('../views/SignIn/SignIn.vue') },
  { path: '/sign-up', name: 'Sign Up', component: () => import('../views/SignUp/SignUp.vue') },
  { path: '/accounts', name: 'Accounts', component: () => import('../features/accounts/pages/AccountsView.vue'), meta: { requiresAuth: true } },
  { path: '/categories', name: 'Categories', component: () => import('../features/categories/pages/CategoriesView.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;

  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded.value) {
    const unwatch = watch(isLoaded, () => {
      if (requiresAuth && !isSignedIn.value) {
        next({ name: 'Sign In', query: { redirect: to.fullPath } });
      } else {
        next();
      }
      unwatch();
    })
  } else {
    if (requiresAuth && !isSignedIn.value) {
      next({ name: 'Sign In', query: { redirect: to.fullPath } });
    } else {
      next();
    }
  }
});

export default router;
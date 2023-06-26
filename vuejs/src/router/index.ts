import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/security/login.vue'
import Registre from '../views/security/register.vue'
import Account from '../views/security/account.vue'
import Logout from '../views/security/logout.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Registre
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router

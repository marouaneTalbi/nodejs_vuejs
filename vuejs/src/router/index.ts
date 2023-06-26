import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameModeView from '../views/GameModeView.vue'
import Login from '../views/security/login.vue'
import Registre from '../views/security/register.vue'
import Dashboard from '../views/Dashboard.vue'
import Stats from '../views/StatsView.vue'
import Billing from '../views/BillingView.vue'
import Profile from '../views/ProfileView.vue'
import User from '../views/UserView.vue'

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
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/gamemode',
      name: 'gamemode',
      component: GameModeView
    },
    {
      path: '/dashboard/admin',
      path: '/admin',
      name: 'admin',
      component: Dashboard
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats
    },
    {
      path: '/billing',
      name: 'billing',
      component: Billing
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      // path: '/user/:slug',
      path: '/user/:id',
      name: 'user',
      component: User
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router

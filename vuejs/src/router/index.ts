import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameModeView from '../views/GameModeView.vue'
import Login from '../views/security/login.vue'
import Registre from '../views/security/register.vue'
import Account from '../views/security/account.vue'
import Logout from '../views/security/logout.vue'
import Dashboard from '../views/Dashboard.vue'
import Stats from '../views/StatsView.vue'
import Billing from '../views/BillingView.vue'
import Profile from '../views/ProfileView.vue'
import User from '../views/UserView.vue'
import Skins from '../views/SkinsView.vue'
import Skin from '../views/SkinView.vue'
import SkinsToBuY from '../views/SkinsToBuyView.vue'




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
      path: '/gamemode',
      name: 'gamemode',
      component: GameModeView
    },
    {
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
      path: '/skin/:id',
      name: 'skin',
      component: Skin
    },
    {
      // path: '/user/:slug',
      path: '/skins/',
      name: 'skins',
      component: Skins
    },
    {
      // path: '/user/:slug',
      path: '/skins_to_buy/',
      name: 'skins_to_buy',
      component: SkinsToBuY
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router

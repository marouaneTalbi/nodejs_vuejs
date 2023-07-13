import { createRouter, createWebHistory } from 'vue-router'
import jwtDecode from 'jwt-decode';
import HomeView from '../views/HomeView.vue'
import GameModeView from '../views/GameModeView.vue'
import Game from '../views/GameView.vue'
import Login from '../views/security/login.vue'
import Registre from '../views/security/register.vue'
import Account from '../views/security/account.vue'
import Logout from '../views/security/logout.vue'
import Cookies from "js-cookie";
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
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false, requiredRole: 'guest' }
    },
    {
      path: '/register',
      name: 'register',
      component: Registre,
      meta: { requiresAuth: false, requiredRole: 'guest'  }
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
      meta: { requiresAuth: true, requiredRole: 'gamer' }
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
      meta: { requiresAuth: true, requiredRole: 'gamer' }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false, requiredRole: 'guest'}

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
      component: User,
      meta: { requiresAuth: true, requiredRole: 'admin'}
    },
    {
      path: '/game/:id',
      name: 'game',
      component: Game,
      meta: { requiresAuth: true, requiredRole: 'admin'}
    },
    {
      path: '/skin/:id',
      name: 'skin',
      component: Skin,
      meta: { requiresAuth: true, requiredRole: 'admin'}
    },
    {
      // path: '/user/:slug',
      path: '/skins/',
      name: 'skins',
      component: Skins,
      meta: { requiresAuth: true, requiredRole: 'admin'}
    },
    {
      // path: '/user/:slug',
      path: '/skins_to_buy/',
      name: 'skins_to_buy',
      component: SkinsToBuY,
      meta: { requiresAuth: true, requiredRole: 'admin'}
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false, requiredRole: 'guest' }
    }
  ]
})

function getUserRole() {
  const token = Cookies.get('token');
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.role) {
        return decodedToken.role;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  return 'guest';
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = Cookies.get('token');
    console.log(token)
    if (!token) {
      next('/login');
    } else {
      const userRole = getUserRole();
      const requiredRole = to.meta.requiredRole;

      console.log(userRole,requiredRole )

      if (userRole === requiredRole) {
        next();
      } else {
        next('/access-denied');
      }
    }
  } else {
    next();
  }
});

export default router

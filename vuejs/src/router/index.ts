import { createRouter, createWebHistory } from 'vue-router'
import jwtDecode from 'jwt-decode';
import HomeView from '../views/HomeView.vue'
import GameModeView from '../views/GameModeView.vue'
import Game from '../views/GameView.vue'
import Login from '../views/security/login.vue'
import Registre from '../views/security/register.vue'
import Account from '../views/security/account.vue'
import Cookies from "js-cookie";
import Dashboard from '../views/Dashboard.vue'
import Stats from '../views/StatsView.vue'
import Billing from '../views/BillingView.vue'
import Profile from '../views/ProfileView.vue'
import User from '../views/UserView.vue'
import Skins from '../views/SkinsView.vue'
import Skin from '../views/SkinView.vue'
import SkinsToBuY from '../views/SkinsToBuyView.vue'
import Confirm from "@/views/security/confirm.vue";
import ForgotPassword from "@/views/security/forgotPassword.vue";
import InitPassword from "@/views/security/initPassword.vue";
import AdminGrades from "@/views/AdminGrades.vue";
import AdminGrade from "@/views/AdminGrade.vue";
import UserGrade from "@/views/UserGrade.vue";

import AccessDenied from '../views/security/access-denied.vue'
import NotFound from '../views/security/not-found.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false, requiredRoles: ['gamer', 'admin'] }
    },
    {
      path: '/register',
      name: 'register',
      component: Registre,
      meta: { requiresAuth: false, requiredRoles: ['gamer', 'admin']  }
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
      meta: { requiresAuth: true, requiredRoles: ['gamer', 'admin'] }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false, requiredRoles: ['gamer', 'admin'] }
    },
    {
      path: '/gamemode',
      name: 'gamemode',
      component: GameModeView,
      meta: { requiresAuth: true, requiredRoles: ['gamer', 'admin'] }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Dashboard,
      meta: { requiresAuth: true, requiredRoles: ['admin'] }
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats,
      meta: { requiresAuth: true, requiredRoles: ['gamer', 'admin']}
    },
    {
      path: '/billing',
      name: 'billing',
      component: Billing,
      meta: { requiresAuth: true, requiredRole: 'gamer'}
    },
    {
      path: '/profile',
      name: 'profile',
      component: Account,
      meta: { requiresAuth: true, requiredRoles: ['gamer', 'admin'] }
    },
    {
      path: '/user/:id',
      name: 'user',
      component: User,
      meta: { requiresAuth: true, requiredRoles: ['gamer', 'admin']}

    },
    {
      path: '/game/:id',
      name: 'game',
      component: Game,
      meta: { requiresAuth: true, requiredRoles: ['gamer', 'admin']}
    },
    {
      path: '/skin/:id',
      name: 'skin',
      component: Skin,
      meta: { requiresAuth: true, requiredRoles: ['gamer', 'admin']}
    },
    {
      path: '/skins/',
      name: 'skins',
      component: Skins,
      meta: { requiresAuth: true, requiredRoles: ['gamer', 'admin']}
    },
    {
      path: '/skins_to_buy/',
      name: 'skins_to_buy',
      component: SkinsToBuY,
      meta: { requiresAuth: true, requiredRoles:['gamer', 'admin', 'gamer']}
    },
    {
      path: '/access-denied',
      name: 'access-denied',
      component: AccessDenied,
      meta: { requiresAuth: false, requiredRole: 'guest'}
    },
    { 
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound 
    },  
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false, requiredRoles: ['gamer', 'admin'] }
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: Confirm,
      meta: { requiresAuth: false, requiredRoles: ['gamer', 'admin']}
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: ForgotPassword,
      meta: { requiresAuth: false, requiredRoles: []}
    },
    {
      path: '/initPassword',
      name: 'initPassword',
      component: InitPassword,
      meta: { requiresAuth: false, requiredRoles: []}
    },
    {
      path: '/admin/grades',
      name: 'AdminGrades',
      component: AdminGrades,
      meta: { requiresAuth: true, requiredRoles: ['admin']}
    },
    {
      path: '/admin/grade/:id',
      name: 'AdminGrade',
      component: AdminGrade,
      meta: { requiresAuth: true, requiredRoles: ['admin']}
    },
    {
      path: '/grade',
      name: 'UserGrade',
      component: UserGrade,
      meta: { requiresAuth: true, requiredRoles: ['gamer']}
    }
  ]
})

function getUserRole() {
  const token = Cookies.get('token');
  if (token) {
    try {
      const decodedToken:any = jwtDecode(token);
      if (decodedToken && decodedToken.role) {
        return decodedToken.role;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  return 'gamer';
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = Cookies.get('token');
    if (!token) {
      next('/login');
    } else {
      const userRole = getUserRole();
      const requiredRoles:any = to.meta.requiredRoles;

      if (requiredRoles.some((role:any) => userRole === role)) {

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

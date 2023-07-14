<template>
  <header :class="{'scrolled-nav': windowWidth}">
    <h1>MEMO</h1>
    <nav v-show="!mobile">
      <ul>
        <li v-for="menuOption in filteredMenuOptions" :key="menuOption.route">
          <router-link :to="menuOption.route" :class="{ 'active': currentRoute === menuOption.route }">
            <a href="#">{{ menuOption.label }}</a>
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="button-container" v-show="!mobile">
      <button class="button button--transparent"  @click="logout">Logout</button>
      <router-link to="/gamemode">
        <button class="button">Jouer</button>
      </router-link>
    </div>

    <div class="icon" v-show="mobile">
      <svg @click="toggleMobileNav" v-show="mobile" :class="{'icon-active': mobileNav}" class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 6h14M7 10h10M5 14h14M9 18h6"></path>
      </svg>
    </div>

    <transition name="mobile-nav">
      <nav v-show="mobileNav" class="dropdown-nav">
        <ul>
          <li v-for="menuOption in filteredMenuOptions" :key="menuOption.route">
            <router-link :to="menuOption.route" :class="{ 'active': currentRoute === menuOption.route }">
              <a href="#">{{ menuOption.label }}</a>
            </router-link>
          </li>
        </ul>
      </nav>
    </transition>
  </header>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";
import { serverURI } from '../api/api.js';

export default {
  name: 'Header',
  data() {
    return {
      currentRoute: '',
      scrollPosition: null,
      mobile: false,
      mobileNav: null,
      windowWidth: null,
      userRoles: [],
      menuOptions: [
        { route: '/admin', label: 'Administration', requiredRoles: ['admin',] },
        { route: '/stats', label: 'Stats', requiredRoles: ['admin',] },
        { route: '/billing', label: 'Billing', requiredRoles: ['admin', 'gamer'] },
        { route: '/profile', label: 'Profile', requiredRoles: ['admin']},
        { route: '/account', label: 'Account', requiredRoles: ['gamer'] },
        { route: '/skins', label: 'Skins', requiredRoles: ['admin', 'gamer'] }
      ]
    };
  },
  created() {
    this.currentRoute = this.$route.path;
    window.addEventListener("resize", this.checkScreen);
    this.checkScreen();
    this.getUserInfo();
  },
  watch: {
    $route(newRoute) {
      this.currentRoute = newRoute.path;
    }
  },
  computed: {
    filteredMenuOptions() {
      return this.menuOptions.filter(option => {
        if (option.requiredRoles.length === 0) {
          return true;
        } else {
          return option.requiredRoles.some(role => this.userRoles.includes(role));
        }
      });
    }
  },
  methods: {
    changeRoute(route) {
      this.currentRoute = route;
      this.$router.push(route);
    },
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav;
    },
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth <= 1000) {
        this.mobile = true;
      } else {
        this.mobile = false;
        this.mobileNav = false;
      }
    },
    async getUserInfo() {
      try {
        const token = Cookies.get('token');
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;
        const response = await axios.get(`${serverURI}/user/${userId}/postgres`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        this.userRoles = response.data.role;
      } catch (error) {
        console.error(error);
      }
    },
    async logout() {
      try {
        const token = Cookies.get('token');
        await axios.post(`${serverURI}/logout`);
        Cookies.remove('token');
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>

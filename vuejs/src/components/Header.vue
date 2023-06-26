<template>
    <header :class="{'scrolled-nav': windowWidth}">
        <h1>MEMO</h1>
        <nav v-show="!mobile">
            <ul>
                <li>
                    <router-link to="/admin" :class="{ 'active': currentRoute === '/admin' || currentRoute.startsWith('/user/') }">
                        <a href="#">Administration</a>
                    </router-link>
                </li>
                <li>
                    <router-link to="/stats" :class="{ 'active': currentRoute === '/stats' }">
                        <a href="#">Stats</a>
                    </router-link>
                </li>
                <li>
                    <router-link to="/billing" :class="{ 'active': currentRoute === '/billing' }">
                        <a href="#">Billing</a>
                    </router-link>
                </li>
                <li>
                    <router-link to="/profile" :class="{ 'active': currentRoute === '/profile' }">
                        <a href="#">Profile</a>
                    </router-link>
                </li>
            </ul>
        </nav>
        <div class="button-container" v-show="!mobile">
            <button class="button button--transparent">Logout</button>
            <button class="button">Jouer</button>
        </div>

        <div class="icon" v-show="mobile">
            <svg @click="toggleMobileNav" v-show="mobile" :class="{'icon-active': mobileNav}" class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 6h14M7 10h10M5 14h14M9 18h6"></path></svg>
        </div>

        <transition name="mobile-nav">
            <nav v-show="mobileNav" class="dropdown-nav">
                <ul>
                    <li>
                        <router-link to="/admin" :class="{ 'active': currentRoute === '/admin' || currentRoute.startsWith('/user/') }">
                            <a href="#">Administration</a>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/stats" :class="{ 'active': currentRoute === '/stats' }">
                            <a href="#">Stats</a>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/billing" :class="{ 'active': currentRoute === '/billing' }">
                            <a href="#">Billing</a>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/profile" :class="{ 'active': currentRoute === '/profile' }">
                            <a href="#">Profile</a>
                        </router-link>
                    </li>
                </ul>
            </nav>
        </transition>
    </header>
</template>

<script>
  export default {
    name: 'Header',
      data() {
        return {
          currentRoute: '',
          scrollPosition: null,
          mobile: false,
          mobileNav: null,
          windowWidth: null
        };
      },
    created() {
      this.currentRoute = this.$route.path;
      window.addEventListener("resize", this.checkScreen);
      this.checkScreen();
    },
    watch: {
      $route(newRoute) {
        this.currentRoute = newRoute.path;
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
        if(this.windowWidth <= 1000) {
            this.mobile = true;
            return;
        }
        this.mobile = false;
        this.mobileNav = false;
        return;
      }
    }
  }
</script>
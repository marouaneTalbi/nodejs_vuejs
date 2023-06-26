<template>
    <nav class="navbar" v-if="!isMobileMenuOpen">
        <h1>TITLE</h1>
        <ul>
            <li>
              <router-link to="/admin" :class="{ 'active': currentRoute === '/admin' || currentRoute.startsWith('/user/') }">
                <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                  <path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 19v-8.5a1 1 0 0 0-.4-.8l-7-5.25a1 1 0 0 0-1.2 0l-7 5.25a1 1 0 0 0-.4.8V19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1z"></path>
                </svg>
                <a href="#">Administration</a>
              </router-link>
            </li>
            <li>
              <router-link to="/stats" :class="{ 'active': currentRoute === '/stats' }">
                <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 20h18"></path>
                  <rect width="13" height="4" x="6" y="17" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" rx="2" transform="rotate(-90 6 17)"></rect>
                  <rect width="9" height="4" x="14" y="17" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" rx="2" transform="rotate(-90 14 17)"></rect>
                </svg>
                <a href="#">Stats</a>
              </router-link>
            </li>
            <li>
              <router-link to="/billing" :class="{ 'active': currentRoute === '/billing' }">
                <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                  <path fill="currentColor" fill-rule="evenodd" d="M2 7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v1H2V7zm0 3v7a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-7H2zm5 2a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2H7z" clip-rule="evenodd"></path>
                </svg>
                <a href="#">Billing</a>
              </router-link>
            </li>
            <li>
            <router-link to="/profile" :class="{ 'active': currentRoute === '/profile' }">
              <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="5" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle>
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21a8 8 0 1 0-16 0"></path>
                <path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a8 8 0 0 0-8 8h16a8 8 0 0 0-8-8z"></path>
              </svg>
              <a href="#">Profile</a>
            </router-link>
            </li>
        </ul>
    </nav>
    <div class="mobile-menu" v-else>
    <button class="mobile-menu-toggle" @click="toggleMobileMenu">
      <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 6h14M5 10h10M5 14h14M5 18h6"></path>
      </svg>
    </button>
    <ul>
      test
    </ul>
  </div>
    
</template>

<script>
  export default {
    name: 'NavBar',
      data() {
        return {
          currentRoute: '',
          isMobileMenuOpen: false
        };
      },
    created() {
      this.currentRoute = this.$route.path;
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
      toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
      }
    }
  }
</script>



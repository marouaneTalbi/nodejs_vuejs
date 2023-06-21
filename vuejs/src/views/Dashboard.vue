<template>
  <section class="dashboard">
    <Navbar />
  </section>
</template>

<script>
import { fetchAllData } from '../api/api';
import Navbar from '../components/NavBar.vue';

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      users: []
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      fetchAllData('/users')
      .then(response => {
        console.log(response)
      })
      .catch(error => {
      });
    }
  }
};
</script>
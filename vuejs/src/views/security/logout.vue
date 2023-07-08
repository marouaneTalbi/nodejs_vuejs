<template>
  <button @click="logout">Logout</button>
</template>

<script>
import axios from 'axios';
import Cookies from "js-cookie";

export default {
  methods: {
    async logout() {
      try {
        const token = Cookies.get('token');
        await axios.post('http://localhost:3000/logout');
        Cookies.remove('token');
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

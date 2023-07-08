<template>
  <button @click="logout">Logout</button>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    async logout() {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3000/logout', null, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        localStorage.removeItem('token');
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

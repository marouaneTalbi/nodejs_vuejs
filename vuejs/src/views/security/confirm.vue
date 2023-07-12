<template>
    <h2>Your account confirmed</h2>
</template>
<script>
import axios from 'axios';
export default {
  mounted() {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    const token = params.get('token');
    axios.post('http://localhost:3000/confirm', { token : token })
        .then(response => {
          this.$router.push('/login');
        })
        .catch(error => {
          console.error(error);
        });
  },
};
</script>
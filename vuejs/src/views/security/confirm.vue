<template>
    <h2>Your account confirmed</h2>
</template>
<script>
import axios from 'axios';
import { serverURI } from '../../api/api.js';

export default {
  mounted() {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    const token = params.get('token');
    axios.post(`${serverURI}/confirm`, { token : token })
        .then(response => {
          this.$router.push('/login');
        })
        .catch(error => {
          console.error(error);
        });
  },
};
</script>
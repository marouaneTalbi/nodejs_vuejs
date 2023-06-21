<template>
  <div class="">
    Dashboard
  </div>
</template>

<script>
import axios from 'axios';
import { fetchAllData } from '../api/api';

export default {
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
        console.log(response.data)
      })
      .catch(error => {
      });
    }
  }
};
</script>
<template>
  <div class="login-form" :class="{ 'form-error': errorMessage, 'form-shake': animateForm }">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div class="register-link">
      Don't have an account? <router-link to="/register">Register</router-link>
    </div>
  </div>
  <div class="des-container bg-img-container">
  </div>
  <div class="crayon-container bg-img-container">
  </div>
  <div class="dollars-container bg-img-container">
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      animateForm: false
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          mail: this.email,
          password: this.password
        });
        const token = response.data.token;
        this.$router.push('/home');
        console.log(response);
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Invalid credentials';
        this.animateForm = true;
        setTimeout(() => {
          this.animateForm = false;
        }, 1000);
      }
    }
  }
};

import './../../styles/global.css';
import './../../styles/login.css';
</script>

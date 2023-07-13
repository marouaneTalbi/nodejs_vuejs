<template>
  <div class="login-form" :class="{ 'form-error': errorMessage, 'form-shake': animateForm }">
    <Header />
    <form @submit.prevent="login">
      <h2>Login</h2>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>

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
import Cookies from 'js-cookie';
export default {
  components: {
    Header,
  },
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
        Cookies.set('token', token, { secure: true, expires: 7 });
        this.$router.push('/home');
        console.log(response);
      } catch (error) {
        console.error(error);
        if (error.response.status === 401) {
          const errorMessage = error.response.data.message;
          if (errorMessage === 'Utilisateur non confirmé') {
            this.errorMessage = 'Account not confirmed, check your emails';
          }
          else{
            this.errorMessage = 'Invalid credentials';
          }
        }
        else{
          this.errorMessage = 'Invalid credentials';
        }
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
import Header from "@/components/Header.vue";
</script>

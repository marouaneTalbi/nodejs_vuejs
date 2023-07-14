<template>
    <div class="register-form">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
          <div v-if="passwordErrorMessage" class="error-message">{{ passwordErrorMessage }}</div>
        </div>
        <div class="form-group">
          <label for="pseudo">Pseudo:</label>
          <input type="text" id="pseudo" v-model="pseudo" required>
        </div>
        <button type="submit">Register</button>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </form>


      <div class="login-link">
        Already have an account? <router-link to="/login">Login</router-link>
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
        pseudo: '',
        errorMessage: '',
        passwordErrorMessage: ''
      };
    },
    methods: {
      async register() {
        try {
          const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{6,}$/;
          if (!passwordRegex.test(this.password)) {
            this.passwordErrorMessage = 'Le mot de passe doit comporter au moins 6 caractères, une majuscule et un chiffre.';
            return;
          }
          const response = await axios.post('http://localhost:3000/register', {
            mail: this.email,
            password: this.password,
            pseudo: this.pseudo
          });
          const token = response.data.token;
          this.$router.push('/login');
          console.log(response);
        } catch (error) {
          console.log("catch");
          console.error(error);
          this.errorMessage = error.response.data.message;
        }
      }
    }
  };

  import './../../styles/global.css';
  import './../../styles/register.css';

  </script>
  
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
        </div>
        <div class="form-group">
          <label for="pseudo">Pseudo:</label>
          <input type="text" id="pseudo" v-model="pseudo" required>
        </div>
        <button type="submit">Register</button>
      </form>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div class="login-link">
        Already have an account? <router-link to="/login">Login</router-link>
      </div>
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
        errorMessage: ''
      };
    },
    methods: {
      async register() {
        try {
          const response = await axios.post('http://localhost:3000/register', {
            mail: this.email,
            password: this.password,
            pseudo: this.pseudo
          });
          const token = response.data.token;
          // Rediriger vers une autre page après l'enregistrement
          this.$router.push('/login');
          console.log(response);
        } catch (error) {
          console.error(error);
          this.errorMessage = error.response.data.message;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .register-form {
    max-width: 300px;
    margin: 0 auto;
    border: 1px solid rgb(190, 183, 183);
    padding: 30px;
    border-radius: 40px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input[type="email"],
  input[type="password"],
  input[type="text"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
  
  .login-link {
    margin-top: 20px;
    text-align: center;
  }
  
  .login-link a {
    color: #4CAF50;
    text-decoration: underline;
    cursor: pointer;
  }
  </style>
  
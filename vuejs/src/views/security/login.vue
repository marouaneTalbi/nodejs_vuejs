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
</script>

<style scoped>
.login-form {
  margin: 0 auto;
  padding: 30px;
  background: rgba(255, 255, 255, 0.16);
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 45%;
}

.login-form > form{
  width: 50%;
  margin: auto;
}

.login-form > h2{
  font-style: normal;
  font-weight: 800;
  font-size: 40px;
  line-height: 87px;
  color: white;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #BEBEBF;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #6E57D0;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.form-error {
  border-color: red;
}

.form-shake {
  animation: formShake 0.3s;
}

@keyframes formShake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-10px);
  }
  40% {
    transform: translateX(10px);
  }
  60% {
    transform: translateX(-10px);
  }
  80% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(0);
  }
}

.register-link {
  margin-top: 20px;
  text-align: center;
  color: #BEBEBF;
}

.register-link a {
  color: #6E57D0;
  text-decoration: underline;
  cursor: pointer;
}
</style>

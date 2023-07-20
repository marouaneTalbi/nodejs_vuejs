<template>
  <div class="login-form" :class="{ 'form-error': errorMessage, 'form-shake': animateForm }">
    <Header />
    <form @submit.prevent="initPassword">
      <h2>Init your Password</h2>
      <div class="form-group">
        <label for="email">New Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="email">Confirm New Password</label>
        <input type="password" id="password2" v-model="password2" required>
      </div>
      <button type="submit">Submit</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import {postData, serverURI} from '../../api/api';
import './../../styles/global.css';
import './../../styles/login.css';
import Header from "@/components/Header.vue";

export default {
  components: {
    Header,
  },
  data() {
    return {
      password: '',
      password2: '',
      errorMessage: '',
      animateForm: false
    };
  },
  methods: {
    async initPassword() {
      if (this.password !== this.password2) {
        this.errorMessage = 'Passwords does not match';
        return;
      }
      const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{6,}$/;
      if (!passwordRegex.test(this.password)) {
        this.errorMessage = 'Invalid password. It must contain at least 6 characters, one uppercase letter, and one digit.';
        return;
      }
      try {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const params = new URLSearchParams(url.search);
        const token = params.get('token');
        postData('/initPassword', {password: this.password, token: token});
        this.$router.push('/login');
      } catch (error) {
        this.errorMessage = 'Error, retry later';
        this.animateForm = true;
        setTimeout(() => {
          this.animateForm = false;
        }, 1000);
      }
    }
  }
};
</script>
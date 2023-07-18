<template>
  <div class="login-form" :class="{ 'form-error': errorMessage, 'form-shake': animateForm }">
    <Header />
    <form @submit.prevent="forgotPassword">
      <h2>Your Email</h2>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <button type="submit">Submit</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="resetEmailSent" class="success-message">If you have an Account with this email, you will receive an email to reset your password.</div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { serverURI, postData } from '../../api/api';
import './../../styles/global.css';
import './../../styles/login.css';
import Header from "@/components/Header.vue";

export default {
  components: {
    Header,
  },
  data() {
    return {
      email: '',
      errorMessage: '',
      animateForm: false,
      resetEmailSent: false
    };
  },
  methods: {
    async forgotPassword() {
      try {
        postData('/forgotPassword', {mail:this.email});
        this.resetEmailSent = true;
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Error, Retry Later';
        this.animateForm = true;
        setTimeout(() => {
          this.animateForm = false;
        }, 1000);
      }
    }
  }
};
</script>
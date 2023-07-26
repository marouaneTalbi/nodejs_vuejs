<template>
  <section class="auth">
    <div class="login-form" :class="{ 'form-error': errorMessage, 'form-shake': animateForm }">
    <form @submit.prevent="login">
      <h2>Login</h2>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label class="label">Password</label>
        <input v-if="showPassword" type="text" class="input" id="password" v-model="password" required />
        <input v-else type="password" class="input" id="password" v-model="password" required>
        <span class="icon is-small is-right" type="button" @click="toggleShow">
          <font-awesome-icon :icon="showPassword ? 'eye' : 'eye-slash'" />
        </span>
        <!-- <div class="password-div">
          <div class="control is-expanded" >
            <input v-if="showPassword" type="text" class="input" style="width: 150%"  id="password" v-model="password" required />
            <input v-else type="password" class="input" style="width: 150%" id="password" v-model="password" required>
          </div>
          <div class="control">
            <span class="button" type="button" @click="toggleShow">
              <span class="icon is-small is-right">
                <font-awesome-icon :icon="showPassword ? 'eye' : 'eye-slash'" />
              </span>
            </span>
          </div>
        </div> -->
      </div>
      <button type="submit">Login</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>

    <div class="register-link">
      Don't have an account? <router-link to="/register">Register</router-link><br>
      <router-link to="/forgot-password">Forgot Password ?</router-link>
    </div>
  </div>
  </section>
  <!-- <div class="des-container bg-img-container"></div>
  <div class="crayon-container bg-img-container"></div>
  <div class="dollars-container bg-img-container"></div> -->
</template>

<script>
import Cookies from 'js-cookie';
import {postData, serverURI} from '../../api/api';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faEye, faEyeSlash);
export default {
  components: {
    Header,
    FontAwesomeIcon
  },
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      errorMessage: '',
      animateForm: false
    };
  },
  computed: {
    buttonLabel() {
      return (this.showPassword) ? "Hide" : "Show";
    }
  },
  methods: {
    async login() {
      try {
        const response = await postData('/login', {mail: this.email, password: this.password});
        const token = response.data.token;
        Cookies.set('token', token, { secure: true, expires: 7 });
        this.$router.push('/gamemode');
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
    },
    toggleShow() {
      this.showPassword = !this.showPassword;
    }
  }
};

import './../../styles/global.css';
import './../../styles/login.css';
import Header from "@/components/Header.vue";
</script>
<style>
.eye-icon {
  position: relative;
  top: -30px;
  left: -28px;
  cursor: pointer;
}
/* .password-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.password-div .control {
  margin-right: 10px;
} */
.password-div .icon {
  display: flex;
  align-items: center;
}
.password-div .icon.is-small.is-right {
  color: grey;
  cursor: pointer;
}
.password-div .icon.is-small.is-right.eye-slash {
  color: black;
  cursor: pointer;
}
</style>
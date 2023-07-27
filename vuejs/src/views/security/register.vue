<template>
  <section class="auth">
    <div class="login-form">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label class="label">Password</label>
          <input v-if="showPassword" type="text" class="input" id="password" v-model="password" required />
          <input v-else type="password" class="input"  id="password" v-model="password" required>
          <span class="icon is-small is-right" type="button" @click="toggleShow">
            <font-awesome-icon :icon="showPassword ? 'eye' : 'eye-slash'" />
          </span>
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input v-if="showPassword2" type="text" class="input"  id="password2" v-model="password2" required />
          <input v-else type="password" class="input" id="password2" v-model="password2" required>
          <span class="icon is-small is-right" type="button" @click="toggleShow2">
            <font-awesome-icon :icon="showPassword2 ? 'eye' : 'eye-slash'" />
          </span>
        </div>
        <div v-if="passwordErrorMessage" class="error-message">{{ passwordErrorMessage }}</div>

        <div class="form-group" style="margin-top: -10px">
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
  </section>
    <!-- <div class="des-container bg-img-container">
    </div>
  <div class="crayon-container bg-img-container">
  </div>
  <div class="dollars-container bg-img-container">
  </div> -->
  </template>
  
  <script>
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
        password2: '',
        pseudo: '',
        showPassword: false,
        showPassword2 : false,
        errorMessage: '',
        passwordErrorMessage: ''
      };
    },
    computed: {
      buttonLabel() {
        return (this.showPassword) ? "Hide" : "Show";
      },
      buttonLabel2() {
        return (this.showPassword2) ? "Hide" : "Show";
      }
    },
    methods: {
      async register() {
        try {
          const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{6,}$/;
          if (!passwordRegex.test(this.password)) {
            this.passwordErrorMessage = 'Le mot de passe doit comporter au moins 6 caractères, une majuscule et un chiffre.';
            return;
          }
          if (this.password !== this.password2) {
            this.passwordErrorMessage = 'Les mots de passe ne correspondent pas.';
            return;
          }
          const response = await postData('/register', {mail: this.email, password: this.password, pseudo: this.pseudo});
          const token = response.data.token;
          this.$router.push('/login');
        } catch (error) {
          console.error(error);
          this.errorMessage = error.response.data.message;
        }
      },
      toggleShow() {
        this.showPassword = !this.showPassword;
      },
      toggleShow2() {
        this.showPassword2 = !this.showPassword2;
      }
    }
  };

  import './../../styles/global.css';
  import './../../styles/register.css';
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
input{
  color: white;
}
</style>
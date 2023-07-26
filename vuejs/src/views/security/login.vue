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
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <button type="submit">Login</button>
      </form>

      <div v-if="showsendMail" style="margin-right: auto; margin-left:auto;width:50%;margin-top: 30px">
        <div class="form-group">
          <p @click="resendMail">Renvoyer l'Email de confirmation</p>
            <div v-if="errorMessageMail" class="error-message">{{ errorMessageMail }}</div>
        </div>
      </div>

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
      email2: '',
      password: '',
      showPassword: false,
      errorMessage: '',
      errorMessageMail:'',
      showsendMail:false,
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
            this.showsendMail=true;
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
    async resendMail(){
      try {
        postData('/resend-confirmation-email',{ email: this.email } )
            .then(response => {
              toast('Le mail est renvoyer', {
                autoClose: 2000,
                type: 'success'
              })
            })
            .catch(error => {
              if (error.response.status === 400) {
              const errorMessage = error.response.data.message;
              if (errorMessage === 'Votre compte est déja confirmé') {
                this.errorMessageMail = 'Votre compte est déja confirmé';
              }
              else{
                this.errorMessageMail = 'cette adresse email est pas encore inscrit';
              }
            }else {
              this.errorMessageMail = 'Réssayer plus tard';
            }
            });
      }catch (error){
        console.error(error);
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
import {toast} from "vue3-toastify";
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
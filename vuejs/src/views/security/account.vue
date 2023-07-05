<template>
  <div class="account">
    <h2>My Account</h2>
    <div class="user-info" v-if="user">
      <p><strong>Pseudo :</strong> {{ user.pseudo }}</p>
      <p><strong>Email:</strong> {{ user.mail }}</p>
      <p><strong>Created At:</strong> {{ user.createdAt }}</p>
      <p><strong>Role :</strong> {{ user.role }}</p>
      <img :src="getUserImageUrl(user.picture)" alt="User Image">

      <!-- Formulaire de modification des informations générales -->
      <h2>Update Informations</h2>
      <form @submit.prevent="updateUserInfo">
        <label>Nom d'utilisateur:</label>
        <input type="text" v-model="updatedUser.pseudo">
        <label>Email:</label>
        <input type="email" v-model="updatedUser.mail">
        <button type="submit" @click="handleUpdateClick">Mettre à jour</button>
      </form>

      <!-- Formulaire de validation d'adresse e-mail -->
      <form v-if="showEmailVerification" @submit.prevent="verifyEmail">
        <h2>Email Verification</h2>
        <p>Entrez le code de validation d'adresse e-mail :</p>
        <input type="text" v-model="emailVerificationCode">
        <button type="submit">Valider</button>
      </form>
    </div>
  </div>
</template>


<style>
.account{
  background-color: white;
  padding : 30px;
  border-radius: 30px;
}
</style>
<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      user: null,
      updatedUser: {
        pseudo: '',
        mail: ''
      },
      showEmailVerification: false,
      emailVerificationCode: ''
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      try {
        const token = Cookies.get('token');
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;
        const response = await axios.get(`http://localhost:3000/user/${userId}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        this.user = response.data;
        console.log(this.user);
      } catch (error) {
        console.error(error);
      }
    },
    getUserImageUrl(picture) {
      const serverUrl = 'http://localhost:3000';
      return `${serverUrl}/pictures/${picture}`;
    },
    async updateUserInfo() {
      try {
        const token = Cookies.get('token');
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;
        const response = await axios.put(`http://localhost:3000/user/${userId}`, this.updatedUser, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        this.user = response.data;
        console.log('Informations utilisateur mises à jour:', this.user);
        // Réinitialiser les champs de formulaire
        this.updatedUser.pseudo = '';
        this.updatedUser.mail = '';
      } catch (error) {
        console.error(error);
      }
    },
    async verifyEmail(){
      try {
        const token = Cookies.get('token');
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;
      const response = await axios.put(`http://localhost:3000/user/${userId}/verify-email`, {code: this.emailVerificationCode}, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      this.user = response.data;
    }catch (error) {
      console.error(error);
    }
    },
    handleUpdateClick() {
      if (this.updatedUser.mail && this.updatedUser.mail !== this.user.mail) {
        this.showEmailVerification = true;
      } else {
        this.updateUserInfo();
      }
    }
  }
};
</script>

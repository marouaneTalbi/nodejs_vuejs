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
        <p>{{ verificationMessage }}</p>
        <button type="submit">Valider</button>
      </form>

      <!-- Formulaire de modification du mot de passe -->
      <form @submit.prevent="changePassword">
        <h2>Change Password</h2>
        <label>Ancien mot de passe:</label>
        <input type="password" v-model="passwordData.oldPassword">
        <label>Nouveau mot de passe:</label>
        <input type="password" v-model="passwordData.newPassword">
        <label>Confirmer le nouveau mot de passe:</label>
        <input type="password" v-model="passwordData.confirmPassword">
        <button type="submit">Changer le mot de passe</button>
        <p v-if="passwordChangeMessage" :class="{ 'success-message': !passwordChangeError, 'error-message': passwordChangeError }">{{ passwordChangeMessage }}</p>
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
      emailVerificationCode: '',
      verificationMessage: '',
      passwordData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordChangeMessage: '',
      passwordChangeError: false
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
        if (response.status === 200) {
          this.verificationMessage = 'Code de validation correct';
          this.showEmailVerification = false;
        } else if (response.status === 400) {
          this.verificationMessage = response.data.message || 'Code de validation incorrect';
        }
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
    },
    async changePassword() {
      try {
        const token = Cookies.get('token');
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;
        if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
          console.error('Les nouveaux mots de passe ne correspondent pas');
          return;
        }
        const response = await axios.put(`http://localhost:3000/user/${userId}/change-password`, {
          oldPassword: this.passwordData.oldPassword,
          newPassword: this.passwordData.newPassword
        }, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        this.passwordData.oldPassword = '';
        this.passwordData.newPassword = '';
        this.passwordData.confirmPassword = '';
        this.passwordChangeMessage = 'Mot de passe modifié avec succès';
        this.passwordChangeError = false;
      } catch (error) {
        console.error(error);
        this.passwordChangeMessage = 'Une erreur s\'est produite lors de la modification du mot de passe';
        this.passwordChangeError = true;
      }
    }
  }
};
</script>



<style scoped>
.account {
  margin: 20px;
}

.user-info {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}
</style>



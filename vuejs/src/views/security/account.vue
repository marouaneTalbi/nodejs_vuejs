<template>
  <section class="user">
    <Header />
    <div class="container">
      <div class="block" v-if="user">
        <div class="user-profile">
          <div class="img"></div>
          <div class="text">
            <span class="pseudo">{{ user.pseudo }}</span>
            <span>Online</span>
          </div>
        </div>
        <div class="card">
          <div class="row">
            <div class="text">
              <span class="pseudo-title">Pseudo</span>
              <br />
              <span class="pseudo">{{ user.pseudo }}</span>
            </div>
          </div>
          <div class="row">
            <div class="text">
              <span class="pseudo-title">Email</span>
              <br />
              <span class="pseudo">{{ user.mail }}</span>
            </div>
          </div>
          <div class="row">
            <div class="text">
              <span class="pseudo-title">Creation date</span>
              <br />
              <span class="pseudo">{{ user.createdat }}</span>
            </div>
          </div>
          <div class="row">
            <div class="text">
              <span class="pseudo-title">Role</span>
              <br />
              <span class="pseudo">{{ user.role }}</span>
            </div>
          </div>
          <div class="row">
            <div class="text">
            </div>
          </div>
        </div>

        <div class="card card--footer">
          <div class="row">
            <div class="text">
              <h2 class="pseudo-title" >Update Informations</h2>
              <form @submit.prevent="updateUserInfo">
                <label>Nom d'utilisateur:</label>
                <input type="text" v-model="updatedUser.pseudo">
                <label>Email:</label>
                <input type="email" v-model="updatedUser.mail">
                <button type="submit" @click="handleUpdateClick" class="maj">Mettre à jour</button>
                <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
                <p v-if="infoChangeMessage" :class="{ 'success-message': !infoChangeError, 'error-message': infoChangeError }">{{ infoChangeMessage }}</p>
              </form>
              <form v-if="showEmailVerification" @submit.prevent="verifyEmail">
                <h2 class="pseudo-title">Email Verification</h2>
                <p>Entrez le code de validation d'adresse e-mail :</p>
                <input type="text" v-model="emailVerificationcode">
                <p>{{ verificationMessage }}</p>
                <button type="submit">Valider</button>
              </form>
            </div>
          </div>
        </div>

        <div class="card card--footer">
          <div class="row">
            <div class="text">
              <form @submit.prevent="changePassword">
                <h2 class="pseudo-title">Change Password</h2>
                <label>Ancien mot de passe:</label>
                <input type="password" v-model="passwordData.oldPassword">
                <label>Nouveau mot de passe:</label>
                <input type="password" v-model="passwordData.newPassword">
                <label>Confirmer le nouveau mot de passe:</label>
                <input type="password" v-model="passwordData.confirmPassword">
                <button type="submit" class="maj">Changer le mot de passe</button>
                <p v-if="passwordChangeMessage" :class="{ 'success-message': !passwordChangeError, 'error-message': passwordChangeError }">{{ passwordChangeMessage }}</p>
              </form>
            </div>
          </div>
        </div>

        <button>
          Supprimer mon compte
        </button>
      </div>
    </div>
  </section>
</template>


<style scoped>
.maj{
  background-color: green !important;
  margin-top: 10px !important;
 }

.card {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  width: 45%;
}

.card-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.card-image img {
  max-width: 100%;
  max-height: 100%;
}

.card-content {
  text-align: center;
}
</style>
<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import Header from '../../components/Header.vue';

export default {
  components: {
    Header,
  },
  data() {
    return {
      user: null,
      updatedUser: {
        pseudo: '',
        mail: ''
      },
      showEmailVerification: false,
      emailVerificationcode: '',
      verificationMessage: '',
      passwordData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordChangeMessage: '',
      passwordChangeError: false,
      infoChangeMessage: '',
      infoChangeError: false
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
        const response = await axios.get(`http://localhost:3000/user/${userId}/postgres`, {
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
        const response = await axios.put(`http://localhost:3000/user/${userId}/updateuser`, this.updatedUser, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        this.user = response.data;
        console.log('Informations utilisateur mises à jour:', this.user);
        this.infoChangeMessage = 'Informations modifié avec succès';
        this.infoChangeError = false;
        // Réinitialiser les champs de formulaire
        this.updatedUser.pseudo = '';
        this.updatedUser.mail = '';
      } catch (error) {
        console.error(error);
        this.infoChangeMessage = 'Une erreur s\'est produite lors de la modification des informations';
        this.infoChangeError = true;
      }
    },
    async verifyEmail(){
      try {
        const token = Cookies.get('token');
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;
      const response = await axios.put(`http://localhost:3000/user/${userId}/verify-email`, {code: this.emailVerificationcode}, {
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




<template>
  <section class="user">
    <Header />
    <div class="container">
      <div class="block" v-if="user">
        <div class="user-profile" >
          <div class="image" @click="openPopUpModal('photo')" 
            @mouseover="showOverlay"
            @mouseleave="hideOverlay">
            <div v-if="showOverlay" class="overlay">CHANGER</div>
              <div style="height: 100%; width: 100%;background-size: contain;">
                <img v-if="!user.picture || user.picture === 'picture.png'" 
                  style="
                  height: 100%;
                  width: 100%;
                  border-radius: 100px;
                  object-fit: cover;"
                  :src="getPictureUrl('user.png')"
                  alt="">
                <img v-if="user.picture && user.picture !== 'picture.png'"
                  style="height: 100%;
                  width: 100%;
                  border-radius: 100px;
                  object-fit: cover;"
                  :src="getPictureUrl(user.picture)"
                alt="">
            </div>
            <img class="grade" :src="getGradeUrl(grade.picture)" />
          </div>
          <div class="text">
            <span class="pseudo">{{ user.pseudo }}</span>
            <br />
            <strong class="gradeTitle">{{ grade.title }}<span> | {{ user.points }}</span></strong>
          </div>       
        </div>
        <div class="card">
          <div class="row">
            <div class="text">
              <span class="pseudo-title">Pseudo</span>
              <br />
              <span class="pseudo">{{ user.pseudo }}</span>
            </div>
            <button @click="openModal('editPseudo')">Edit</button>
          </div>
          <div class="row">
            <div class="text">
              <span class="pseudo-title">Email</span>
              <br />
              <span class="pseudo">{{ user.mail }}</span>
            </div>
            <button @click="openModal('editEmail')">Edit</button>
          </div>
          <div class="row">
            <div class="text">
              <span class="pseudo-title">Creation date</span>
              <br />
              <span class="pseudo">{{ formatDate(user.createdat) }}</span>
            </div>
          </div>

          <div class="row" v-if="skin && skin.title != undefined">
            <div class="text">
                <span class="pseudo-title">Skin</span>
                <br />
                <span class="pseudo">{{ skin?.title }}</span>
            </div>
            <button @click="openPopUpModal('skins')">Edit</button>
          </div>

          <div class="row">
            <div class="text">
              <span class="pseudo-title">Coins</span>
              <br />
              <span class="pseudo">{{ user.coins }}</span>
            </div>
          </div>
          <div>
            <button style="background-color: green" @click="openModal('editPassword')">Update Password</button>
          </div>
    
        </div>
      </div>
    </div>

    <Popup @close="paymentToggleModal" :popupActive="paymentModalActive" >
      <div class="popupButtons">
            <div v-if="popUpImage" style="display: flex; justify-content: center; flex-direction: column; align-items: center; padding: 10px;">
              <form @submit.prevent="handleConfirm" style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
                <img 
                    v-if="user.picture && user.picture !== 'picture.png'"
                    :src="getPictureUrl(user.picture)"
                    alt="" 
                    style="height: 200px; width: 200px; object-fit: contain;">
                  <img 
                    v-if="!user.picture || user.picture === 'picture.png'"
                    :src="'../../../public/img/user.png'" 
                    alt="" 
                    style="height: 200px; width: 200px; object-fit: contain;">
                  <input type="file" style="color:white" id="picture" @change="handlePictureChange" placeholder="Photo" required>
              </form>
              <button class="buy-button" @click="changePhoto()" style="margin-top: 2%;">changer</button>
            </div>
            <div v-if="popUpSkins ">
              <div class="modal-content">
                <div class="card-list-skin">
                    <div v-for="skin in skins" :key="skin.id" class="card-skin">
                        <div class="card-image-skin">
                            <img :src="getPictureUrl(skin.picture)" alt="" style=" object-fit: contain;">
                        </div>
                        <div class="card-content-skin">
                        <h3>{{ skin.title }}</h3>
                        <button @click="assignSkin(skin)">choisir</button>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
    </Popup>
    <Modal @close="toggleModal" @confirm="handleUpdateClick" :modalActive="modalActive" :showConfirmButton="true">
      <div class="modal-content" v-if="currentModal === 'editEmail'">
            <h2 class="pseudo-title" >Update Informations</h2>
            <form @submit.prevent="updateUserInfo">
              <label>Email:</label>
              <input type="email" v-model="updatedUser.mail">
              <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
              <p v-if="infoChangeMessage" :class="{ 'success-message': !infoChangeError, 'error-message': infoChangeError }">{{ infoChangeMessage }}</p>
            </form>
            <form v-if="showEmailVerification" @submit.prevent="verifyEmail">
              <h2 class="pseudo-title">Email Verification</h2>
              <p>Entrez le code de validation d'adresse e-mail :</p>
              <input type="text" v-model="emailVerificationcode">
              <p>{{ verificationMessage }}</p>
              <button type="submit" class="maj">Valider</button>
            </form>
        </div>
        <div class="modal-content" v-else-if="currentModal === 'editPseudo'">
         <h2 class="pseudo-title" >Update Informations</h2>
         <form @submit.prevent="updateUserInfo">
          <label>Nom d'utilisateur:</label>
          <input type="text" v-model="user.pseudo">
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <p v-if="infoChangeMessage" :class="{ 'success-message': !infoChangeError, 'error-message': infoChangeError }">{{ infoChangeMessage }}</p>
         </form>
        </div>
        <div class="modal-content" v-else-if="currentModal === 'editPassword'">
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
    </Modal>
  </section>
</template>


<style scoped>
.image { position: relative }
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 100px;
    background-color: rgba(0, 0, 0, 0.7);
    color: wheat;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
    border-radius: 100px;
}

.image:hover .overlay {
    opacity: 1;
    pointer-events: auto;
    cursor: pointer;
}

.overlay svg {
    color: white;
    height: 70px;
    width: 70px;
}
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

.gradeTitle {
  font-weight: 700;
  font-size: 1rem;
  color: #A0AEC0;
}
.card-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}
.image{
  width: 160px ;
  height: 160px ;
  border-radius: 100px;
  background-size: cover;
  background-color: red;
  display: flex;
  justify-content: center;
}
.card-image img {
  max-width: 100%;
  max-height: 100%;
}


.card-list-skin {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card-skin {
  background-color: #f0f0f05c;
  border-radius: 8px;
  padding: 4px;
  /* width: 20%; */
  margin: 10px;
}

.card-image-skin {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.card-image-skin img {
  max-width: 150px;
  max-height: 100%;
}

.card-content-skin {
  text-align: center;
}

.grade {
  position: absolute;
  width: 60px;
  height: 60px;
  bottom: 0;
  right: 0;
}
</style>

<script>
import { ref } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import Header from '../../components/Header.vue';
import Modal from "@/components/Modal.vue";
import {fetchData, postData, serverURI, patchData, putData} from '../../api/api';
import Popup from '../../components/Popup.vue';
import { toast } from 'vue3-toastify';
import { reactive } from "vue";
import { getCurrentUser } from '../../services/userService.js'


export default {
  components: {
    Header,
    Modal,
    Popup,
  },
  setup() {
    const modalActive = ref(false);
    const pseudo = ref('');
    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    }
    const state = reactive({
      showOverlay: false,
    });
    const showOverlay = () => {
      state.showOverlay = true;
    };
    const hideOverlay = () => {
      state.showOverlay = false;
    };
    const paymentModalActive = ref(false);
    const paymentToggleModal = () => {
      paymentModalActive.value = !paymentModalActive.value;
    };
    return { 
      paymentModalActive,
      paymentToggleModal,
      currentPaymentModal: null,
      showOverlay,
      hideOverlay, state ,
      modalActive, toggleModal, currentModal: null, pseudo
      
    };
    },
  data() {
    return {
      grade: {},
      user: null,
      updatedUser: {
        pseudo: '',
        mail: ''
      },
      showEmailVerification: false,
      popUpImage : false,
      popUpSkins: false,
      emailVerificationcode: '',
      verificationMessage: '',
      picture:'',
      passwordData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordChangeMessage: '',
      passwordChangeError: false,
      infoChangeMessage: '',
      infoChangeError: false,
      skin: {},
      skins:[]
    };
  },

  mounted() {
    this.getUserInfo();
    this.getUserSkins();
    this.getUserSkin();
    this.getUserGrade();
  },
  methods: {
    getUserGrade() {
      const userId = this.currentUserId()
      fetchData('/user/' + userId + '/grade')
      .then(response => {
        this.grade = response.data['grade']
      })
      .catch(error => {
        toast(error.message, {
          autoClose: 2000,
          type: 'error',
        })
      });
    },
    currentUserId(){
      const token = Cookies.get('token');
      const [header, payload, signature] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      const userId = decodedPayload.id;
      return userId;
    },
     getUserSkins() {
      const userId = this.currentUserId()
      fetchData('/user/skins/' + userId)
      .then(response => {
        this.skins = response.data
      })
      .catch(error => {
        toast(error.message, {
          autoClose: 2000,
          type: 'error',
        })
      });
    },
    assignUserSkin(data) {
      postData('/skin/assign', data)
      .then(response => {
        this.skin = response.data.skin
          toast('Skin vous a bien été affecter', {
              autoClose: 2000,
              type: 'success'
          })
      })
      .catch(error => {
          toast(error.message, {
              autoClose: 2000,
              type: 'error',
          })
      });
      this.closePoPupModal() 
    },
    assignSkin(skin){
      const newSkin = {
          userId: this.user.id,
          skinId: skin.id,
      };
      this.assignUserSkin(newSkin, this.user.id)
    },
    getUserSkin(){
      const userId = this.currentUserId()
        fetchData('/user/skin/' + userId)
        .then(response => {
            this.closeModal()
            this.skin = response.data
        })
    },
    //////
    getPictureUrl(picture) {
      return `${serverURI}/pictures/skins/${picture}`;
    },
    getGradeUrl(picture) {
      return `${serverURI}/pictures/grades/${picture}`;
    },
    openPopUpModal(type){
      if(type == 'photo') {
        this.popUpImage = true
        this.popUpSkins = false
      } else {
        this.getUserSkins()
        this.popUpSkins = true
        this.popUpImage = false
      }

      this.paymentModalActive = true;
    },
    closePoPupModal() {
      this.paymentModalActive = false;
    },
    updateUserImage(userId, data){
      patchData('/user/'+userId+'/pic', data)
      .then(response => {
          toast('La photo a bien été modifié', {
              autoClose: 2000,
              type: 'success'
          })
          this.user.picture = response.data.picture 
      })
      .catch(error => {
          toast(error.message, {
              autoClose: 2000,
              type: 'error',
          })
      })
    },
    changePhoto(picture){
      const updatedPicture = {picture: this.picture};
      this.updateUserImage(this.user.id, updatedPicture)
    },
    handlePictureChange(event) {
      const selectedFile = event.target.files[0];
      this.base64func(selectedFile).then((f) => {
          this.picture = f
      })
    },
    base64func (blob) {
      return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onerror = reject
          reader.onload = () => {
          resolve(reader.result)
          }
          reader.readAsDataURL(blob)
      })
    },
    async getUserInfo() {
      try {
        const token = Cookies.get('token');
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;
        const response = await axios.get(`${serverURI}/user/${userId}/postgres`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        this.user = response.data;
        return this.user
      } catch (error) {
        console.error(error);
      }
    },
    getUserImageUrl(picture) {
      return `${serverURI}/pictures/${picture}`;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    async updateUserInfo() { 
      try {
        const token = Cookies.get('token');
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;

        const response = await axios.put(`${serverURI}/user/${userId}/updateuser`, this.user, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        this.user = response.data;
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
        const response = await axios.put(`${serverURI}/user/${userId}/verify-email`, {code: this.emailVerificationcode}, {
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
      } catch (error) {
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
        const response = await axios.put(`${serverURI}/user/${userId}/change-password`, {
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
    },
    openModal(type) {
        this.modalActive = true;
        this.currentModal = type;
    },
    handleConfirm() {
      this.closeModal();
    },
    closeModal() {
      this.modalActive = false;
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


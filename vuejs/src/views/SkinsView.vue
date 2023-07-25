<template>
  <section class="skins">
    <Header />

    <Modal @close="toggleModal" @confirm="handleConfirm" :modalActive="modalActive" :showConfirmButton="false">
      <div class="modal-content">
        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13V5a2 2 0 0 0-2-2h-2m0 0H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7M13 3v10.5M9 7v3"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 22v-7.1a7 7 0 0 0-2.052-4.95L16.998 8v6.587c0 .89-1.077 1.337-1.707.707L13.996 14c-.5-.5-1.701-.8-2.502 0-.8.8-.5 2 0 2.5l5.503 5.5"></path></svg>
        <h2>Paiement</h2>
        <button class="buy-button" @click="buySkin()">Payer par carte</button>
        <button class="buy-button buy-button--coins" @click="buyByCoins()">Payer avec Les Coins</button>
      </div>
    </Modal>

    <div class="header">
      <h4>Skins</h4>
      <div class="filter">
        <p>Filtre</p>
        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-width="2" d="M18 4H6c-1.105 0-2.026.91-1.753 1.98a8.018 8.018 0 0 0 4.298 5.238c.823.394 1.455 1.168 1.455 2.08v6.084a1 1 0 0 0 1.447.894l2-1a1 1 0 0 0 .553-.894v-5.084c0-.912.632-1.686 1.454-2.08a8.017 8.017 0 0 0 4.3-5.238C20.025 4.91 19.103 4 18 4z"></path></svg>
      </div>
      <!-- <button @click="openModal('createSkin')" style="height: 30px; width: 100px; text-align: center;">Creer</button> -->
    </div>
    <div class="container">
      <ul>
        <li v-for="skin in skins" :key="skin._id">
          <div class="card" @mouseover="showOverlay" @mouseleave="hideOverlay" @click="openModal(skin)">
            <h4>{{ skin.title }}</h4>
          <img :src="getPictureUrl(skin.picture)" alt="" style="height: 100px; width: 100px; object-fit: contain;">
          <div class="money">
            <p>{{ skin.price }}{{ skin.money_type }}</p>
          </div>
          <div class="coins">
            <p>{{ skin.coins_price }}</p>
            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 8c0-1.657-3.134-3-7-3S7 6.343 7 8m14 0v4c0 1.02-1.186 1.92-3 2.462-1.134.34-2.513.538-4 .538s-2.866-.199-4-.538C8.187 13.92 7 13.02 7 12V8m14 0c0 1.02-1.186 1.92-3 2.462-1.134.34-2.513.538-4 .538s-2.866-.199-4-.538C8.187 9.92 7 9.02 7 8"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12v4c0 1.02 1.187 1.92 3 2.462 1.134.34 2.513.538 4 .538s2.866-.199 4-.538c1.813-.542 3-1.442 3-2.462v-1M3 12c0-1.197 1.635-2.23 4-2.711M3 12c0 1.02 1.187 1.92 3 2.462 1.134.34 2.513.538 4 .538.695 0 1.366-.043 2-.124"></path></svg>
          </div>
          <div v-if="showOverlay" class="overlay">
            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13V5a2 2 0 0 0-2-2h-2m0 0H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7M13 3v10.5M9 7v3"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 22v-7.1a7 7 0 0 0-2.052-4.95L16.998 8v6.587c0 .89-1.077 1.337-1.707.707L13.996 14c-.5-.5-1.701-.8-2.502 0-.8.8-.5 2 0 2.5l5.503 5.5"></path></svg>
          </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>  

<script>
import { fetchData, postData, serverURI, patchData } from '../api/api';
import Header from '../components/Header.vue';
import Modal from '../components/Modal.vue';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { reactive } from "vue";
import { loadStripe } from '@stripe/stripe-js';
import Cookies from 'js-cookie';

export default {
  components: {
    Header,
    Modal,
    loadStripe
  },
  setup() {
    // MODAL
    const modalActive = ref(false);
    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    }

    // PAYMENT
    const isValidPrice = ref(true);
    const paymentModalActive = ref(false);
    const paymentToggleModal = () => {
      paymentModalActive.value = !paymentModalActive.value;
    };

    // OVERLAY
    const state = reactive({
      showOverlay: false,
    });
    const showOverlay = () => {
      state.showOverlay = true;
    };
    const hideOverlay = () => {
      state.showOverlay = false;
    };

    return { modalActive, toggleModal, currentModal: null, isValidPrice, showOverlay, hideOverlay, state, paymentToggleModal}
  },
  data() {
    return {
      skins: [],
      title: '',
      price: '',
      money_type: '',
      coins_price: '',
      picture: null,
      image: null,
      base64: null
    };
  },
  mounted() {
   this.getSkins();
  },
  methods: {
    getPictureUrl(picture) {
      return `${serverURI}${picture}`;
    },

    async buySkin() {
      const token = Cookies.get('token');
      const [header, payload, signature] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      const userId = decodedPayload.id;

      const stripePromise = loadStripe('pk_test_51IM8ZrEwRtoFpDAHs6Iu7d92N4DPiPWs4MjYP3BhnlNyf0Lz3itqGdpugMYLXIMyHZeQvxNyH4FCEAAtoJv9b7V600AGKAwSrE');
      const stripe = await stripePromise;
      const response = await postData('/skin/pay', {skin: this.skin})
      const sessionId = response.data.sessionId;

      if(sessionId) {
         postData('/skin/purchase', {userId:userId, skinId:this.skin.id})
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if(error) {
        toast(error.message, {
          autoClose: 2000,
          type: 'error'
        });
      } 
    },
    async buyByCoins(){
      const token = Cookies.get('token');
      const [header, payload, signature] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      const userId = decodedPayload.id;

      const currentUser = await fetchData('/user/'+userId)

      console.log(currentUser.data.coins , this.skin.coins_price)

      if(currentUser.data.coins >= this.skin.coins_price){
        const newCoinsValue = currentUser.data.coins - this.skin.coins_price

        patchData('/user/' + userId, {coins : newCoinsValue})
        .then( response => {
          postData('/skin/purchase', {userId:userId, skinId:this.skin.id})
          toast('Le Skin a bien été acheté', {
            autoClose: 2000,
            type: 'success'
          })
        })

        .catch(error => {
          toast(error.message, {
            autoClose: 2000,
            type: 'error',
          })
        })

      } else {
        toast('vous n\'avez pas asse de coins', {
            autoClose: 2000,
            type: 'error',
        })
      }
    },
    openPopup(skin){
      console.log('skin')
      this.paymentModalActive = true;
      this.skin = skin
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
    getSkins() {
      fetchData('/skins')
      .then(response => {
        this.skins = response.data
      })
      .catch(error => {
      });
    },

    handlePictureChange(event) {
      const selectedFile = event.target.files[0];
      this.base64func(selectedFile).then((f) => {
        this.picture = f
      })
    },
    createSkin(data) {
      postData('/skin/create', data)
      .then(response => {
          toast('Le Skin a bien été Creer', {
              autoClose: 2000,
              type: 'success'
          })
          this.getSkins();
      })
      .catch(error => {
          toast(error.message, {
              autoClose: 2000,
              type: 'error',
          })
      });
    },
    openModal(type) {
      this.skin = type
      this.modalActive = true;
      this.currentModal = type;
    },

    handleConfirm() {
      if (this.title === '' || this.price === '') {
        toast('Veuillez remplir tous les champs.', {
          autoClose: 2000,
          type: 'error',
        });
        return;
      }
      const newSkin = {
        title: this.title,
        price: this.price,
        money_type: this.money_type,
        picture: this.picture,
        coins_price: this.coins_price 
      };

      if (isNaN(parseFloat(newSkin.price))) {
        this.isValidPrice = false;
        return;
      }

      this.isValidPrice = true;

      this.createSkin(newSkin);
      this.closeModal();
    },

 
    closeModal() {
          this.modalActive = false;
    }
},
};
</script>
<style scoped>
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
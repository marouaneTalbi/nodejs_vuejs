<template>
    <section class="dashboard">
      <div id="card-element"></div>
      <Modal @close="toggleModal" @confirm="handleConfirm" :modalActive="modalActive">
        <div class="modal-content" v-if="currentModal === 'createSkin'">
          <h2 style="color: white;">Créer le Skin</h2>
          <form @submit.prevent="handleConfirm">
            <div class="form-group">
              <label for="title">Titre</label>
              <input type="text" style="color:white" v-model="title" id="title" placeholder="Titre" required>
            </div>
            <div class="form-group">
              <label for="price">Prix</label>
              <input type="text" style="color:white" v-model="price" id="price" placeholder="Prix" required>
              <p v-if="!isValidPrice" class="error-message">Veuillez entrer une valeur numérique pour le prix.</p>
            </div>
  
            <div class="form-group">
              <label for="picture">Photo</label>
              <input type="file" style="color:white" id="picture" @change="handlePictureChange" placeholder="Photo" required>
            </div>
  
            <div class="form-group">
              <label for="money_type">Type de monnaie</label>
              <input type="text" style="color:white" v-model="money_type" id="money_type" placeholder="Type de monnaie" required>
            </div>
          </form>
        </div>
      </Modal>
    <div class="container">
      <div class="card-list" v-if="!modalActive">
        <div class="card" v-for="skin in skins" :key="skin._id">
          <div class="card-image">
            <!-- <img :src="skin.picture" alt="Skin Image"> -->
            <img :src="getPictureUrl(skin.picture)" alt="" style=" object-fit: contain;">
          </div>
          <div class="card-content">
            <h4>{{ skin.title }}</h4>
            <p>{{ skin.price }}</p>
            <button class="buy-button" @click="buySkin(skin)">Acheter</button>
          </div>
        </div>
      </div>
    </div>
  
    </section>
  </template>
  
  <script>
  import { fetchData, postData } from '../api/api';
  import Header from '../components/Header.vue';
  import Modal from '../components/Modal.vue';
  import { ref } from 'vue';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import axios from 'axios';    
  import { StripeCheckout } from '@vue-stripe/vue-stripe';
  import { loadStripe } from '@stripe/stripe-js';

  export default {
    components: {
      Header,
      Modal,
      loadStripe
    },
    setup() {
      const modalActive = ref(false);
      const toggleModal = () => {
        modalActive.value = !modalActive.value;
      };
      const isValidPrice = ref(true);
      return { modalActive, toggleModal, currentModal: null, isValidPrice };
    },
    data() {
      return {
        skins: [],
        title: '',
        price: '',
        money_type: '',
        picture: null,
        skins: [],
        title: '',
        price: '',
        money_type: '',
        picture: null,
      }
    },
    mounted() {
      this.getSkins();
    },
    methods: {
      getSkins() {
        fetchData('/skins')
          .then(response => {
            this.skins = response.data;
          })
          .catch(error => {
            toast(error.message, {
              autoClose: 2000,
              type: 'error'
            });
          });
      },
      getPictureUrl(picture) {
        return `http://localhost:3000${picture}`;
      },
    async buySkin(skin) {
      const stripePromise = loadStripe('pk_test_51IM8ZrEwRtoFpDAHs6Iu7d92N4DPiPWs4MjYP3BhnlNyf0Lz3itqGdpugMYLXIMyHZeQvxNyH4FCEAAtoJv9b7V600AGKAwSrE');
      const stripe = await stripePromise;
      const response = await postData('/skin/pay', {skin})
      const sessionId = response.data.sessionId;

      if(sessionId) {
        postData('/skin/purchase', {userId:1, skinId:skin.id})
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
    }
  }
  };
  </script>
  
  <style scoped>
  .card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }
  
  .card {
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 4px;

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
  
  .buy-button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #2196f3;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  
  
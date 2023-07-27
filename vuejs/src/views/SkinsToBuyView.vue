<template>
    <section class="dashboard">
    <Header />

      <div id="card-element"></div>
        <Popup @close="paymentToggleModal"  :popupActive="paymentModalActive" >
          <div class="popupButtons">
            <button class="buy-button" @click="buySkin()">Payer par carte</button>
            <button class="buy-button" @click="buyByCoins()">Payer avec Les Coins</button>
          </div>
        </Popup>

        <div class="container">
          <div class="card-list">
            <div class="card" v-for="skin in skins" :key="skin._id">
              <div class="card-image">
                <img :src="getPictureUrl(skin.picture)" alt="" style=" object-fit: contain;">
              </div>
              <div class="card-content">
                <h4 class="titleStyle">{{ skin.title }}</h4>
                <div class="pricesContainer">
                  <p class="titleStyle">{{ skin.price }}$</p>
                  <p class="titleStyle">{{ skin.coins_price }} coins</p>
                </div>
                <button class="buy-button" @click="openModal(skin)">Acheter</button>
              </div>
            </div>
          </div>
        </div>
    </section>
  </template>
  
  <script>
  import { fetchData, postData, serverURI, patchData } from '../api/api';
  import Header from '../components/Header.vue';
  import Popup from '../components/Popup.vue';

  import { ref } from 'vue';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import axios from 'axios';    
  import { StripeCheckout } from '@vue-stripe/vue-stripe';
  import { loadStripe } from '@stripe/stripe-js';
  import Cookies from 'js-cookie';

  export default {
    components: {
      Header,
      Popup,
      loadStripe
    },
    setup() {
      const modalActive = ref(false);
      const paymentModalActive = ref(false);
      const toggleModal = () => {
        modalActive.value = !modalActive.value;
      };
      const paymentToggleModal = () => {
        paymentModalActive.value = !paymentModalActive.value;
      };
      const isValidPrice = ref(true);
      return { modalActive, toggleModal, currentModal: null, isValidPrice, paymentModalActive, paymentToggleModal, currentPaymentModal: null, };
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
      openModal(skin){
        this.paymentModalActive = true;
        this.skin = skin
      },
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
    background-color: #f0f0f035;
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
    height: 40px;
    width: 40%;
    margin-top: 10px;
    padding: 10px 20px;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
  .popupButtons{
    display: flex;
    margin: 3%;
    justify-content: space-between;
    padding: 10px;
  }
  .titleStyle {
    color:#fff
  }
  .pricesContainer{
    display: flex;
    justify-content: space-between;
  }
  </style>
  
  
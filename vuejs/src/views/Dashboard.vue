<template>
  <section class="dashboard">
    <Header />

    <Modal @close="toggleModal" @confirm="handleConfirm" :modalActive="modalActive" >
      <div class="modal-content">
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
       
          <div class="form-group" >
            <label for="picture" >Photo</label>
            <input type="file" style="color:white" id="picture" @change="handlePictureChange" placeholder="Photo" required>
          </div>

          <div class="form-group">
            <label for="money_type">Type de monnaie</label>
            <input type="text" style="color:white" v-model="money_type" id="money_type" placeholder="Type de monnaie" required>
          </div>

          <div class="form-group">
            <label for="money_type">Coins</label>
            <input type="text" style="color:white" v-model="coins_price" id="coins_price" placeholder="Coins" required>
            <p v-if="!isValidPrice" class="error-message">Veuillez entrer une valeur numérique pour les Coins.</p>
          </div>
          <button type="submit">Créer</button>
        </form>
      </div>
    </Modal>

    <div class="container">
      <!-- <h3>Administration <span>/ All</span></h3> -->
      <div class="user-list">
        <h5>Users</h5>
        <table>
          <colgroup span="4"></colgroup>
          <tr class="header">
            <th>AUTHOR</th>
            <th v-if="showInfos">CREATION DATE</th>
            <th v-if="showInfos">ROLE</th>
            <th v-if="showInfos">COINS</th>
            <th>ACTION</th>
          </tr>
          <tr v-for="user in users" :key="user._id" class="user-row">
            <td style="text-align: left;" class="info">
              <div class="img"></div>
                <span class="pseudo">{{ user.pseudo }}</span>
                <span class="mail">{{ user.mail }}</span>
            </td>
            <td style="text-align: center;" class="date" v-if="showInfos">{{user.createdat ? formatDate(user.createdat) : '14/07/2021' }}</td>
            <td style="text-align: center;" class="date" v-if="showInfos">{{ user.role ? user.role: 'gamer' }}</td>
            <td style="text-align: center;" class="date" v-if="showInfos">{{ user.coins ? user.coins: '00' }}</td>

            <td style="text-align: right;" class="action">
              <router-link :to="{ name: 'user', params: { id: user._id } }">View</router-link>
              <!-- <router-link :to="{ name: 'user', params: { slug: generateSlug(user.pseudo) } }">View</router-link> -->
            </td>
          </tr>
        </table>
      </div>
      
      <div class="user-list">
        <div class="header">
          <h5>Skins</h5>
          <button @click="openModal()">Créer</button>
        </div>
        <table>
          <colgroup span="4"></colgroup>
          <tr class="header">
            <th>TITLE</th>
            <th v-if="showInfos">PRICE</th>
            <th v-if="showInfos">COINS PRICE</th>
            <th>ACTION</th>
          </tr>
          <tr v-for="skin in skins" :key="skin.id" class="user-row">
            <td style="text-align: left;" class="info">
              <img :src="getPictureUrl(skin.picture)" alt="">
                <span class="pseudo">{{ skin.title }}</span>
                <span class="mail">{{ skin.id }}</span>
            </td>
            <td style="text-align: center;" class="date" v-if="showInfos">{{ skin.price }}{{ skin.money_type }}</td>
            <td style="text-align: center;" class="date" v-if="showInfos">{{ skin.coins_price }}</td>

            <td style="text-align: right;" class="action">
              <router-link :to="{ name: 'skin', params: { id: skin.id } }">View</router-link>
              <!-- <router-link :to="{ name: 'user', params: { slug: generateSlug(user.pseudo) } }">View</router-link> -->
            </td>
          </tr>
        </table>
      </div> 
    </div>
  </section>
</template>

<script>
import { fetchData,serverURI } from '../api/api';
import Header from '../components/Header.vue';
import Modal from '../components/Modal.vue';
import { ref } from 'vue';

export default {
  components: {
    Header,
    Modal,
  },
  data() {
    return {
      users: [],
      skins: [],
      showInfos: true
    };
  },
  setup() {
    // MODAL
    const modalActive = ref(false);
    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    }

    const isValidPrice = ref(true);


    return { modalActive, toggleModal, isValidPrice }
  },
  mounted() {
    this.getUsers();
    this.getSkins();
    window.addEventListener('resize', this.checkScreenWidth);
    this.checkScreenWidth();
  },
  destroyed() {
    window.removeEventListener('resize', this.checkScreenWidth);
  },
  methods: {
    getUsers() {
      fetchData('/users')
      .then(response => {
        console.log(response.data)
        this.users = response.data
      })
      .catch(error => {
      });
    },
    openModal(type) {
      this.modalActive = true;
      this.currentModal = type;
    },
    getPictureUrl(picture) {
      return `${serverURI}${picture}`;
    },
    getSkins() {
      fetchData('/skins')
      .then(response => {
        console.log(response.data)
        this.skins = response.data
      })
      .catch(error => {
      });
    },
    checkScreenWidth() {
      this.showInfos = window.innerWidth >= 850; 
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
  }
};
</script>
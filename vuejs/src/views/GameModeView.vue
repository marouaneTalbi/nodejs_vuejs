<template>
  <section class="gamemode">
    <Header />

    <Modal @close="toggleModal" @confirm="handleConfirm" :modalActive="modalActive" :showConfirmButton="false">
      <div class="modal-content">
        <h2>Private Game</h2>
        <button @click="joinWaitingRoom('private')">Créer</button>
        <hr />
        <form @submit.prevent="handleConfirm">
          <input type="text" v-model="code" placeholder="Code" required>
          <button>
            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10 7 5 5-5 5"></path></svg>
          </button>
        </form>
      </div>
    </Modal>

    <h3>GAMEMODE</h3>
    <div class="card-container">
      <div class="card card--ranked" @click="joinWaitingRoom('ranked')">
        <img src="../styles/images/sword.png" />
        <div class="content">
          <h4>RANKED</h4>
          <p>La ranked est un mode de jeu compétitif où les joueurs s'affrontent pour grimper dans un classement basé sur leurs performances.</p>
        </div>
      </div>
      <div class="card card--unranked" @click="joinWaitingRoom('unranked')">
        <img src="../styles/images/shield.png" />
        <div class="content">
          <h4>UNRANKED</h4>
          <p>L'unranked est un mode de jeu décontracté où les joueurs peuvent jouer sans se soucier d'un classement ou d'un niveau de compétition spécifique.</p>
        </div>
      </div>
      <div class="card card--private" @click="openModal()">
        <img src="../styles/images/battle_helmet.png" />
        <div class="content">
          <h4>PRIVATE</h4>
          <p>Le mode de jeu "private" permet aux joueurs de créer des parties privées et restreintes, où seuls les joueurs invités peuvent participer.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Header from '../components/Header.vue';
import SocketioService from '../services/socketio.service';
import { fetchData } from '../api/api';
import Cookies from 'js-cookie';

import Modal from '../components/Modal.vue';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  components: {
    Header,
    Modal
  },

  data() {
    return {
      userId: null,
    };
  },

  created() {
    SocketioService.setupSocketConnection();
    SocketioService.joinGameSucces();
    this.getCurrentUser();

    SocketioService.joinPrivateGameError((error) => {
      toast(error, {
        autoClose: 2000,
        type: 'error'
      })
    });
  },

  setup() {

    const modalActive = ref(false);
    const code = ref('');

    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    }

    // Émettre l'événement pour rejoindre une salle d'attente
    const joinWaitingRoom = (gamemode) => {
      SocketioService.joinWaitingRoom(gamemode, this.userId);
    };

    // Écouter l'événement de confirmation de rejoindre une partie
    const joinGameSucces = () => {
        SocketioService.joinGameSucces();
    };

    return {
      joinGameSucces,
      modalActive, 
      toggleModal, 
      currentModal: null,
      code
    };
  },
  methods: {
    joinWaitingRoom(gamemode) {
      SocketioService.joinWaitingRoom(gamemode, this.userId, null);
    },

    joinWaitingRoomWithCode(gamemode) {
      SocketioService.joinWaitingRoom(gamemode, this.userId, this.code);
    },

    getCurrentUser() {
      const token = Cookies.get('token');
      if (token) {
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        this.userId = decodedPayload.id;
      }
    },


    openModal() {
      this.modalActive = true;
    },

    handleConfirm() {
      this.joinWaitingRoomWithCode('private');
      this.closeModal();
    },

        closeModal() {
            this.modalActive = false;
        }
  },
}
</script>


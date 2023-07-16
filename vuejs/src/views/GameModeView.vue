<template>
  <section class="gamemode">
    <Header />
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
      <div class="card card--private" @click="joinWaitingRoom('private')">
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

export default {
  components: {
    Header,
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
  },

  setup() {

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
    };
  },
  methods: {
    joinWaitingRoom(gamemode) {
      SocketioService.joinWaitingRoom(gamemode, this.userId);
    },

    getCurrentUser() {
      const token = Cookies.get('token');
      if (token) {
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        this.userId = decodedPayload.id;
      }
    },
  },
}
</script>


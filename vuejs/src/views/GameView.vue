<template>
  <section class="game">
    <Header/>
    <div id="messageDiv" class="message hidden">A vous de jouer !</div>
    <section v-if="waitingForOpponent" class="waiting-screen">
      <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <g clip-path="url(#a)">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m14.071 7.586-.828.828A2 2 0 0 1 11.828 9h-1.414c-.375 0-.735.149-1 .414v0a1.414 1.414 0 0 0 0 2l1.829 1.829a2 2 0 0 0 2.828 0l1.414-1.415.964 2.121a1.346 1.346 0 0 0 2.178.395v0c.252-.252.394-.595.394-.952v-4.27a2 2 0 0 1 .586-1.415l2.242-2.243c.472-.47 1.132-1.697 0-2.828-1.131-1.131-2.357-.471-2.828 0l-1.768 1.768m-3.182 3.182-2.02-.674a1.448 1.448 0 0 1-.566-2.397v0a1.448 1.448 0 0 1 1.12-.421l4.648.31m-3.182 3.182 3.182-3.182M2 14.905c.705-1.234 1.825-2.32 3-3.204M2 22.404c1.072-3.002 3.055-5.564 5.023-7.5m.477 6.5c.721-1.442 1.96-3.077 3.087-4.405"></path>
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h24v24H0z"></path>
          </clipPath>
        </defs>
      </svg>
      <p v-if="waitingForOpponent">Adversaire en attente...</p>
      <div v-if="game.gamemode === 'private'" class="code" style="display: flex;flex-direction: column;">
        <div>
          <span>{{ game.code }}</span>
          <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               @click="copyToClipboard">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 8h2c1.333 0 4 .8 4 4s-2.667 4-4 4h-2M9 8H7c-1.333 0-4 .8-4 4s2.667 4 4 4h2m-1-4h8"></path>
          </svg><br>
        </div>
        <div>
          <p>Partager le code par :</p>
          <a :href="'https://api.whatsapp.com/send?text=' + encodeURIComponent(game.code)" target="_blank" style="margin-top: 20px">
            <svg fill="#4fcb34" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 308 308" xml:space="preserve" stroke="#4fcb34"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_468_"> <path id="XMLID_469_" d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156 c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687 c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887 c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153 c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348 c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802 c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922 c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0 c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458 C233.168,179.508,230.845,178.393,227.904,176.981z"></path> <path id="XMLID_470_" d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716 c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396 c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188 l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677 c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867 C276.546,215.678,222.799,268.994,156.734,268.994z"></path> </g> </g></svg>
          </a>
        </div>
      </div>
    </section>

    <div style="
      display:flex;
      justify-content: center;
      align-items: center ;
      width: 100%;
      padding: 10px;
      ">
      <div style=" width: 100%; display: flex;justify-content: center; align-items: center;" v-if="advairsaireInfo && !isMyTurn">
        <h2 style="
          display: flex;
          align-items: center;
          color:white;
          padding: 2%;">Adversaire: {{ advairsaireInfo.pseudo }}</h2>
      </div>
      <div style=" width: 100%; display: flex;justify-content: center; align-items: center;" v-if="userInfo && isMyTurn">
        <h2 style="
          display: flex;
          align-items: center;
          color:white;
          padding: 2%;">Vous: {{ userInfo.pseudo }}</h2>
      </div>
    </div>


    <div class="transparent-div" v-if="!isMyTurn && !waitingForOpponent "></div>
    <section class="waiting-screen" v-if="!waitingForOpponent">
      <div class="memory-game">
        <div class="memory-board">
          <div v-for="(card, index) in cards" :key="index"
               class="memory-card"
               :class="{ flipped: card.flipped }"
               @click="flipCard($event, index)">
               <div class="card-face front" v-if="skin" :style="{ backgroundImage:`url('${getSkinUrl(skin.picture)}')`}"></div>
              <div class="card-face front-noskin" v-if="!skin"></div>  
            <div class="card-face back" :style="{ backgroundImage:`url('${getPictureUrl(card.image)}')`}"></div>
          </div>
        </div>
      </div>
    </section>

    <Modal v-if="userLeft" @close="toggleModal" @confirm="handleConfirm" :modalActive="modalActive">
      <div class="modal-content">
        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m3 7 2 13h14l2-13-5 3-4-6-4 6-5-3z"></path>
          <circle cx="12" cy="14" r="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"></circle>
        </svg>
        <h2>Victoire !</h2>
        <p>Votre adversaire a quitté la partie. Vous avez remporté la victoire !</p>
      </div>
    </Modal>
    <Modal @close="toggleModalVictory" @confirm="handleConfirmVictory" :modalActive="modalActiveVictory">
      <div class="modal-content">
        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m3 7 2 13h14l2-13-5 3-4-6-4 6-5-3z"></path>
          <circle cx="12" cy="14" r="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"></circle>
        </svg>
        <h2>VICTOIRE !</h2>
        <p>Bien joué !</p>
      </div>
    </Modal>
    <Modal @close="toggleModalDefeat" @confirm="handleConfirmDefeat" :modalActive="modalActiveDefeat">
      <div class="modal-content">
        <svg style="color: #D35A5A;"  class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 16.657A8.962 8.962 0 0 1 3 11c0-4.97 4.03-8 9-8s9 3.03 9 8c0 2.143-.75 4.112-2 5.657m-14 0V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2.343m-14 0h1.5m12.5 0h-1.5"></path><circle cx="8" cy="12" r="1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m11 16 1-2 1 2h-2zm-2 3v2m3-2v2m3-2v2"></path><circle cx="16" cy="12" r="1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle></svg>
        <h2>DEFAITE !</h2>
        <p>Mince !</p>
      </div>
    </Modal>
    <Modal @close="toggleModalEquality" @confirm="handleConfirmEquality" :modalActive="modalActiveEquality">
      <div class="modal-content">
        <svg style="color: #fcba03;" class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4c-7.2 0-9 6-9 9h9m0-9c7.2 0 9 6 9 9h-9m0-9V3m0 10v5c0 1 .6 3 3 3s3-2 3-3"></path></svg>
        <h2>EGALITE !</h2>
        <p>wow !</p>
      </div>
    </Modal>
  </section>
  <!-- Cartes gagnées -->
  <div class="winning-cards">

  </div>

  <div class="loosing-cards">

  </div>
  <div class="chat-container">
    <div id="chatBox">
      <div v-for="(message, index) in chatMessages" :key="index" class="chat-message">
        <!--<span class="chat-message">{{ message.username }}:</span>-->
        <span v-bind:class="message.classElement">{{ message.message }}</span>
      </div>
    </div>
    <input v-model="messageInput" @keyup.enter="sendMessage" placeholder="Tapez votre message..."/>
  </div>

</template>

<script>
import Header from '../components/Header.vue';
import SocketioService from '../services/socketio.service';
import Modal from '../components/Modal.vue';
import {ref} from 'vue';
import Cookies from 'js-cookie';
import {fetchData, patchData, serverURI} from '../api/api'
import {toast} from "vue3-toastify";
import {io} from 'socket.io-client';

export default {
  components: {
    Header,
    Modal
  },

  data() {
    return {
      userId: null,
      waitingForOpponent: false,
      userLeft: false,
      flippedCards: [],
      isComparing: false,
      isMyTurn: false,
      currentPlayer: null,
      currentOpponent: null,
      game: {},
      cards: [],
      cardsElement: [],
      countCardJ1: 0,
      countCardJ2: 0,
      player1: null,
      player2: null,
      winner: null,
      chatMessages: [],
      ownMessages: [],
      messageInput: '',
      userInfo:null,
      advairsaireInfo:null,
    };
  },
  beforeRouteLeave() {
    SocketioService.userLeft(() => {
      this.userLeft = true;
      this.openModal();
    });
  },


  

  setup() {
    const modalActive = ref(false);

    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    }

    const modalActiveVictory = ref(false);

    const toggleModalVictory = () => {
      modalActiveVictory.value = !modalActiveVictory.value;
    }

    const modalActiveDefeat = ref(false);

    const toggleModalDefeat = () => {
      modalActiveDefeat.value = !modalActiveDefeat.value;
    }

    const modalActiveEquality = ref(false);

    const toggleModalEquality = () => {
      modalActiveEquality.value = !modalActiveEquality.value;
    }

    return {
      modalActive,
      toggleModal,
      modalActiveVictory,
      toggleModalVictory,
      modalActiveDefeat,
      toggleModalDefeat,
      modalActiveEquality,
      toggleModalEquality
    }

  },

  mounted() {
    const gameId = this.$route.params.id;
    this.getGame(gameId);
    SocketioService.onYourTurn((c) => {

    setTimeout(() => {

      const advairsaire = c.players.find(item => item != this.getCurrentUser())
      const r =this.getAdvairsaireInfo(advairsaire)

      this.currentPlayer = c.player
      this.currentOpponent = c.opponent;
      let totalCardTurn = this.countCardJ1 + this.countCardJ2;
      let testCondition = totalCardTurn === 8 && (this.countCardJ1 >= 5 || this.countCardJ2 >= 5);

      if (this.winner !== this.currentPlayer && this.currentPlayer) {
        if (this.countCardJ1 >= 5 || this.countCardJ2 >= 5) {
          this.openModalDefeat();
        } else if (totalCardTurn === 8) {
          this.openModalEquality();
        }
      }
      if (c && c.player === this.getCurrentUser()) {
        this.cards = c.cards
        this.isMyTurn = true;
      }
    }, 2000);

    });
  },

  created() {
    this.getCurrentUser();
    this.getUserSkin();
    this.getUserInfo()

    SocketioService.opponentCardFlipped((index) => {
      this.showCard(index)
    });


    SocketioService.waitingForPlayers((playersCount) => {
      if (playersCount < 2) {
        this.waitingForOpponent = true;
      } else {
        this.cards = playersCount.cards
        this.waitingForOpponent = false;
      }
    });

    SocketioService.userLeft(() => {
      this.userLeft = true;
      this.openModal();
    });

    this.socket = io('https://challenge.ovh/:3000'); // Remplacez "http://localhost:3000" par l'URL de votre serveur

    // Gestionnaire d'événement pour recevoir les nouveaux messages du chat
    this.socket.on('chatMessage', (message) => {
      this.chatMessages.push(message);
    });

    // Émettez l'événement 'joinChat' pour rejoindre la salle de chat
    this.socket.emit('joinChat');
  },

  methods: {
    sendMessage() {
      const message = this.messageInput.trim();
      if (message !== '') {
        // Émettez l'événement sendMessage au serveur avec le message
        this.socket.emit('sendMessage', message);
        this.ownMessages.unshift({
          classElement: 'own-response',
          username: 'You',
          message: message,
        });
        this.chatMessages = this.chatMessages.concat(this.ownMessages);
        this.ownMessages = [];
        this.messageInput = '';
      }
    },
    getCurrentUser() {
      const token = Cookies.get('token');
      if (token) {
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        this.userId = decodedPayload.id;

        return this.userId
      }
    },
    getUserSkin(){
      fetchData('/user/skin/' + this.userId)
      .then(response => {
        this.skin = response.data
      })
    },
    getPictureUrl(picture) {
      return `${serverURI}/pictures/cards/${picture}`;
    },
    getSkinUrl(picture) {
      return `${serverURI}/pictures/skins/${picture}`;
    },
    flipCard(event, index) {
      const gameId = this.$route.params.id;
      let totalCardTurn = this.countCardJ1 + this.countCardJ2;
      if (totalCardTurn === 8 || this.countCardJ1 >= 5 || this.countCardJ2 >= 5) {
        // this.endGame();
        //this.endTurn();
      }
      if (!this.isMyTurn || this.flippedCards.length === 2) return;
      SocketioService.flipedCard(gameId, index)
      if (this.currentPlayer === this.getCurrentUser()) {
        this.displayMessageTurn("A vous de jouer");
        this.isMyTurn = true;
      }
      const clickedCard = event.target;
      this.cardsElement.push(clickedCard);
      this.showCard(index, event)
    },
    setUser1AndUser2(check = false) {
      /*if (this.player1 === null) {
        this.player1 = this.getCurrentUser();
      }
      if (this.player2 === null && this.currentPlayer != this.player1) {
        this.player2 = this.currentPlayer;
      }*/
      if (check === false) {
        this.endTurn();
        this.setUser1AndUser2(true);
      }

    },
    showCard(index, event) {
      let totalCardTurn = this.countCardJ1 + this.countCardJ2;
      // if (totalCardTurn === 8 || this.countCardJ1 >= 5 || this.countCardJ2 >= 5) {
      //   this.endGame();
      //   //this.endTurn();
      // }
      //this.setUser1AndUser2();
      if (this.currentPlayer !== this.getCurrentUser()) {
        this.isMyTurn = false;
      }
      if (this.currentPlayer === this.getCurrentUser()) {
          this.isMyTurn = true;
      }
      if (this.isComparing || this.cards[index].flipped) return;
      this.cards[index].flipped = true;
      this.flippedCards.push(index);
      if (this.flippedCards.length >= 2) {
        this.isComparing = true;

        if (this.cards[this.flippedCards[0]].image !== this.cards[this.flippedCards[1]].image) {
          this.cardsElement = [];
          if (this.currentPlayer === this.getCurrentUser()) {
            this.isMyTurn = false;
          }
          let cardsDiv = document.getElementsByClassName('memory-card');
          const cardArray = Array.from(cardsDiv);
          cardArray.forEach((element) => {
            element.style.pointerEvents = 'none';
          });

          setTimeout(() => {
            this.cards[this.flippedCards[0]].flipped = false;
            this.cards[this.flippedCards[1]].flipped = false;
            this.flippedCards = [];
            this.isComparing = false;
            cardArray.forEach((element) => {
              element.style.pointerEvents = 'initial';
            });
            if (this.currentPlayer === this.getCurrentUser()) {
              this.isMyTurn = false;
            }
            if (this.currentPlayer !== this.getCurrentUser()) {
              this.isMyTurn = false;
              this.showTurnMessage();
            } else {
              this.isMyTurn = true;
            }
            this.endTurn();
          }, 2000);

        } else {
          /*let totalCardTurn = this.countCardJ1 + this.countCardJ2;

          if (totalCardTurn === 8 || this.countCardJ1 >= 5 || this.countCardJ2 >= 5) {
            this.endGame();
            //this.endTurn();
          }*/

          this.flippedCards = [];
          this.isComparing = false;
    
          if (this.currentPlayer === this.getCurrentUser()) {
            this.onWin(this.cardsElement[0].parentElement.cloneNode(true));
            this.onWin(this.cardsElement[1].parentElement.cloneNode(true), true);
            this.countCardJ1++;
          }

          if (this.currentPlayer !== this.getCurrentUser()) {
            this.countCardJ2++;
            this.onOppenentWin(this.cardsElement[0].parentElement.cloneNode(true));
            this.onOppenentWin(this.cardsElement[1].parentElement.cloneNode(true), true);
          }
          this.cardsElement = [];
          let totalCardTurn = this.countCardJ1 + this.countCardJ2;

          if (totalCardTurn === 8 || this.countCardJ1 >= 5 || this.countCardJ2 >= 5) {
            this.endGame();
            this.endTurn();
          }
          return;
          //this.endTurn();
        }
      }
    },
    endGame() {
      if (this.currentPlayer === this.getCurrentUser() && this.countCardJ1 > this.countCardJ2) {
        this.updateUserGame(this.getCurrentUser(), this.$route.params.id, {result: "win", opponentId:this.currentOpponent, game: this.game})
        this.updateUserGame(this.currentOpponent, this.$route.params.id, {result: "loose", opponentId:this.currentOpponent, game: this.game})
        this.openModalVictory();
      }
      if (this.currentPlayer !== this.getCurrentUser() && this.countCardJ1 < this.countCardJ2) {
        this.updateUserGame(this.currentPlayer, this.$route.params.id, {result: "win", opponentId: this.getCurrentUser(), game: this.game})
        this.updateUserGame(this.getCurrentUser(), this.$route.params.id, {result: "loose", opponentId: this.getCurrentUser(), game: this.game})
        this.openModalVictory();
      } 
      if (this.countCardJ1 === this.countCardJ2) {
        this.updateUserGame(this.currentOpponent, this.$route.params.id, {result: "equality", opponentId: this.getCurrentUser(), game: this.game})
        this.updateUserGame(this.getCurrentUser(), this.$route.params.id, {result: "equality", opponentId: this.currentOpponent, game: this.game})
        this.openModalEquality();
      }
    },
    showTurnMessage() {
      const messageDiv = document.getElementById('messageDiv');
      messageDiv.classList.remove('hidden');
      setTimeout(() => {
        messageDiv.classList.add('hidden');
      }, 2000); // Supprimez le message après 2 secondes (ajustez cette valeur selon votre préférence)
    },
    displayMessageTurn(message) {
      const messageElement = document.getElementById('messageDiv');
      messageElement.innerText = message;
    },
    onWin(winningCardElement, secondCard = false) {
      const winningCardsContainer = document.querySelector('.winning-cards');
      // Ajouter la carte gagnée dans le conteneur des cartes gagnées
      if (secondCard) {
        winningCardElement.setAttribute('class', 'memory-card flipped');
      }
      winningCardsContainer.appendChild(winningCardElement);

      // Animation d'apparition de la carte gagnée depuis le haut
      winningCardElement.style.animation = 'slideInFromTop 3s';
      winningCardElement.style.animationFillMode = 'forwards';

      // Animation de disparition de la carte du jeu en la faisant glisser vers le haut
      winningCardElement.addEventListener('animationend', () => {
        //winningCardElement.remove();
      });
    },
    onOppenentWin(winningCardElement, secondCard = false) {
      const loosingCardsContainer = document.querySelector('.loosing-cards');
      // Ajouter la carte gagnée dans le conteneur des cartes gagnées
      if (secondCard) {
        winningCardElement.setAttribute('class', 'memory-card flipped');
      }
      loosingCardsContainer.appendChild(winningCardElement);
    },
    endTurn() {
      let currentUserId = this.getCurrentUser()
      this.isMyTurn = false;
      const gameId = this.$route.params.id;
      SocketioService.endTurn(gameId, this.currentPlayer, this.cards);
    },
    getGame(gameId) {
      fetchData('/game/' + gameId)
          .then(response => {
            this.game = response.data;
          })
          .catch(error => {
            console.error(error)
          });
    },
    handleConfirm() {
      this.modalActive = false;
    },
    openModal() {
      this.modalActive = true;
      setTimeout(() => {
        this.$router.push('/stats');
      }, 2500);
    },
    handleConfirmVictory() {
      this.modalActiveVictory = false;
    },
    openModalVictory() {
      this.modalActiveVictory = true;
      setTimeout(() => {
        this.$router.push('/stats');
      }, 2500);
    },
    handleConfirmDefeat() {
      this.modalActiveDefeat = false;
    },
    openModalDefeat() {
      this.modalActiveDefeat = true;
      setTimeout(() => {
        this.$router.push('/stats');
      }, 2500);
    },
    handleConfirmEquality() {
      this.modalActiveEquality = false;
    },
    openModalEquality() {
      this.modalActiveEquality = true;
      setTimeout(() => {
        this.$router.push('/stats');
      }, 2500);
    },
    copyToClipboard() {
      const code = this.game.code;
      navigator.clipboard.writeText(code)
          .then(() => {
          })
          .catch((error) => {
          });
    },
    updateUserGame(userId, gameId, data) {
      patchData('/user/' + userId + '/game/' + gameId, data)
          .then(response => {
            toast('La game a bien été modifié', {
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
    },
    getUserInfo(){
      fetchData('/user/' + this.getCurrentUser())
      .then(response => {
          this.userInfo = response.data
      })
    },
    getAdvairsaireInfo(userId){
      fetchData('/user/' + userId)
      .then(response => {
        this.advairsaireInfo = response.data
      })
    },
  },

}
</script>
<style scoped>
.transparent-div{
  position : fixed;
  top : 0;
  left : 0;
  width : 100%;
  height : 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  pointer-events : auto;
}

.memory-game {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.memory-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4x4 grid, ajustez si nécessaire */
  gap: 1rem;
  margin-top:120px
}

.memory-card {
  width: 100px;
  height: 100px;
  perspective: 1000px;
  cursor: pointer;

  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.memory-card.flipped {
  transform: rotateY(180deg); /* Rotation de la carte */
}

.card-face {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;

  background-size: contain;
}

.front {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
}
.front-noskin {
  background-color: #3D2642;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  object-fit: contain;
  border-radius: 10px;
}
.back {
  transform: rotateY(180deg);
}


.color-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  opacity: 0.8;
}

.disabled-cards {
  pointer-events: none;
}

#messageDiv {
  font-size: 24px;
  font-weight: bold;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 10px;
}

#messageDiv {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 18px;
  animation: fadeInOut 2s ease-in-out;
  z-index: 2;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.hidden {
  display: none;
}

.winning-cards {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
}

.winning-cards > div:not(:first-child) {
  margin-left: -60px;
}

.loosing-cards {
  position: absolute;
  top: 130px;
  right: 20px;
  display: flex;
  gap: 10px;
}

@keyframes slideInFromTop {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideOutToTop {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
}

.chat-container {
  position: fixed;
  bottom: 0;
  right: 20px;
  width: 300px;
  background-color: #f1f1f1;
  padding: 10px;
  z-index: 10000;
}

.chat-messages {
  display: flex;
  max-height: 150px;
  overflow-y: auto;
}

.chat-message {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
}

/* Style de base pour le message */
span.chat-response {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100px;
  padding: 14px 18px;
  margin: 6px 8px;
  background-color: #5b5377;
  border-radius: 16px 16px 16px 0;
  border: 1px solid #443f56;
  height: 35px;
  align-self: flex-start;
  width: fit-content;
}

span.own-response {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100px;
  padding: 14px 18px;
  margin: 6px 8px;
  background-color: #6C8EA4;
  border-radius: 16px 16px 0 16px;
  border: 1px solid #54788e;
  height: 35px;
  align-self: flex-end;
  width: fit-content;
}

</style>
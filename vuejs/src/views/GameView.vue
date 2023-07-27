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
      <div v-if="game.gamemode === 'private'" class="code">
        <span>{{ game.code }}</span>
        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             @click="copyToClipboard">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 8h2c1.333 0 4 .8 4 4s-2.667 4-4 4h-2M9 8H7c-1.333 0-4 .8-4 4s2.667 4 4 4h2m-1-4h8"></path>
        </svg>
      </div>
    </section>

    <div class="transparent-div" v-if="!isMyTurn"></div>
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
        <span id="counterSpan">+0</span>
        <p>Bien joué !</p>
      </div>
    </Modal>
    <Modal @close="toggleModalDefeat" @confirm="handleConfirmDefeat" :modalActive="modalActiveDefeat">
      <div class="modal-content">
        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m3 7 2 13h14l2-13-5 3-4-6-4 6-5-3z"></path>
          <circle cx="12" cy="14" r="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"></circle>
        </svg>
        <h2>DEFAITE !</h2>
        <span>0 coins</span>
        <p>Mince !</p>
      </div>
    </Modal>
    <Modal @close="toggleModalEquality" @confirm="handleConfirmEquality" :modalActive="modalActiveEquality">
      <div class="modal-content">
        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m3 7 2 13h14l2-13-5 3-4-6-4 6-5-3z"></path>
          <circle cx="12" cy="14" r="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"></circle>
        </svg>
        <h2>EGALITE !</h2>
        <span>0 coins</span>
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
    <div class="chat-messages">
      <div v-for="(message, index) in chatMessages" :key="index" class="chat-message">
        <span>{{ message.username }}:</span>
        <p>{{ message.message }}</p>
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
import router from '../router/index.ts';
import {io} from 'socket.io-client';

let ActualUser = null;

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
      messageInput: '',
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
      this.currentPlayer = c.player
      this.currentOpponent = c.opponent;
      let totalCardTurn = this.countCardJ1 + this.countCardJ2;
      console.log('passe bien par on your turn :' + this.currentPlayer);
      console.log('this.countCardJ1 ' + this.countCardJ1);
      console.log('this.countCardJ2 ' + this.countCardJ2);
      console.log('totalCardTurn ' + totalCardTurn);
      let testCondition = totalCardTurn === 8 && (this.countCardJ1 >= 5 || this.countCardJ2 >= 5);
      console.log('testCondition ' + testCondition);
      console.log('this.winner ' + this.winner);
      console.log('this.currentPlayer ' + this.currentPlayer);
      console.log('this.currentOpponent ' + this.currentOpponent);
      if (this.winner !== this.currentPlayer && this.currentPlayer) {
        if (this.countCardJ1 >= 5 || this.countCardJ2 >= 5) {
          console.log("defaite");
          this.openModalDefeat();
        } else if (totalCardTurn === 8) {
          console.log("egalite");
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

    this.socket = io('http://localhost:3000'); // Remplacez "http://localhost:3000" par l'URL de votre serveur

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
    changeDivColor(color) {
      const div = document.getElementById('testdiv');
      if (div) {
        div.style.backgroundColor = color;
      }
    },
    flipCard(event, index) {
      const gameId = this.$route.params.id;
      let totalCardTurn = this.countCardJ1 + this.countCardJ2;
      /*if (totalCardTurn === 8 || this.countCardJ1 >= 5 || this.countCardJ2 >= 5) {
        this.endGame();
        //this.endTurn();
      }*/
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
      /*if (totalCardTurn === 8 || this.countCardJ1 >= 5 || this.countCardJ2 >= 5) {
        this.endGame();
        //this.endTurn();
      }*/
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
          /*setTimeout(() => {
            this.cardsElement[0].style.display = "none";
            this.cardsElement[1].style.display = "none";
          }, 2000);*/
          if (this.currentPlayer === this.getCurrentUser()) {
            /*this.onWin(this.cardsElement[0].parentElement.cloneNode(true));
            this.onWin(this.cardsElement[1].parentElement.cloneNode(true), true);*/
            this.countCardJ1++;
          }

          if (this.currentPlayer !== this.getCurrentUser()) {
            this.countCardJ2++;
            /*this.onOppenentWin(this.cardsElement[0].parentElement.cloneNode(true));
            this.onOppenentWin(this.cardsElement[1].parentElement.cloneNode(true), true);*/
          }
          this.cardsElement = [];
          let totalCardTurn = this.countCardJ1 + this.countCardJ2;
          console.log("senorrr");
          console.log(this.currentPlayer)
          console.log(this.currentOpponent)

          if (totalCardTurn === 8 || this.countCardJ1 >= 5 || this.countCardJ2 >= 5) {
            if (this.currentPlayer) {
              this.endGame();
              this.endTurn();
            }
          }
          return;
          //this.endTurn();
        }
      }
    },

    endGame() {
      if (this.currentPlayer === this.getCurrentUser() && this.countCardJ1 > this.countCardJ2) {
        this.updateUserGame(this.getCurrentUser(), this.$route.params.id, {
          result: "win",
          opponent: this.currentOpponent
        })
        this.updateUserGame(this.currentOpponent, this.$route.params.id, {
          result: "loose",
          opponent: this.currentOpponent
        })
        this.winner = this.currentPlayer;
        this.openModalVictory();
      }
      if (this.currentPlayer !== this.getCurrentUser() && this.countCardJ1 < this.countCardJ2) {
        this.updateUserGame(this.currentPlayer, this.$route.params.id, {result: "win", opponent: this.getCurrentUser()})
        this.updateUserGame(this.getCurrentUser(), this.$route.params.id, {
          result: "loose",
          opponent: this.getCurrentUser()
        })
        this.winner = this.currentPlayer;
        this.openModalVictory();
      }
      if (this.countCardJ1 === this.countCardJ2) {
        this.updateUserGame(this.currentOpponent, this.$route.params.id, {result: "equality"})
        this.updateUserGame(this.getCurrentUser(), this.$route.params.id, {result: "equality"})
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


    createTransparentDiv() {
      const transparentDiv = document.querySelector('.transparent-div');
      if (!transparentDiv) {
        const transparentDiv = document.createElement('div');
        transparentDiv.style.position = 'fixed';
        transparentDiv.style.top = '0';
        transparentDiv.style.left = '0';
        transparentDiv.style.width = '100%';
        transparentDiv.style.height = '100%';
        transparentDiv.style.backgroundColor = 'transparent';
        transparentDiv.style.zIndex = '9999'; // Assurez-vous qu'elle est au-dessus de tout autre contenu
        transparentDiv.style.pointerEvents = 'auto'; // Capture tous les événements de clic
        transparentDiv.className = "transparent-div";
        document.body.appendChild(transparentDiv);
      }
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

    async setColor(color) {
      await SocketioService.changeColor(color)
      this.changeDivColor(color);
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
    updateCounter() {
      const counterSpan = document.getElementById('counterSpan');
      let count = 0;

      // Utilisation d'une fonction setInterval pour augmenter le compteur toutes les 100 millisecondes
      const interval = setInterval(() => {
        counterSpan.textContent = count;
        count++;

        // Arrêter le compteur lorsque la valeur atteint 20
        if (count > 20) {
          clearInterval(interval);
        }
      }, 100);
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
  left: 0;
  width: 100%;
  background-color: #f1f1f1;
  padding: 10px;
}

.chat-messages {
  max-height: 150px;
  overflow-y: auto;
}

.chat-message {
  margin-bottom: 5px;
}


</style>
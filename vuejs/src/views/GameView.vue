<template>
    <section class="game">
        <Header />
      <div id="messageDiv" class="message hidden">A vous de jouer !</div>
        <section v-if="waitingForOpponent" class="waiting-screen">
            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><g clip-path="url(#a)"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.071 7.586-.828.828A2 2 0 0 1 11.828 9h-1.414c-.375 0-.735.149-1 .414v0a1.414 1.414 0 0 0 0 2l1.829 1.829a2 2 0 0 0 2.828 0l1.414-1.415.964 2.121a1.346 1.346 0 0 0 2.178.395v0c.252-.252.394-.595.394-.952v-4.27a2 2 0 0 1 .586-1.415l2.242-2.243c.472-.47 1.132-1.697 0-2.828-1.131-1.131-2.357-.471-2.828 0l-1.768 1.768m-3.182 3.182-2.02-.674a1.448 1.448 0 0 1-.566-2.397v0a1.448 1.448 0 0 1 1.12-.421l4.648.31m-3.182 3.182 3.182-3.182M2 14.905c.705-1.234 1.825-2.32 3-3.204M2 22.404c1.072-3.002 3.055-5.564 5.023-7.5m.477 6.5c.721-1.442 1.96-3.077 3.087-4.405"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"></path></clipPath></defs></svg>
            <p v-if="waitingForOpponent">Adversaire en attente...</p>
            <div v-if="game.gamemode === 'private'" class="code">
                <span>{{ game.code }}</span>
                <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" @click="copyToClipboard"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 8h2c1.333 0 4 .8 4 4s-2.667 4-4 4h-2M9 8H7c-1.333 0-4 .8-4 4s2.667 4 4 4h2m-1-4h8"></path></svg>
            </div>
        </section>

        <div class="transparent-div" v-if="!isMyTurn"></div>
        <section  class="waiting-screen" v-if="!waitingForOpponent"  >
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
                <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 7 2 13h14l2-13-5 3-4-6-4 6-5-3z"></path><circle cx="12" cy="14" r="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle></svg>
                <h2>Victoire !</h2>
                <p>Votre adversaire a quitté la partie. Vous avez remporté la victoire !</p>
            </div>
        </Modal>
    </section>
  <!-- Cartes gagnées -->
  <div class="winning-cards">

  </div>

  <div class="loosing-cards">

  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SocketioService from '../services/socketio.service';
import Modal from '../components/Modal.vue';
import { ref } from 'vue';
import Cookies from 'js-cookie';

import {fetchData, patchData, serverURI} from '../api/api'
import {toast} from "vue3-toastify";

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
            currentPlayer:null,
            game: {},
            cards: [],
            cardsElement: [],
            countCardJ1: 0,
            countCardJ2: 0,
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

        return { modalActive, toggleModal }
    },

      mounted() {
        const gameId = this.$route.params.id;
        this.getGame(gameId);
        
        SocketioService.onYourTurn((c) => {
            this.currentPlayer = c.player
            if(c && c.player === this.getCurrentUser()) {
                this.cards = c.cards
                this.isMyTurn = true;
            } 
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
    },

    methods: {
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
            console.log('skin : ', this.skin)
          })
        },
        getPictureUrl(picture) {
          return `${serverURI}/pictures/cards/${picture}`;
        },
        getSkinUrl(picture) {
          console.log('get')
          console.log(`${serverURI}/pictures/skins/${picture}`)
          return `${serverURI}/pictures/skins/${picture}`;
        },

        flipCard(event, index) {
            const gameId = this.$route.params.id;
            if (!this.isMyTurn || this.flippedCards.length === 2) return;
            SocketioService.flipedCard(gameId, index)
          if (this.currentPlayer === this.getCurrentUser()) {
            this.displayMessageTurn("A vous de jouer");
            this.isMyTurn = true;

            // this.removeTransparentDiv();
          }
            const clickedCard = event.target;
            this.cardsElement.push(clickedCard);
            this.showCard(index, event)
        },

      showCard(index, event) {
        if (this.currentPlayer !== this.getCurrentUser()) {
          this.isMyTurn = false;
          // this.createTransparentDiv();
        }
        if (this.currentPlayer === this.getCurrentUser()){
          this.isMyTurn = true;

          // this.removeTransparentDiv();
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

                  // this.createTransparentDiv();
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
                    console.log("opposant");
                    // this.createTransparentDiv();
                    this.isMyTurn = false;

                  }
                  if (this.currentPlayer !== this.getCurrentUser()){
                    console.log("joueur");
                    this.isMyTurn = true;

                  }else{
                    this.showTurnMessage();
                    this.isMyTurn = false;
                  }
                this.endTurn();
                }, 2000);
              } else {
                  this.flippedCards = [];
                  this.isComparing = false;
                // setTimeout(() => {
                //   this.cardsElement[0].style.display = "none";
                //   this.cardsElement[1].style.display = "none";
                // }, 2000);

                if (this.currentPlayer === this.getCurrentUser()) {
                  this.onWin(this.cardsElement[0].parentElement.cloneNode(true));
                  this.onWin(this.cardsElement[1].parentElement.cloneNode(true), true);
                  this.countCardJ1++;
                }

                if (this.currentPlayer !== this.getCurrentUser()) {
                  console.log("for oppenent");
                  this.countCardJ2++;
                  console.log(this.cardsElement);
                  this.onOppenentWin(this.cardsElement[0].parentElement.cloneNode(true));
                  this.onOppenentWin(this.cardsElement[1].parentElement.cloneNode(true), true);
                }
                this.cardsElement = [];
                  return;
                  //this.endTurn();
              }
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

      // createTransparentDiv(){
      //   const transparentDiv = document.querySelector('.transparent-div');
      //   console.log(transparentDiv);
      //   if (!transparentDiv) {
      //     const transparentDiv = document.createElement('div');
      //     transparentDiv.style.position = 'fixed';
      //     transparentDiv.style.top = '0';
      //     transparentDiv.style.left = '0';
      //     transparentDiv.style.width = '100%';
      //     transparentDiv.style.height = '100%';
      //     transparentDiv.style.backgroundColor = 'transparent';
      //     transparentDiv.style.zIndex = '9999'; // Assurez-vous qu'elle est au-dessus de tout autre contenu
      //     transparentDiv.style.pointerEvents = 'auto'; // Capture tous les événements de clic
      //     transparentDiv.className = "transparent-div";
      //     document.body.appendChild(transparentDiv);
      //   }
      // },

      // removeTransparentDiv() {
      //   const transparentDiv = document.querySelector('.transparent-div');
      //   console.log(transparentDiv);
      //   if (transparentDiv) {
      //     console.log("dans ifffff");
      //     //transparentDiv.forEach((element) => {
      //     transparentDiv.remove();
      //     //})
      //   }
      // },

      onWin(winningCardElement, secondCard = false) {
        const winningCardsContainer = document.querySelector('.winning-cards');
        console.log('winningCardElement');
        console.log(winningCardElement);
        // Ajouter la carte gagnée dans le conteneur des cartes gagnées
        if(secondCard){
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
        console.log('loosingCardElement');
        console.log(winningCardElement);
        // Ajouter la carte gagnée dans le conteneur des cartes gagnées
        if(secondCard){
          winningCardElement.setAttribute('class', 'memory-card flipped');
        }
        loosingCardsContainer.appendChild(winningCardElement);

        // Animation d'apparition de la carte gagnée depuis le haut
        /*winningCardElement.style.animation = 'slideInFromTop 3s';
        winningCardElement.style.animationFillMode = 'forwards';

        // Animation de disparition de la carte du jeu en la faisant glisser vers le haut
        winningCardElement.addEventListener('animationend', () => {
          //winningCardElement.remove();
        });*/
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
            this.updateUserGame(this.getCurrentUser(),this.$route.params.id, {result: "win"});
            console.log('current player : ', this.currentPlayer);

            this.updateUserGame(this.currentPlayer,this.$route.params.id, {result: "loose"});
            this.modalActive = true;
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
        patchData('/user/'+ userId +'/game/' + gameId, data)
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
  object-fit: contain;
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


</style>
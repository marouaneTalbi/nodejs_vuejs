<template>
    <section class="game">
        <Header />
        <section v-if="waitingForOpponent" class="waiting-screen">
            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><g clip-path="url(#a)"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.071 7.586-.828.828A2 2 0 0 1 11.828 9h-1.414c-.375 0-.735.149-1 .414v0a1.414 1.414 0 0 0 0 2l1.829 1.829a2 2 0 0 0 2.828 0l1.414-1.415.964 2.121a1.346 1.346 0 0 0 2.178.395v0c.252-.252.394-.595.394-.952v-4.27a2 2 0 0 1 .586-1.415l2.242-2.243c.472-.47 1.132-1.697 0-2.828-1.131-1.131-2.357-.471-2.828 0l-1.768 1.768m-3.182 3.182-2.02-.674a1.448 1.448 0 0 1-.566-2.397v0a1.448 1.448 0 0 1 1.12-.421l4.648.31m-3.182 3.182 3.182-3.182M2 14.905c.705-1.234 1.825-2.32 3-3.204M2 22.404c1.072-3.002 3.055-5.564 5.023-7.5m.477 6.5c.721-1.442 1.96-3.077 3.087-4.405"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"></path></clipPath></defs></svg>
            <p v-if="waitingForOpponent">Adversaire en attente...</p>
            <div v-if="game.gamemode === 'private'" class="code">
                <span>{{ game.code }}</span>
                <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" @click="copyToClipboard"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 8h2c1.333 0 4 .8 4 4s-2.667 4-4 4h-2M9 8H7c-1.333 0-4 .8-4 4s2.667 4 4 4h2m-1-4h8"></path></svg>
            </div>
        </section>

        <section  class="waiting-screen" v-if="!waitingForOpponent"  >
            <!-- <div style="background-color: red; height: 500px; width: 700px;" id="testdiv">
                <input type="text" name="" id="">
            </div>
            <div class="color-buttons">
                <button @click="setColor('red')">Rouge</button>
                <button @click="setColor('blue')">Bleu</button>
                <button @click="setColor('green')">Vert</button>
                <button @click="setColor('yellow')">Jaune</button>
            </div> -->
            <div class="memory-game">
                <div class="memory-board">
                <div v-for="(card, index) in cards" :key="index"
                    class="memory-card"
                    :class="{ flipped: card.flipped }"
                    @click="flipCard(index)">
                    
                    <div class="card-face front"></div>
                    <div class="card-face back" :style="{ backgroundImage:`url(${card.image})`}"></div>
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
        <button @click="updateUserGame">click</button>
    </section>
</template>

<script>
import Header from '../components/Header.vue';
import SocketioService from '../services/socketio.service';
import Modal from '../components/Modal.vue';
import { ref } from 'vue';
import Cookies from 'js-cookie';
import { fetchData, patchData } from '../api/api';

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
            flippedCards: [], // Pour suivre les deux dernières cartes retournées
            isComparing: false,
            isMyTurn: false,
            currentPlayer:null,
            game: {},
                  cards: [
                    { image: "../../public/img/1.jpeg", flipped: false },
                    { image: "../../public/img/1.jpeg", flipped: false },

                    { image: "../../public/img/2.jpeg", flipped: false },
                    { image: "../../public/img/2.jpeg", flipped: false },

                    { image: "../../public/img/3.jpeg", flipped: false },
                    { image: "../../public/img/3.jpeg", flipped: false },

                    { image: "../../public/img/4.jpeg", flipped: false },
                    { image: "../../public/img/4.jpeg", flipped: false },

                    { image: "../../public/img/5.jpeg", flipped: false },
                    { image: "../../public/img/5.jpeg", flipped: false },

                    { image: "../../public/img/6.jpeg", flipped: false },
                    { image: "../../public/img/6.jpeg", flipped: false },

                    { image: "../../public/img/7.jpeg", flipped: false },
                    { image: "../../public/img/7.jpeg", flipped: false },

                    { image: "../../public/img/8.jpeg", flipped: false },
                    { image: "../../public/img/8.jpeg", flipped: false },

                ],

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
            console.log(c)
            this.currentPlayer = c
            if(c === this.getCurrentUser()) {
                this.isMyTurn = true;
            }
        });
    },
  
    created() {
        this.getCurrentUser();

        SocketioService.opponentCardFlipped((index) => {
            this.showCard(index)
        });

      

        SocketioService.waitingForPlayers((playersCount) => {
            console.log('gello')
            if (playersCount < 2) {
                this.waitingForOpponent = true;
                console.log('pas full')
            } else {
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
     
        changeDivColor(color) {
            const div = document.getElementById('testdiv');
            if (div) {
                console.log(div)
                div.style.backgroundColor = color;
            }
        },


        flipCard(index) {
            const gameId = this.$route.params.id;
            if (!this.isMyTurn || this.flippedCards.length === 2) return;
            SocketioService.flipedCard(gameId, index)
            this.showCard(index)
        },

        showCard(index) {
            if (this.isComparing || this.cards[index].flipped) return;
                this.cards[index].flipped = true;
                this.flippedCards.push(index);

                if (this.flippedCards.length === 2) {
                    this.isComparing = true;

                if (this.cards[this.flippedCards[0]].image !== this.cards[this.flippedCards[1]].image) {
                    setTimeout(() => {
                    this.cards[this.flippedCards[0]].flipped = false;
                    this.cards[this.flippedCards[1]].flipped = false;
                    this.flippedCards = [];
                    this.isComparing = false;

                    this.endTurn();
                    }, 1000); 
                } else {
                    this.flippedCards = [];
                    this.isComparing = false;

                    this.endTurn();
                }
            }
        },

        endTurn() {
            let currentUserId = this.getCurrentUser()
            this.isMyTurn = false;
            const gameId = this.$route.params.id;
            console.log(this.currentPlayer, currentUserId)
            SocketioService.endTurn(gameId,this.currentPlayer);
        },

        async setColor(color) {
            await SocketioService.changeColor(color)
            this.changeDivColor(color);
        },

        getGame(gameId) {
            fetchData('/game/' + gameId)
            .then(response => {
                this.game = response.data;
                console.log(this.game)
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
        updateUserGame() {
            patchData('/user/' + this.userId + '/game/' + this.game.id, {
                result: 'loose',
                date: new Date(),
            })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.error(error)
            })
        },
        copyToClipboard() {
            const code = this.game.code;
            navigator.clipboard.writeText(code)
            .then(() => {
            })
            .catch((error) => {
            });
        },
    },
}
</script>
<style scoped>



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
  background: gray; /* couleur de fond des cartes face cachée */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
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




</style>
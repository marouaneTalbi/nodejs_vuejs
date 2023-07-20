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
        <Modal v-if="userLeft" @close="toggleModal" @confirm="handleConfirm" :modalActive="modalActive">
            <div class="modal-content">
                <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 7 2 13h14l2-13-5 3-4-6-4 6-5-3z"></path><circle cx="12" cy="14" r="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle></svg>
                <h2>Victoire !</h2>
                <p>Votre adversaire a quitté la partie. Vous avez remporté la victoire !</p>
            </div>
        </Modal>
    </section>
</template>

<script>
import Header from '../components/Header.vue';
import SocketioService from '../services/socketio.service';
import Modal from '../components/Modal.vue';
import { ref } from 'vue';
import Cookies from 'js-cookie';
import { fetchData } from '../api/api'

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
            game: {},
        };
    },
    // beforeUnmount() {
    //     SocketioService.userLeft(() => {
    //             console.log('fg');
    //             this.userLeft = true;
    //             this.openModal();
    //         });  
    //     },
    beforeRouteLeave() {
        //const reply = window.confirm('You have unsaved changes! Do you want to leave?')
        SocketioService.userLeft(() => {
                this.userLeft = true;
                this.openModal();
            });
        // if (!reply) {
        //     return false
        // } else {
        //     SocketioService.userLeft(() => {
        //         this.userLeft = true;
        //         this.openModal();
        //     });
        // }
    },

    setup() {
        console.log('gameeee')
        const modalActive = ref(false);

        const toggleModal = () => {
            modalActive.value = !modalActive.value;
        }

        return { modalActive, toggleModal }
    },

    mounted() {
        const gameId = this.$route.params.id;
        this.getGame(gameId);
    },

    created() {
        this.getCurrentUser();

        SocketioService.waitingForPlayers((playersCount) => {
            console.log('gello')
            if (playersCount < 2) {
                this.waitingForOpponent = true;
                console.log('pas full')
            } else {
                this.waitingForOpponent = false;
                console.log('full')
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
            }

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
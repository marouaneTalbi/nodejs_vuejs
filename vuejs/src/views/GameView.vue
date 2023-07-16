<template>
    <section class="game">
        <Header />
        <h1>GAME</h1>
        <p v-if="waitingForOpponent">Adversaire en attente...</p>
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
import { fetchData } from '../api/api';
import Modal from '../components/Modal.vue';
import { ref } from 'vue';
import Cookies from 'js-cookie';

export default {
    components: {
        Header,
        Modal
    },

    data() {
        return {
            user: null,
            waitingForOpponent: false,
            userLeft: false,
        };
    },

    setup() {
        console.log('gameeee')
        const modalActive = ref(false);

        const toggleModal = () => {
            modalActive.value = !modalActive.value;
        }

        return { modalActive, toggleModal }
    },

    created() {
        this.getCurrentUser();

        SocketioService.waitingForPlayers((playersCount) => {
            console.log('ddd');
            if (playersCount < 2) {
                // Mettre à jour l'affichage pour afficher le message "En attente d'un adversaire"
                this.waitingForOpponent = true;
            } else {
                // Il y a suffisamment de joueurs, mettre à jour l'affichage en conséquence
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
            }
        },
        handleConfirm() {
            this.modalActive = false;
        },
        openModal() {
            this.modalActive = true;
        },
    },

    mounted() {
        
    },

    unmounted() {
    },
}
</script>
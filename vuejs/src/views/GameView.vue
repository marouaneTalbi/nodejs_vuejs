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
            userId: null,
            waitingForOpponent: false,
            userLeft: false,
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
        const modalActive = ref(false);

        const toggleModal = () => {
            modalActive.value = !modalActive.value;
        }

        return { modalActive, toggleModal }
    },

    created() {
        this.getCurrentUser();

        SocketioService.waitingForPlayers((playersCount) => {
            if (playersCount < 2) {
                this.waitingForOpponent = true;
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
            }
        },
        handleConfirm() {
            this.modalActive = false;
        },
        openModal() {
            this.modalActive = true;
        },
    },
}
</script>
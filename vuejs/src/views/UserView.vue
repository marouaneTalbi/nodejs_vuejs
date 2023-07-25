<template>
    <section class="user">
        <Header />
        <Modal @close="toggleModal" @confirm="handleConfirm" :modalActive="modalActive" :showConfirmButton="true">
            <div class="modal-content" v-if="currentModal === 'delete'">
                <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 15V7m0 8 5.504 3.145A1 1 0 0 0 20 17.277V4.723a1 1 0 0 0-1.496-.868L13 7m0 8h-3m3-8H7a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4v0m0 0v4.5A1.5 1.5 0 0 0 8.5 21v0a1.5 1.5 0 0 0 1.5-1.5V15m-3 0h3"></path></svg>
                <h2>Supprimer un utilisateur</h2>
                <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ? <br />Cette action est irréversible.</p>
            </div>
            <div class="modal-content" v-else-if="currentModal === 'edit'">
                <h2>Modifier le pseudo</h2>
                <form @submit.prevent="handleConfirm">
                    <input type="text" v-model="pseudo" placeholder="Pseudo" required>
                </form>
            </div>
        </Modal>

        <Modal @close="togglePopupModal" @confirm="handleConfirm" :modalActive="modalPopupActive" >
            <div class="modal-content"  v-if="currentPopupModal === 'skins'">
                <div class="card-list">
                    <div v-for="skin in skins" :key="skin.id" class="card">
                        <div class="card-image">
                            <img :src="getPictureUrl(skin.picture)" alt="" style=" object-fit: contain;">
                        </div>
                        <div class="card-content">
                        <h3>{{ skin.title }}</h3>
                        <button @click="assignSkin(skin)">choisir</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>  

        <div class="container">
            <div class="block">
                <div class="user-profile">
                    <div class="img"></div>
                    <div class="text">
                        <span class="pseudo">{{ user.pseudo }}</span>
                        <span>Online</span>
                    </div>
                </div>
                <div class="card">
                    <div class="row">
                        <div class="text">
                            <span class="pseudo-title">Pseudo</span>
                            <br />
                            <span class="pseudo">{{ user.pseudo }}</span>
                        </div>
                        <button @click="openModal('edit')">Edit</button>
                    </div>
                    <div class="row">
                        <div class="text">
                            <span class="pseudo-title">Email</span>
                            <br />
                            <span class="pseudo">{{ user.mail }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="text">
                            <span class="pseudo-title">Creation date</span>
                            <br />
                            <span class="pseudo">{{ user.createdat ? formatDate(user.createdat) : '14/07/21' }}</span>
                        </div>
                    </div>
                    <div class="row" >
                        <div class="text">
                            <span class="pseudo-title">Coins</span>
                            <br />
                            <span class="pseudo">{{ user?.coins  ? user?.coins  : 0}}</span>
                        </div>
                    </div>
                    <div class="row" v-if="skin && skin.title != undefined">
                        <div class="text">
                            <span class="pseudo-title">Skin</span>
                            <br />
                            <span class="pseudo">{{ skin?.title }}</span>
                        </div>
                    </div>
                </div>

                <div class="card card--footer">
                    <div class="row">
                        <div class="text">
                            <span class="pseudo-title">Messages</span>
                            <br />
                            <span class="pseudo">Consulter les messages de {{ user.pseudo }}</span>
                        </div>
                    </div>
                    <div class="footer">
                        Voir les messages
                        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 12-6-6m6 6-6 6m6-6H5"></path></svg>
                    </div>

                    <div class="footer" @click="openModal('skins')"  v-if="skin && skin.title != undefined">
                        Voir mes skins
                        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 12-6-6m6 6-6 6m6-6H5"></path></svg>
                    </div>
                </div>

                <button @click="openModal('delete')">
                    Supprimer l'utilisateur
                </button>
            </div>
        </div>
    </section>
</template>

<script>
import { fetchData, deleteData, patchData, postData, serverURI } from '../api/api';
import Header from '../components/Header.vue';
import Modal from '../components/Modal.vue';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    name: 'User',
    components: {
        Header,
        Modal
    },
    setup() {
        const modalActive = ref(false);
        const pseudo = ref('');

        const toggleModal = () => {
            modalActive.value = !modalActive.value;
        }
        const modalPopupActive = ref(false);
        const togglePopupModal = () => {
            modalPopupActive.value = !modalPopupActive.value;
        }


        return { modalActive, toggleModal, currentModal: null, pseudo, modalPopupActive, togglePopupModal, currentPopupModal: null}
    },
    data() {
        return {
            user: {},
            skin: {},
            skins:[]
        };
    },
    mounted() {
        const userId = this.$route.params.id;
        this.getUser(userId);
        this.getUserSkins(userId);
        this.getUserSkin(userId);
    },
    methods: {
        getUser(userId) {
            fetchData('/user/' + userId)
            .then(response => {
                this.user = response.data
                this.pseudo = response.data.pseudo;
            })
            .catch(error => {
            });
        },
        getPictureUrl(picture) {
            return `${serverURI}/pictures/skins/${picture}`;
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        getUserSkins(userId) {
            fetchData('/user/skins/' + userId)
            .then(response => {
                this.skins = response.data

            })
            .catch(error => {
            });
        },
        assignUserSkin(data, userId) {
            postData('/skin/assign', data)
            .then(response => {
                toast('Skin vous a bien été affecter', {
                    autoClose: 2000,
                    type: 'success'
                })
                this.getUser(userId);

            })
            .catch(error => {
                toast(error.message, {
                    autoClose: 2000,
                    type: 'error',
                })
            });
            this.closeModal() 

        },
        assignSkin(skin){
            const newSkin = {
                userId: this.$route.params.id,
                skinId: skin.id,
            };
            this.assignUserSkin(newSkin, this.$route.params.id)
        },
        getUserSkin(userId){
            fetchData('/user/skin/' + userId)
            .then(response => {
                this.skin = response.data
            })
        },
        deleteUser(userId) {
            deleteData('/user/', userId)
            .then(response => {
                toast('L\'utilisateur a bien été supprimé', {
                    autoClose: 2000,
                    type: 'success'
                })
            })
            .catch(error => {
                toast(error.message, {
                    autoClose: 2000,
                    type: 'error',
                })
            });
        },
        updateUser(userId, data) {
            patchData('/user/' + userId, data)
            .then(response => {
                toast('Le pseudo a bien été modifié', {
                    autoClose: 2000,
                    type: 'success'
                })
                this.user.pseudo = this.pseudo;
            })
            .catch(error => {
                toast(error.message, {
                    autoClose: 2000,
                    type: 'error',
                })
            })
        },
        openModal(type) {
      
            if(type == 'skins') {
                this.modalPopupActive = true
                this.currentPopupModal = type
            } else {
                this.modalActive = true;
                this.currentModal = type;
            }
        },
        handleConfirm() {
            const userId = this.$route.params.id;

            if(this.currentModal == 'delete') {
                // console.log(userId)
                this.deleteUser(userId);
                this.$router.push('/admin');
            }

            if(this.currentModal == 'edit') {
                this.updateUser(userId, { pseudo: this.pseudo })
            }
            this.closeModal();
        },
        closeModal() {
            this.modalActive = false;
        }
    }
};
</script>
<style scoped>
.card-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.card {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 4px;
  width: 20%;
  margin: 10px;
}

.card-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.card-image img {
  max-width: 100%;
  max-height: 100%;
}

.card-content {
  text-align: center;
}
</style>
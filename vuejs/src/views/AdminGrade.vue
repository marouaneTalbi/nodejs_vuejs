<template>
  <section class="user">
    <Header />
    <Modal @close="toggleModal" @confirm="handleConfirm" :modalActive="modalActive">
      <div class="modal-content" v-if="currentModal === 'delete'">
        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 15V7m0 8 5.504 3.145A1 1 0 0 0 20 17.277V4.723a1 1 0 0 0-1.496-.868L13 7m0 8h-3m3-8H7a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4v0m0 0v4.5A1.5 1.5 0 0 0 8.5 21v0a1.5 1.5 0 0 0 1.5-1.5V15m-3 0h3"></path></svg>
        <h2>Supprimer un Grade</h2>
        <p>Êtes-vous sûr de vouloir supprimer ce Grade ? <br />Cette action est irréversible.</p>
      </div>
      <div class="modal-content" v-if="currentModal === 'editTitle'">
        <h2>Modifier le Titre</h2>
        <form @submit.prevent="handleConfirm">
          <input type="text" v-model="title" placeholder="Titre" required>
        </form>
      </div>
      <div class="modal-content" v-if="currentModal === 'editPoints'">
        <h2>Modifier les Points requis</h2>
        <form @submit.prevent="handleConfirm">
          <input type="text" v-model="required_points" placeholder="Required points" required>
        </form>
      </div>
      <div class="modal-content" v-if="currentModal === 'editPicture'">
        <h2>Modifier la Photo</h2>
        <form @submit.prevent="handleConfirm">
          <div style="display: flex; justify-content: center;flex-direction: column; align-items: center;">
            <img :src="getPictureUrl(picture)" alt="" style="height: 200px; width: 200px; object-fit: contain;">
            <input type="file" style="color:white" id="picture" @change="handlePictureChange" placeholder="Photo" required>
          </div>
        </form>
      </div>
    </Modal>
    <div class="container">
      <div class="block">
        <div class="card">
          <div class="row">
            <div class="text">
              <span class="pseudo-title">Titre</span>
              <br />
              <span class="pseudo">{{ grade.title }}</span>
            </div>
            <button @click="openModal('editTitle')">Edit</button>
          </div>
          <div class="row">
            <div class="text">
              <span class="pseudo-title">Required Points</span>
              <br />
              <span class="pseudo">{{ grade.required_points }}</span>
            </div>
            <button @click="openModal('editPoints')">Edit</button>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
            <div class="text" >
              <br />
              <img :src="getPictureUrl(grade.picture)" alt="" style="height: 200px; width: 200px; object-fit: contain;">
            </div>
            <button @click="openModal('editPicture')">Edit</button>
          </div>
        </div>

        <div style="display:flex; justify-content: space-around;width: 100%;">
          <button @click="openModal('delete')">
            Supprimer le Grade
          </button>
          <button class="closebutton" @click="closeModalAndGoBack">Fermer</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { fetchData, deleteData, patchData, serverURI } from '../api/api';
import Header from '../components/Header.vue';
import Modal from '../components/Modal.vue';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'AdminGrade',
  components: {
    Header,
    Modal
  },
  setup() {
    const modalActive = ref(false);
    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    }

    return { modalActive, toggleModal, currentModal: null}
  },
  data() {
    return {
      grade: {},
    };
  },
  mounted() {
    const gradeId = this.$route.params.id;
    this.getGrade(gradeId);
  },
  methods: {
    getPictureUrl(picture) {
      return `${serverURI}/pictures/gradeS/${picture}`;

    },
    handlePictureChange(event) {
      const selectedFile = event.target.files[0];
      this.base64func(selectedFile).then((f) => {
        this.picture = f
      })
    },
    getGrade(gradeId) {
      fetchData('/grade/' + gradeId)
          .then(response => {
            this.grade = response.data
            this.title = this.grade.title
            this.required_points = this.grade.required_points
            this.picture = this.grade.picture
          })
          .catch(error => {
          });
    },
    base64func (blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.readAsDataURL(blob)
      })
    },
    deleteGrade(gradeId) {
      deleteData('/grade/delete/', gradeId)
          .then(response => {
            toast('Le grade a bien été supprimé', {
              autoClose: 2000,
              type: 'success'
            })
            this.$router.push('/admin/grades')
          })
          .catch(error => {
            toast(error.message, {
              autoClose: 2000,
              type: 'error',
            })
          });
    },
    updateGrade(gradeId, data) {
      patchData('/grade/update/' + gradeId, data)
          .then(response => {
            toast('Le grade a bien été modifié', {
              autoClose: 2000,
              type: 'success'
            })
            this.grade.title = this.title
            this.grade.required_points = this.required_points
            this.grade.picture =this.picture

          })
          .catch(error => {
            toast(error.message, {
              autoClose: 2000,
              type: 'error',
            })
          })
    },
    openModal(type) {
      this.modalActive = true;
      this.currentModal = type;
    },
    handleConfirm() {
      const gradeId = this.$route.params.id;

      if (this.currentModal === 'delete') {
        this.deleteGrade(gradeId);
      } else if (this.currentModal === 'editTitle') {
        const updatedData = {
          title: this.title
        };
        this.updateGrade(gradeId, updatedData);
      } else if (this.currentModal === 'editPoints') {
        const updatedData = {
          required_points: this.required_points
        };
        this.updateGrade(gradeId, updatedData);
      } else if (this.currentModal === 'editPicture') {
        const updatedData = {
          picture: this.picture
        };
        this.updateGrade(gradeId, updatedData);
      }

      this.closeModal();
    },
    closeModalAndGoBack() {
      this.closeModal();
      this.$router.push('/admin/grades');
    },
    closeModal() {
      this.modalActive = false;
    }
  }
};
</script>

<style>
.closebutton{
  height: 40px;
  width: 140px;
  margin: 20px;

}
</style>


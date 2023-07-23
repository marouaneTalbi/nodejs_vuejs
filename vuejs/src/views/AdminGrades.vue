<template>
  <section class="dashboard">
    <Header />
    <div class="container">
      <div class="user-list" >
        <div style="display:flex; align-items: center; justify-content: space-between;">
          <h5>Grades</h5>
          <button @click="openModal('createGrade')" style="height: 30px; width: 100px; text-align: center;">Creer</button>
        </div>
        <table>
          <colgroup span="4"></colgroup>
          <tr class="header">
            <th>TITLE</th>
            <th>Required Points</th>
            <th>PICTURE</th>
            <th>ACTION</th>
          </tr>
          <tr v-for="grade in grades" :key="grade._id" class="user-row">
            <td style="text-align: left;" class="status" >  {{ grade.title }}</td>
            <td style="text-align: center;" class="status">{{ grade.required_points }}</td>
            <td style="text-align: center;" class="status">
              <img :src="getPictureUrl(grade.picture)" alt="" style="height: 100px; width: 100px; object-fit: contain;">
            </td>
            <td style="text-align: right;" class="action">
              <router-link :to="{ name: 'AdminGrade', params: { id: grade.id } }">View</router-link>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <Modal @close="toggleModal" @confirm="handleConfirm" :modalActive="modalActive" >
      <div class="modal-content" v-if="currentModal === 'createGrade'">
        <h2 style="color: white;">Créer le Grade</h2>
        <form @submit.prevent="handleConfirm">
          <div class="form-group">
            <label for="title">Titre</label>
            <input type="text" style="color:white" v-model="title" id="title" placeholder="Titre" required>
          </div>

          <div class="form-group" >
            <label for="picture" >Photo</label>
            <input type="file" style="color:white" id="picture" @change="handlePictureChange" placeholder="Photo" required>
          </div>

          <div class="form-group">
            <label for="required_points">Required Points</label>
            <input type="number" style="color:white"  v-model="required_points" id="required_points" placeholder="Required Points" required>
          </div>
          <button type="submit">Créer</button>
        </form>
      </div>
    </Modal>
  </section>
</template>

<script>
import { fetchData, postData, serverURI } from '../api/api';
import Header from '../components/Header.vue';
import Modal from '../components/Modal.vue';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  components: {
    Header,
    Modal
  },
  setup() {
    const modalActive = ref(false);
    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    }
    const isValidPrice = ref(true);
    return { modalActive, toggleModal, currentModal: null, isValidPrice}
  },
  data() {
    return {
      grades: [],
      title: '',
      required_points: '',
      picture: null,
      base64: null
    };
  },
  mounted() {
    this.getGrades();
  },
  methods: {
    getPictureUrl(picture) {
      return `${serverURI}${picture}`;

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
    getGrades() {
      fetchData('/grades')
          .then(response => {
            this.grades = response.data
          })
          .catch(error => {
            console.error(error);
          });
    },

    handlePictureChange(event) {
      const selectedFile = event.target.files[0];
      this.base64func(selectedFile).then((f) => {
        this.picture = f
      })
    },
    createGrade(data) {
      postData('/grade/create', data)
          .then(response => {
            toast('Le Grade a bien été Creer', {
              autoClose: 2000,
              type: 'success'
            })
            this.getGrades();
          })
          .catch(error => {
            toast(error.message, {
              autoClose: 2000,
              type: 'error',
            })
          });
    },
    openModal(type) {
      this.modalActive = true;
      this.currentModal = type;
    },

    handleConfirm() {
      if (this.title === '' || this.required_points === '') {
        toast('Veuillez remplir tous les champs.', {
          autoClose: 2000,
          type: 'error',
        });
        return;
      }
      const newGrade = {
        title: this.title,
        required_points: this.required_points,
        picture: this.picture
      };
      this.createGrade(newGrade);
      this.closeModal();
    },
    closeModal() {
      this.modalActive = false;
    }
  },
};
</script>
<style scoped>
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
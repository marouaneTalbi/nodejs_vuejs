 <template>
  <section class="dashboard">
    <Header />
      <Modal @close="toggleModal" @confirm="handleConfirm" :modalActive="modalActive">
      <div class="modal-content" v-if="currentModal === 'createSkin'">
        <h2 style="color: white;">Créer le Skin</h2>
        <form @submit.prevent="handleConfirm">
          <div class="form-group">
            <label for="title">Titre</label>
            <input type="text" style="color:white" v-model="title" id="title" placeholder="Titre" required>
          </div>
          <div class="form-group">
            <label for="price">Prix</label>
            <input type="text" style="color:white" v-model="price" id="price" placeholder="Prix" required>
            <p v-if="!isValidPrice" class="error-message">Veuillez entrer une valeur numérique pour le prix.</p>
          </div>
       
          <div class="form-group" >
            <label for="picture" >Photo</label>
            <input type="file" style="color:white" id="picture" @change="handlePictureChange" placeholder="Photo" required>
          </div>

          <div class="form-group">
            <label for="money_type">Type de monnaie</label>
            <input type="text" style="color:white" v-model="money_type" id="money_type" placeholder="Type de monnaie" required>
          </div>
          <!-- <button type="submit">Créer</button> -->
        </form>
      </div>
    </Modal>

    <div class="container">
      <div class="user-list" v-if="!modalActive">
        <div style="display:flex; align-items: center; justify-content: space-between;">
          <h5>skins</h5>
          <button @click="openModal('createSkin')" style="height: 30px; width: 10px; text-align: center;">Creer</button>
        </div>
        <table>
          <colgroup span="4"></colgroup>
          <tr class="header">
            <th>TITLE</th>
            <th >PRICE</th>
            <th>MONEY TYPE</th>
            <th>PICTURE</th>
            <th>ACTION</th>
          </tr>
          <tr v-for="skin in skins" :key="skin._id" class="user-row">
            <td style="text-align: left;" class="status" >  {{ skin.title }}</td>
            <td style="text-align: center;" class="status">  {{ skin.price }}</td>
            <td style="text-align: center;" class="status">{{ skin.money_type }}</td>
            <td style="text-align: center;" class="status">{{ skin.picture }}</td>
            <td style="text-align: right;" class="action">
              <router-link :to="{ name: 'skin', params: { id: skin.id } }">View</router-link>
            </td>
          </tr>
        </table>
      </div>      
    </div>
  </section>
</template>  

<script>
import { fetchData, postData } from '../api/api';
import Header from '../components/Header.vue';
import Modal from '../components/Modal.vue';
import slugify from 'slugify';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axios from 'axios';    

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
      skins: [],
      title: '',
      price: '',
      money_type: '',
      picture: null
    };
  },
  mounted() {
    const e = this.getSkins();
  },
  methods: {
    getSkins() {
      fetchData('/skins')
      .then(response => {
        this.skins = response.data
      })
      .catch(error => {
      });
    },
    createSkin(data) {
      postData('/skin/create', data)
      .then(response => {
          toast('Le Skin a bien été Creer', {
              autoClose: 2000,
              type: 'success'
          })
          this.getSkins();
      })
      .catch(error => {
          toast(error.message, {
              autoClose: 2000,
              type: 'error',
          })
      });
    },
    handlePictureChange(event) {
    const selectedFile = event.target.files[0].name;
    
    this.picture = selectedFile;
    },
    openModal(type) {
      this.modalActive = true;
      this.currentModal = type;
    },
    handleConfirm() {
      if (this.title === '' || this.price === '') {
        toast('Veuillez remplir tous les champs.', {
          autoClose: 2000,
          type: 'error',
        });
        return;
      }

      const newSkin = {
        title: this.title,
        price: this.price,
        money_type: this.money_type,
        picture: this.picture
      };

      if (isNaN(parseFloat(newSkin.price))) {
        this.isValidPrice = false;
        return;
      }

      this.isValidPrice = true;

      this.createSkin(newSkin);
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
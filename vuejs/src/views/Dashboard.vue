<template>
  <section class="dashboard">
    <Header />
    <div class="container">
      <!-- <h3>Administration <span>/ All</span></h3> -->
      <div class="user-list">
        <h5>Users</h5>
        <table>
          <colgroup span="4"></colgroup>
          <tr class="header">
            <th>AUTHOR</th>
            <th v-if="showStatus">STATUS</th>
            <th v-if="showCreationDate">CREATION DATE</th>
            <th>ACTION</th>
          </tr>
          <tr v-for="user in users" :key="user._id" class="user-row">
            <td style="text-align: left;" class="info">
              <div class="img"></div>
                <span class="pseudo">{{ user.pseudo }}</span>
                <span class="mail">{{ user.mail }}</span>
            </td>
            <td style="text-align: center;" class="status" v-if="showStatus">Online</td>
            <td style="text-align: center;" class="date" v-if="showCreationDate">{{ formatDate(user.createdat) }}</td>
            <td style="text-align: right;" class="action">
              <router-link :to="{ name: 'user', params: { id: user._id } }">View</router-link>
              <!-- <router-link :to="{ name: 'user', params: { slug: generateSlug(user.pseudo) } }">View</router-link> -->
            </td>
          </tr>
        </table>
      </div>      
    </div>
  </section>
</template>

<script>
import { fetchData } from '../api/api';
import Header from '../components/Header.vue';
import slugify from 'slugify';

export default {
  components: {
    Header,
  },
  data() {
    return {
      users: [],
      showStatus: true,
      showCreationDate: true
    };
  },
  mounted() {
    this.getUsers();
    window.addEventListener('resize', this.checkScreenWidth);
    this.checkScreenWidth();
  },
  destroyed() {
    window.removeEventListener('resize', this.checkScreenWidth);
  },
  methods: {
    getUsers() {
      fetchData('/users')
      .then(response => {
        console.log(response.data)
        this.users = response.data
      })
      .catch(error => {
      });
    },
    generateSlug(pseudo) {
      const options = {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
      };
      return slugify(pseudo, options);
    },
    checkScreenWidth() {
      this.showStatus = window.innerWidth >= 850;
      this.showCreationDate = window.innerWidth >= 850; 
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const formattedDate = date.toISOString().split('T')[0];
      return formattedDate;
    },
  }
};
</script>
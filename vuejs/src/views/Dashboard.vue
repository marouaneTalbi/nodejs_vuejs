<template>
  <section class="dashboard">
    <NavBar />
    <div class="container">
      <h3>Administration <span>/ All</span></h3>
      <div class="user-list">
        <h5>Users</h5>
        <table>
          <colgroup span="4"></colgroup>
          <tr class="header">
            <th>AUTHOR</th>
            <th>STATUS</th>
            <th>CREATION DATE</th>
            <th>ACTION</th>
          </tr>
          <tr v-for="user in users" :key="user._id" class="user-row">
            <td style="text-align: left;" class="info">
              <div class="img"></div>
                <span class="pseudo">{{ user.pseudo }}</span>
                <span class="mail">{{ user.mail }}</span>
            </td>
            <td style="text-align: center;">Online</td>
            <td style="text-align: center;" class="date">14/06/21</td>
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
import NavBar from '../components/NavBar.vue';
import slugify from 'slugify';

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      users: []
    };
  },
  mounted() {
    this.getUsers();
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
  }
  }
};
</script>
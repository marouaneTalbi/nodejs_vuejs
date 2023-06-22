<template>
  <section class="dashboard">
    <Navbar />
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
          <tr v-for="user in users" :key="user.id" class="user-row">
            <td style="text-align: left;" class="info">
              <div class="img"></div>
                <span class="pseudo">{{ user.pseudo }}</span>
                <span class="mail">{{ user.mail }}</span>
            </td>
            <td style="text-align: center;">Online</td>
            <td style="text-align: center;" class="date">14/06/21</td>
            <td style="text-align: right;" class="action">View</td>
          </tr>
        </table>
      </div>      
      <!-- <ul>
        <li v-for="user in users" :key="user.id" style="height: 200px;">
          {{ user.pseudo }}
        </li>
      </ul> -->
    </div>
  </section>
</template>

<script>
import { fetchAllData } from '../api/api';
import Navbar from '../components/NavBar.vue';

export default {
  components: {
    Navbar,
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
      fetchAllData('/users')
      .then(response => {
        console.log(response.data)
        this.users = response.data
      })
      .catch(error => {
      });
    }
  }
};
</script>
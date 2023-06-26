<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      try {
        const token = localStorage.getItem('token');
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;
        /*const token = localStorage.getItem('token');
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.id;*/
        const response = await axios.get(`http://localhost:3000/user/${userId}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });
        this.user = response.data;
        console.log(this.user);
      } catch (error) {
        console.error(error);
      }
    }
  }
};

</script>



<style scoped>
.account {
  margin: 20px;
}

.user-info {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}
</style>

<template>
  <div class="account">
    <h2>Mon compte</h2>
    <div class="user-info" v-if="user">
      <p><strong>Nom d'utilisateur:</strong> {{ user.pseudo }}</p>
      <p><strong>Email:</strong> {{ user.mail }}</p>
      <p><strong>Date de création:</strong> {{ user.createdAt }}</p>
    </div>
  </div>
</template>



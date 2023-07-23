<template>
  <section class="dashboard">
    <Header />
    <div class="container">
      <div class="user-list" >
        <div style="text-align: center">
          <h5>Grade</h5>
          <div v-if="grade" class="user-row">
            <p style="text-align: center;" class="status" >  {{ grade.title }}</p>
            <p style="text-align: center;" class="status">Required Points : {{ grade.required_points }}</p>
            <div style="text-align: center;margin-top:30px" class="status">
              <img :src="getPictureUrl(grade.picture)" alt="" style="height: 200px; width: 200px; object-fit: contain;">
            </div>
            <p style="text-align: center;" class="status" >Your Points : {{ points }}</p>
            <div style="display: flex; margin-top:30px;flex-wrap: wrap;">
              <div v-for="grade in grades" :key="grade.id" style="margin: 10px;flex-basis: 7.2%">
                <div style="text-align: center;margin-top:30px" class="status">
                  <img :src="getPictureUrl2(grade.picture)" alt="" style="height: 100px; width: 100px; object-fit: contain;">
                </div>
                <p>{{ grade.title }}</p>
                <p>Required Points: {{ grade.required_points }}</p>
              </div>
            </div>
            <div v-if="topGamers.length > 0" style="margin-top: 50px">
              <h5>Top 10 Gamers</h5>
              <div  class="top-gamer">
                <table>
                  <colgroup span="4"></colgroup>
                  <tr class="header">
                    <th>Pseudo</th>
                    <th >Points</th>
                    <th>Grade</th>
                  </tr>
                  <tr v-for="gamer in topGamers" :key="gamer.id" class="user-row">
                    <td style="text-align: left;" class="status" >  {{  gamer.pseudo }}</td>
                    <td style="text-align: center;" class="status">  {{ gamer.points }}</td>
                    <td style="text-align: center;" class="status">{{ gamer.grade }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div v-else>
            <h5>Vous n'êtes pas encore classé.</h5>
            <button style="width: auto;color:white"> <router-link :to="{ name: 'gamemode'}">Play Now</router-link></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { fetchData, postData, serverURI } from '../api/api';
import Header from '../components/Header.vue';
import 'vue3-toastify/dist/index.css';
import Cookies from "js-cookie";

export default {
  components: {
    Header
  },
  data() {
    return {
      grades: [],
      title: '',
      grade: '',
      points: '',
      required_points: '',
      picture: null,
      base64: null,
      topGamers: [],
    };
  },
  mounted() {
    this.getGrade();
    this.getGrades();
    this.getTopGamers();
  },
  methods: {
    getPictureUrl(picture) {
      return `${serverURI}/pictures/grades/${picture}`;

    },
    getPictureUrl2(picture) {
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
    getGrade() {
      const token = Cookies.get('token');
      const [header, payload, signature] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      const userId = decodedPayload.id;
      fetchData(`/grade/${userId}`)
          .then(response => {
            const { points, grade } = response.data;
            this.grade = grade;
            this.points = points;
          })
          .catch(error => {
            console.error(error);
          });
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
    getTopGamers() {
      fetchData('/top-gamers')
          .then(response => {
            this.topGamers = response.data;
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
p{
  color: white;
}
</style>
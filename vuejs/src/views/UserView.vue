<template>
    <section class="user">
        <NavBar />
        <div class="container">
            <h3>Administration / user <span>/ {{ user.pseudo }}</span></h3>
            <div class="user-profile">
                <div class="infos">
                    <div class="img"></div>
                    <div class="text">
                        <span class="pseudo">{{ user.pseudo }}</span>
                        <br />
                        <span class="mail">{{ user.mail }}</span>
                    </div>
                </div>
                <div class="buttons">

                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { fetchData } from '../api/api';
import NavBar from '../components/NavBar.vue';

export default {
    name: 'User',
    components: {
        NavBar,
    },
    data() {
        return {
            user: {}
        };
    },
    mounted() {
        const userId = this.$route.params.id;
        this.getUser(userId);
    },
    methods: {
        getUser(userId) {
            fetchData('/user/' + userId)
            .then(response => {
                console.log(response.data)
                this.user = response.data
            })
            .catch(error => {
            });
        },
    }
};
</script>

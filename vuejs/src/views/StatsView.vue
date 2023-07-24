<template>
    <section class="stats">
        <Header />
        <div class="container">
            <section class="global-stats">
                <div class="card">
                    <h3>RANK</h3>
                    <strong>soon..</strong>
                </div>
                <div class="card">
                    <h3>NOMBRE DE GAME</h3>
                    <strong>{{ stats.totalGames }}</strong>
                </div>
                <div class="card">
                    <h3>VICTOIRE</h3>
                    <strong>{{ stats.totalVictories }}</strong>
                    <p v-if="stats.winRate !== undefined">Win rate : <span class="win">{{  stats.winRate.toFixed(2) }}%</span></p>
                </div>
                <div class="card">
                    <h3>DEFAITE</h3>
                    <strong>{{ stats.totalDefeats }}</strong>
                    <p v-if="stats.loseRate !== undefined">Lose rate : <span class="win win--lose">{{  stats.loseRate.toFixed(2) }}%</span></p>
                </div>
            </section>
            <h2>Historique des parties</h2>
            <ul class="game-history">
                <li v-for="game in gamesHistory" :key="game._id">
                    <div class="left">
                        <div class="header">
                            <div v-if="game.result == 'loose'" class="result result--lose">Défaite</div>
                            <div v-if="game.result == 'win'" class="result">Victoire</div>
                            <div v-if="game.result == 'equality'" class="result result--equality">Egalité</div>
                            <span>+ 100 ELO</span>
                        </div>
                        <div>
                            <time>{{ formatDate(game.date) }}</time>
                            |
                            <span>{{ game._id }}</span>
                        </div>
                    </div>
                    <p class="right">view</p>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import Header from '../components/Header.vue';
import { fetchData } from '../api/api';
import Cookies from 'js-cookie';

export default {
    components: {
        Header,
    },

    data() {
        return {
            stats: {},
            gamesHistory: [],
        };
    },

    mounted() {
        const token = Cookies.get('token');
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;
        this.getUserStats(userId);
        this.getUserGamesHistory(userId);
    },

    methods: {
        getUserStats(userId) {
            fetchData('/user/' + userId + '/stats')
            .then(response => {
                this.stats = response.data.stats
                console.log(response.data.stats)
                console.log('stats : ', this.stats)
            })
            .catch(error => {
            });
        },
        getUserGamesHistory(userId) {
            fetchData('/user/' + userId + '/games-history')
            .then(response => {
                this.gamesHistory = response.data
                console.log(this.gamesHistory)
            })
            .catch(error => {
            });
        },
        formatDate(value) {
            const dateObj = new Date(value);
            return dateObj.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },
    }
};
</script>
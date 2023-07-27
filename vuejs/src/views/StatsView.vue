<template>
    <section class="stats">
        <Header />
        <div class="container">
            <section class="global-stats">
                <div class="card">
                    <h3>RANK</h3>
                    <strong>{{ grade.title }}</strong>
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
                            <template v-if="game.gamemode == 'ranked'">
                                <span v-if="game.result == 'loose'" > {{ game.pointswin }} ELO</span>
                                <span v-if="game.result == 'win'" >+ {{ game.pointswin }} ELO</span>
                                <span v-if="game.result == 'equality'" >+ 0 ELO</span>
                            </template>
                        </div>
                        <div>
                            <time>{{ formatDate(game.date) }}</time>
                            
                            <span class="gameId"><span class="bar">|</span> {{ game._id }}</span>
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
import { fetchData, serverURI } from '../api/api';
import Cookies from 'js-cookie';

export default {
    components: {
        Header,
    },

    data() {
        return {
            stats: {},
            gamesHistory: [],
            grade: {},
        };
    },

    mounted() {
        const token = Cookies.get('token');
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;
        this.getUserStats(userId);
        this.getUserGamesHistory(userId);
        this.getUserGrade(userId);
    },

    methods: {
        getUserGrade(userId) {
            fetchData('/user/' + userId + '/grade')
            .then(response => {
                this.grade = response.data['grade']
                console.log(this.grade)
            })
            .catch(error => {
                toast(error.message, {
                autoClose: 2000,
                type: 'error',
                })
            });
        },
        getGradeUrl(picture) {
            return `${serverURI}/pictures/grades/${picture}`;
        },
        getUserStats(userId) {
            fetchData('/user/' + userId + '/stats')
            .then(response => {
                this.stats = response.data.stats
            })
            .catch(error => {
            });
        },
        getUserGamesHistory(userId) {
            fetchData('/user/' + userId + '/games-history')
            .then(response => {
                this.gamesHistory = response.data
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
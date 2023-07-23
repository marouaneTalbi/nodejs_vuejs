import { io } from 'socket.io-client';
import router from '../router/index.ts';
import {  serverURI } from '../api/api';

class SocketioService {
    socket;
    constructor() {}
    
    setupSocketConnection() {
        this.socket = io(serverURI);
    }

    joinWaitingRoom(gamemode, userId, code) {
        this.socket.emit('joinWaitingRoom', { gamemode, userId, code });
    }

    joinPrivateGameError(callback) {
        this.socket.on('joinPrivateGameError', (error) => {
            console.log('ggggg')
          callback(error);
        });
      }

    changedColor(callback) {
        this.socket.on('colorChanged', (color) => {
            console.log(color)
            callback(color);
        });
    }

    changeColor(color) {
        this.socket.emit('changeColor', color);
    }

    ////////////////////////

    opponentCardFlipped(callback) {
        this.socket.on('opponentCardFlipped',(index) => {
            callback(index);
        });
    }


    flipedCard(currentGameId, index) {
        this.socket.emit('cardFlipped', { gameId: currentGameId, cardIndex: index });
    }

    endTurn(currentGameId, userId, cards) {
        this.socket.emit('endTurn', { gameId: currentGameId, userId: userId, cards: cards});
    }
    
    onYourTurn(callback){
        this.socket.on('yourTurn',(d) => {
            callback(d);
        });
    }



    ////////////////////////


    waitingForPlayers(callback) {
        this.socket.on('waitingForPlayers', (playersCount) => {
            callback(playersCount);
        });
    }

    joinGameSucces() {
        this.socket.on('joinGameSucces', (gameId) => {
            console.log(router);
            router.push(`/game/${gameId}`);
        });
    }

    userLeft(callback) {
        this.socket.on('userLeft', callback);
    }
    
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}



export default new SocketioService();
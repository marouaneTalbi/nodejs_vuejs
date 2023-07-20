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
import { io } from 'socket.io-client';
import router from '../router/index.ts';

class SocketioService {
    socket;
    constructor() {}
    
    setupSocketConnection() {
        this.socket = io('http://localhost:3000');
    }

    joinWaitingRoom(gamemode, userId) {
        this.socket.emit('joinWaitingRoom', { gamemode, userId });
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
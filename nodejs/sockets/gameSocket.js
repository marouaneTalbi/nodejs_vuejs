const GameController = require('../controllers/GameController');
const UserGameService = require('../services/userGameService');

module.exports = function (socket) {
    socket.on('joinWaitingRoom', async ({gamemode, userId}) => {
        try {
            const game = await GameController.createGame(gamemode, userId);
            console.log(userId);
            socket.userId = userId;
            socket.gameId = game.id;

            socket.join(game.id);

            socket.emit('joinGameSucces', game.id);

            const playersCount = await UserGameService.UsersInGame(game.id);

            if (playersCount === 2) {
                socket.to(game.id).emit('waitingForPlayers', playersCount);
            } else {
                socket.emit('waitingForPlayers', playersCount);
            }

        } catch (error) {

            console.error('Erreur lors de la recherche ou de la création du jeu :', error);

        }
    });

    socket.on('disconnect', async () => {
        try {
            //await UserGameService.deleteUserGame(socket.gameId, socket.userId);
            socket.to(socket.gameId).emit('userLeft');
        } catch (error) {
            console.error('Erreur lors de la gestion de la déconnexion du joueur :', error);
        }
    });
};
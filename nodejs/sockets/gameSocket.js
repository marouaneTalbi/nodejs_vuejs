const GameController = require('../controllers/GameController');
const UserGameController = require('../controllers/UserGame/UserGameController');

module.exports = function (socket) {
    socket.on('joinWaitingRoom', async ({gamemode, userId, code}) => {
        try {


            let game
            
            if(code != null && gamemode == "private") {

                game = await GameController.findGameByCode(code);

                if (game === null) {
                    socket.emit('joinPrivateGameError', 'Code invalide. Partie privée non trouvée.');
                    return;
                }

                await UserGameController.createUserGame(game.id, userId);

            } else {

                game = await GameController.createGame(gamemode, userId);
                
            }

            socket.userId = userId;
            socket.gameId = game.id;
            socket.join(game.id);
            socket.emit('joinGameSucces', game.id);

            const playersCount = await UserGameController.UsersInGame(game.id);
            
            if (playersCount === 2) {

                socket.to(game.id).emit('waitingForPlayers', playersCount);

                await GameController.updateGame(game.id, {
                    status: 'progress'
                })

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
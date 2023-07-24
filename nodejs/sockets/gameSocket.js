const GameController = require('../controllers/GameController');
const UserGameController = require('../controllers/UserGame/UserGameController');

module.exports = function (socket) {

    let players = []
    let gamesPlayers = {};
    socket.on('joinWaitingRoom', async ({gamemode, userId, code}) => {


        try {

            let game;

   
           
            
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

                players = await  UserGameController.PlayersOfGame(socket.gameId)

                socket.emit('yourTurn', players[1] );
            
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

    socket.on('changeColor', async (color) => {
        try {
            socket.emit('colorChanged', color);
            socket.to(socket.gameId).emit('colorChanged', color);
            socket.broadcast.emit('changeColor', color);

        } catch (error) {
            console.error('Erreur lors du changement de couleur:', error);
        }
    });


    socket.on('cardFlipped', (data) => {
        socket.to(socket.gameId).emit('opponentCardFlipped', data.cardIndex);
    });

    socket.on('endTurn', (data) => {
        const playerId = data.userId;
        let turnId;
        UserGameController.PlayersOfGame(socket.gameId).then((c) => {

            if(data.userId == c[0] ){
                turnId = c[1]
            } else if( data.userId == c[1]) {
                turnId = c[0]
            }

            socket.to(socket.gameId).emit('yourTurn', turnId);
        })
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
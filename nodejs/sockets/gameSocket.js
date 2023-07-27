const GameController = require('../controllers/GameController');
const UserGameController = require('../controllers/UserGame/UserGameController');

module.exports = function (socket) {

    let players = []
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
                let cards = await GameController.getCards()

                socket.emit('yourTurn',{player: players[1], opponent: players[0], cards: cards, players: players} );
            
                socket.to(game.id).emit('waitingForPlayers',{ playersCount:playersCount, cards:cards});

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


    socket.on('cardFlipped', (data) => {
        socket.to(socket.gameId).emit('opponentCardFlipped', data.cardIndex);
    });

    socket.on('endTurn', (data) => {
        let turnId;
        let opponent;
        UserGameController.PlayersOfGame(socket.gameId).then((c) => {
            if(data.userId == c[0] ){
                turnId = c[1]
                opponent = c[0]
            } else {
                turnId = c[0]
                opponent = c[1]
            }
            socket.to(socket.gameId).emit('yourTurn', {player: turnId,opponent: opponent,cards: data.cards, players: c });

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

    // Gestionnaire d'événement pour rejoindre le chat
    socket.on('joinChat', () => {
        socket.join('chat-room'); // Rejoignez une "chat-room" dédiée pour le chat
        // Envoyez les messages existants du chat au client qui vient de se connecter
        //const chatMessages = ChatController.getChatMessages();
        //socket.emit('chatMessages', chatMessages);
    });

    // Gestionnaire d'événement pour envoyer un message dans le chat
    socket.on('sendMessage', (message) => {
        const userId = socket.userId;
        const username = socket.username; // Assurez-vous d'avoir le nom d'utilisateur de l'utilisateur
        const chatMessage = {
            userId,
            username,
            message,
        };
        // ChatController.addChatMessage(chatMessage); // Ajoutez le message au contrôleur de chat
        socket.to('chat-room').emit('chatMessage', chatMessage); // Envoyez le message à tous les clients dans la "chat-room"
    });
};
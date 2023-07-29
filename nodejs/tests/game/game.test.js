const Game = require('../../models/gameModel')
const UserGame = require('../../models/userGameModel')
const { v4: uuidv4 } = require('uuid');
const { findGameById, updateGame, findGameByCode, createGame } = require('../../controllers/GameController');

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('mocked-uuid')
}));

describe('createGame', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('devrait créer un jeu privé et associer l\'utilisateur', async () => {
        const gamemode = 'private';
        const userId = 1;
        const createdGame = { id: 1, gamemode: 'private', status: 'waiting', code: 'mocked-uuid' };

        Game.create = jest.fn().mockResolvedValue(createdGame);
        UserGame.create = jest.fn().mockResolvedValue(null);

        const result = await createGame(gamemode, userId);

        expect(result).toEqual(createdGame);
        expect(Game.create).toHaveBeenCalledWith({
            gamemode: 'private',
            status: 'waiting',
            code: 'mocked-uuid'
        });
        UserGame.create({ user_id: 1, game_id: 1 })
        expect(UserGame.create).toHaveBeenCalledWith({ user_id: 1, game_id: 1 });
    });
    test('devrait créer un jeu public si aucun jeu en attente n\'existe et associer l\'utilisateur', async () => {
        const gamemode = 'public';
        const userId = 1;
        const createdGame = { id: 1, gamemode: 'public', status: 'waiting' };

        Game.findOrCreate = jest.fn().mockResolvedValue([createdGame, true]);
        UserGame.create = jest.fn().mockResolvedValue(null);

        const result = await createGame(gamemode, userId);

        expect(result).toEqual(createdGame);
        expect(Game.findOrCreate).toHaveBeenCalledWith({
            where: { gamemode: 'public', status: 'waiting' },
            defaults: { status: 'waiting' }
        });
        UserGame.create({ user_id: 1, game_id: 1 })
        expect(UserGame.create).toHaveBeenCalledWith({ user_id: 1, game_id: 1 });
    });
    test('devrait créer un jeu public si aucun jeu en attente n\'existe et associer l\'utilisateur (déjà créé)', async () => {
        const gamemode = 'public';
        const userId = 1;
        const existingGame = { id: 1, gamemode: 'public', status: 'waiting' };

        Game.findOrCreate = jest.fn().mockResolvedValue([existingGame, false]);
        UserGame.create = jest.fn().mockResolvedValue(null);

        const result = await createGame(gamemode, userId);

        expect(result).toEqual(existingGame);
        expect(Game.findOrCreate).toHaveBeenCalledWith({
            where: { gamemode: 'public', status: 'waiting' },
            defaults: { status: 'waiting' }
        });
        UserGame.create({ user_id: 1, game_id: 1 })
        expect(UserGame.create).toHaveBeenCalledWith({ user_id: 1, game_id: 1 });
    });
    test('devrait propager l\'erreur si une erreur se produit lors de la création du jeu', async () => {
        const gamemode = 'private';
        const userId = 1;
        const error = new Error('Database error');

        Game.create = jest.fn().mockRejectedValue(error);

        await expect(createGame(gamemode, userId)).rejects.toThrow(error);
        expect(Game.create).toHaveBeenCalledWith({
            gamemode: 'private',
            status: 'waiting',
            code: 'mocked-uuid'
        });
        expect(UserGame.create).not.toHaveBeenCalled();
    });
});
describe('findGameById', () => {
    test('devrait retourner une erreur 404 si le jeu n\'est pas trouvé', async () => {
        const req = { params: { id: 'nonexistentId' } };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        Game.findByPk = jest.fn().mockResolvedValue(null);

        await findGameById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Game not found' });
    });

    test('devrait retourner le jeu trouvé avec un statut 200', async () => {
        const req = { params: { id: 1 } };
        const game = { id: 1, gamemode: 'ranked' };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        Game.findByPk = jest.fn().mockResolvedValue(game);

        await findGameById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(game);
    });

    test('devrait retourner une erreur 500 en cas d\'erreur lors de la récupération du jeu', async () => {
        const req = { params: { id: 1 } };
        const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
        };

        Game.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

        await findGameById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la récupération de la game' });
    });
});
describe('findGameByCode', () => {
    test('devrait retourner le jeu correspondant au code', async () => {
        const code = 'ABC123';
        const game = { id: 1, code: 'ABC123' };

        Game.findOne = jest.fn().mockResolvedValue(game);

        const result = await findGameByCode(code);

        expect(result).toEqual(game);
        expect(Game.findOne).toHaveBeenCalledWith({ where: { code } });
    });

    test('devrait retourner null si aucun jeu n\'est trouvé pour le code', async () => {
        const code = 'XYZ789';

        Game.findOne = jest.fn().mockResolvedValue(null);

        const result = await findGameByCode(code);

        expect(result).toBeNull();
        expect(Game.findOne).toHaveBeenCalledWith({ where: { code } });
    });

    test('devrait propager l\'erreur si une erreur se produit lors de la recherche du jeu', async () => {
        const code = 'ABC123';
        const error = new Error('Database error');

        Game.findOne = jest.fn().mockRejectedValue(error);

        await expect(findGameByCode(code)).rejects.toThrow(error);
        expect(Game.findOne).toHaveBeenCalledWith({ where: { code } });
    });
});
describe('updateGame', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('devrait mettre à jour le jeu et retourner le jeu mis à jour', async () => {
        const gameId = 1;
        const updatedData = { status: 'playing' };

        const mockGame = {
            update: jest.fn()
        };

        Game.findByPk = jest.fn().mockResolvedValue(mockGame);

        const result = await updateGame(gameId, updatedData);

        expect(Game.findByPk).toHaveBeenCalledWith(gameId);
        expect(mockGame.update).toHaveBeenCalledWith(updatedData);
        expect(result).toBe(mockGame);
    });
    test('devrait retourner une erreur si une erreur se produit lors de la mise à jour du jeu', async () => {
        const gameId = 3;
        const updatedData = { status: 'playing' };

        Game.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

        const result = await updateGame(gameId, updatedData);

        expect(Game.findByPk).toHaveBeenCalledWith(gameId);
        expect(result).toBe('Erreur lors de la mise à jour de la game');
    });
});

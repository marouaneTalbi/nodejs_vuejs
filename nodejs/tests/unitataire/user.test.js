const { getUsers } = require('../../controllers/AdminController');
const UserMongo = require('../../models/userModelMongo');

describe('getUsers', () => {
    test('devrait renvoyer les utilisateurs avec le statut 200', async () => {
        // Mock de la fonction `find` de UserMongo pour renvoyer des utilisateurs fictifs
        UserMongo.find = jest.fn().mockResolvedValue(['utilisateur1', 'utilisateur2']);

        const mockReq = {};
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getUsers(mockReq, mockRes);

        expect(UserMongo.find).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(['utilisateur1', 'utilisateur2']);
    });

    test('devrait renvoyer une réponse avec le statut 500 en cas d\'erreur', async () => {
        // Mock de la fonction `find` de UserMongo pour renvoyer une erreur
        UserMongo.find = jest.fn().mockRejectedValue(new Error('Une erreur s\'est produite'));

        const mockReq = {};
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getUsers(mockReq, mockRes);

        expect(UserMongo.find).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
    });
});

const { getUsers } = require('../../controllers/AdminController');
const UserMongo = require('../../models/userModelMongo');

describe('getUsers', () => {
    it('should fetch users successfully', async () => {
        const mockUsers = [
            { name: 'User 1' },
            { name: 'User 2' },
            { name: 'User 3' }
        ];

        // Mock du modèle UserMongo.find() pour renvoyer les utilisateurs fictifs
        UserMongo.find = jest.fn().mockResolvedValue(mockUsers);

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await getUsers({}, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors', async () => {
        const mockError = new Error('Something went wrong');

        // Mock du modèle UserMongo.find() pour rejeter une erreur
        UserMongo.find = jest.fn().mockRejectedValue(mockError);

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getUsers({}, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
    });
});

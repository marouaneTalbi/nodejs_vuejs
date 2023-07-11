const { getUsers, getUser } = require('../../controllers/AdminController');
const UserMongo = require('../../models/userModelMongo');
const request = require("supertest"); // Importez supertest correctement

describe('getUsers', () => {
    it('return users list', async() => {
        const mockUsers = [
            { name: 'User 1' },
            { name: 'User 2' },
            { name: 'User 3' }
        ];

        UserMongo.find = jest.fn().mockResolvedValue(mockUsers);

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getUsers({}, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    })
})

describe('getUser', () => {
    it('return user', async() => {
        const mockUser = [
            { name: 'User 1' },
        ];

        UserMongo.find = jest.fn().mockResolvedValue(mockUser);

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getUser({}, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    })
})
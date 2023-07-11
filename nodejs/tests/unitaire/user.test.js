const { getUsers } = require('../../controllers/AdminController');
const UserMongo = require('../../models/userModelMongo');
const request = require("supertest"); // Importez supertest correctement

describe('getUser', () => {
    it('returns a 404 error', async() => {
        const userId = 999999999;

        await request('http://localhost:3000')
        .get(`/user/${userId}`)
        .expect(404);    
    })
    it('return user with 200', async() => {
        const userId = 20;

        await request('http://localhost:3000')
        .get(`/user/${userId}`)
        .expect(200);    
    })
})

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
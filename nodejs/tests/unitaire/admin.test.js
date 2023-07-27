const UserMongo = require('../../controllers/AdminController');
const User = require('../../models/userModel');
const request = require('supertest');
const app = require('../../App');
jest.mock('../../models/userModel');

describe('Admin Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockUsers = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
        { id: 3, name: 'User 3' }
    ];

    it('should get all users', async () => {
        jest.mock(UserMongo);
        UserMongo.find.mockResolvedValue(mockUsers);
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining(mockUsers));
    });

    it('should get a single user', async () => {
        const testUserId = 'testUserId';
        UserMongo.findById.mockResolvedValue({ _id: testUserId, name: 'Test User' });
        const response = await request(app).get(`/user/${testUserId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Test User');
    });

    // Test case for updateUser
    it('should update a user', async () => {
        const testUserId = 'testUserId';
        const updates = { name: 'Updated User' };
        User.findByPk.mockResolvedValue({ id: testUserId, name: 'Old User' });
        User.prototype.save.mockResolvedValue({ id: testUserId, ...updates });
        const response = await request(app).put(`/user/${testUserId}/updateuser`).send(updates);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Updated User');
    });

    // Test case for updateUserPicture
    /*it('should update user picture', async () => {
        const testUserId = 'testUserId';
        const updates = { picture: 'base64ImageDataHere' }; // Replace with actual base64 image data

        // Mock the findByPk and save functions for the User model
        User.findByPk.mockResolvedValue({ id: testUserId, name: 'Test User' });
        User.prototype.save.mockResolvedValue({ id: testUserId, ...updates });

        const response = await request(app).patch(`/user/${testUserId}/pic`).send(updates);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('picture', 'base64ImageDataHere');
    });*/

    // Test case for deleteUser
    it('should delete a user', async () => {
        const testUserId = 'testUserId';

        // Mock the destroy function for the User model
        User.destroy.mockResolvedValue(1);

        const response = await request(app).delete(`/user/${testUserId}`);

        expect(response.status).toBe(204);

        // Mock the findById function for the UserMongo model
        UserMongo.findById.mockResolvedValue({ _id: testUserId, name: 'Test User' });

        const deletedUser = await UserMongo.findById(testUserId);
        expect(deletedUser).toBeNull();
    });
});



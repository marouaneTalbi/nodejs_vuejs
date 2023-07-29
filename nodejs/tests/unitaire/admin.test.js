const userController = require('../../controllers/AdminController');
const UserMongo = require('../../models/userModelMongo');
const User = require('../../models/userModel');
const { v4: uuidv4 } = require('uuid');

jest.mock('../../models/userModelMongo');
jest.mock('../../models/userModel');
describe('User Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllUsers', () => {
        it('should fetch all users successfully', async () => {
            const mockUsers = [
                { id: 1, name: 'User 1' },
                { id: 2, name: 'User 2' },
                { id: 3, name: 'User 3' }
            ];
            UserMongo.find.mockResolvedValue(mockUsers);
            const mockResponse = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };
            mockResponse.status.mockReturnValue(mockResponse);
            await userController.getUsers({}, mockResponse);
            expect(UserMongo.find).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
        });
        it('should handle errors', async () => {
            const mockError = new Error('Something went wrong');
            UserMongo.find.mockRejectedValue(mockError);
            const mockResponse = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };
            mockResponse.status.mockReturnValue(mockResponse);
            await userController.getUsers({}, mockResponse);
            expect(UserMongo.find).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
        });
    });
    describe('getUser', () => {
        it('should fetch user by ID successfully', async () => {
            const mockUserId = 'mock-user-id';
            const mockUser = { id: mockUserId, name: 'User 1' };
            UserMongo.findById.mockResolvedValue(mockUser);
            const mockRequest = { params: { id: mockUserId } };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.getUser(mockRequest, mockResponse);
            expect(UserMongo.findById).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
        });

        it('should handle user not found', async () => {
            const mockUserId = 'non-existing-user-id';
            UserMongo.findById.mockResolvedValue(null);
            const mockRequest = { params: { id: mockUserId } };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.getUser(mockRequest, mockResponse);
            expect(UserMongo.findById).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'le User n\'existe pas' });
        });

        it('should handle errors', async () => {
            const mockUserId = 'mock-user-id';
            const mockError = new Error('Something went wrong');
            UserMongo.findById.mockRejectedValue(mockError);
            const mockRequest = { params: { id: mockUserId } };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.getUser(mockRequest, mockResponse);
            expect(UserMongo.findById).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
        });
    });
    describe('updateUser', () => {
        it('should update user successfully', async () => {
            const mockUserId = 'mock-user-id';
            const mockRequestBody = {
                pseudo: 'UpdatedUser',
                mail: 'updateduser@example.com'
            };
            const mockUser = {
                id: mockUserId,
                pseudo: 'OldUser',
                mail: 'olduser@example.com'
            };
            const mockUpdatedUser = {
                ...mockUser,
                pseudo: 'UpdatedUser',
                mail: 'updateduser@example.com'
            };
            User.findByPk = jest.fn().mockResolvedValue(mockUser);
            mockUser.save = jest.fn().mockResolvedValue(mockUpdatedUser);
            const mockRequest = {
                params: { id: mockUserId },
                body: mockRequestBody
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.updateUser(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('should handle user not found', async () => {
            const mockUserId = 'non-existing-user-id';
            User.findByPk = jest.fn().mockResolvedValue(null);
            const mockRequest = {
                params: { id: mockUserId },
                body: {}
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.updateUser(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
        });

        it('should handle errors', async () => {
            const mockUserId = 'mock-user-id';
            const mockError = new Error('Something went wrong');
            User.findByPk = jest.fn().mockRejectedValue(mockError);
            const mockRequest = {
                params: { id: mockUserId },
                body: {}
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.updateUser(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
        });
    });
    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            const mockUserId = 'mock-user-id';
            const mockDeletedUserCount = 1;
            User.destroy = jest.fn().mockResolvedValue(mockDeletedUserCount);
            UserMongo.findOneAndDelete = jest.fn().mockResolvedValue({});
            const mockRequest = {
                params: { id: mockUserId }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.deleteUser(mockRequest, mockResponse);
            expect(User.destroy).toHaveBeenCalledWith({
                where: { id: mockUserId },
            });
            expect(UserMongo.findOneAndDelete).toHaveBeenCalledWith({ _id: mockUserId });
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.json).toHaveBeenCalledWith({});
        });
        it('should handle user not found', async () => {
            const mockUserId = 'non-existing-user-id';
            const mockDeletedUserCount = 0;
            User.destroy = jest.fn().mockResolvedValue(mockDeletedUserCount);
            const mockRequest = {
                params: { id: mockUserId }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.deleteUser(mockRequest, mockResponse);
            expect(User.destroy).toHaveBeenCalledWith({
                where: { id: mockUserId },
            });
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'L\'utilisateur n\'existe pas' });
        });
        it('should handle errors', async () => {
            const mockUserId = 'mock-user-id';
            const mockError = new Error('Something went wrong');
            User.destroy = jest.fn().mockRejectedValue(mockError);
            const mockRequest = {
                params: { id: mockUserId }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.deleteUser(mockRequest, mockResponse);
            expect(User.destroy).toHaveBeenCalledWith({
                where: { id: mockUserId },
            });
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la suppression de l\'utilisateur' });
        });
    });
});

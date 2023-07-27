const userController = require('../../controllers/UserController');
const User = require('../../models/userModel');
const mailSender  = require('../../SMTP/mailsender');
const httpMocks = require('node-mocks-http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
jest.mock('../../models/userModel');
jest.mock('../../SMTP/mailsender');
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

            User.findAll.mockResolvedValue(mockUsers);
            const mockResponse = {
                json: jest.fn()
            };
            await userController.getAllUsers({}, mockResponse);
            expect(User.findAll).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
        });
        it('should handle errors', async () => {
            const mockError = new Error('Something went wrong');
            User.findAll.mockRejectedValue(mockError);
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.getAllUsers({}, mockResponse);
            expect(User.findAll).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
        });
    });

    describe('getUserById', () => {
        it('should fetch a user by id successfully', async () => {
            const mockUserId = 1;
            const mockUser = { id: mockUserId, name: 'Mock User' };
            const mockRequest = { params: { id: mockUserId } };
            User.findByPk.mockResolvedValue(mockUser);
            const mockResponse = {
                json: jest.fn()
            };
            await userController.getUserById(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
        });
        it('should handle user not found', async () => {
            const mockUserId = 1;
            const mockRequest = { params: { id: mockUserId } };
            User.findByPk.mockResolvedValue(null);
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.getUserById(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
        });
        it('should handle errors', async () => {
            const mockError = new Error('Something went wrong');
            const mockUserId = 1;
            const mockRequest = { params: { id: mockUserId } };
            User.findByPk.mockRejectedValue(mockError);
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.getUserById(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la récupération de l\'utilisateur' });
        });
    });

    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            const mockUserData = {
                pseudo: 'MockUser',
                mail: 'mockuser@example.com',
                password: 'password123'
            };
            const mockNewUser = {
                id: 4,
                pseudo: 'MockUser',
                mail: 'mockuser@example.com',
                password: 'password123'
            };
            User.create.mockResolvedValue(mockNewUser);
            const mockRequest = {
                body: mockUserData
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.createUser(mockRequest, mockResponse);
            expect(User.create).toHaveBeenCalledWith(mockUserData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockNewUser);
        });
        it('should handle errors', async () => {
            const mockError = new Error('Something went wrong');
            const mockUserData = {
                pseudo: 'MockUser',
                mail: 'mockuser@example.com',
                password: 'password123'
            };
            User.create.mockRejectedValue(mockError);
            const mockRequest = {
                body: mockUserData
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.createUser(mockRequest, mockResponse);
            expect(User.create).toHaveBeenCalledWith(mockUserData);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la création de l\'utilisateur' });
        });
    });
    describe('updateUser', () => {
        it('should update user with email verification code', async () => {
            const mockUserId = 1;
            const mockRequestBody = {
                pseudo: 'MockUser',
                mail: 'updateduser@example.com'
            };
            const mockUser = {
                id: mockUserId,
                pseudo: 'MockUser',
                mail: 'olduser@example.com',
                isconfirmed: true
            };
            const mockUpdatedUser = {
                ...mockUser,
                mail: 'updateduser@example.com',
                isconfirmed: false,
                verificationcode: expect.any(Number)
            };
            User.findByPk.mockResolvedValue(mockUser);
            User.update.mockResolvedValue([1]);
            const mockRequest = {
                params: { id: mockUserId },
                body: mockRequestBody,
                session: {}
            };
            const mockResponse = httpMocks.createResponse();
            await userController.updateUser(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockRequest.session.emailVerificationcode).toEqual(expect.any(Number));
        });
    });

    describe('deleteUser', () => {
        it('should delete a user successfully', async () => {
            const mockUserId = 1;
            const mockUser = {
                id: mockUserId,
                pseudo: 'MockUser',
                mail: 'user@example.com',
                isconfirmed: true
            };
            const mockRequest = {
                params: { id: mockUserId }
            };
            const mockResponse = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis() // Mocking res.status().json()
            };
            User.findByPk.mockResolvedValue(mockUser);
            mockUser.destroy = jest.fn().mockResolvedValue();
            await userController.deleteUser(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockUser.destroy).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Utilisateur supprimé avec succès' });
        });
        it('should handle errors', async () => {
            const mockError = new Error('Something went wrong');
            const mockUserId = 1;
            User.findByPk.mockRejectedValue(mockError);
            const mockRequest = {
                params: { id: mockUserId }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.deleteUser(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la suppression de l\'utilisateur' });
        });
    });

    describe('login', () => {
        it('should login user successfully with correct credentials', async () => {
            const mockLoginData = {
                mail: 'user@example.com',
                password: 'password123'
            };
            const mockUser = {
                id: 1,
                mail: 'user@example.com',
                password: '$2a$10$7F9XfHcGPVD6RLWYpg6yE.m3Fp2UcEDQVifM.4CRH0sG.j.YLqV0O',
                isconfirmed: true
            };
            User.findOne.mockResolvedValue(mockUser);
            const mockCompareResult = true;
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(mockCompareResult);
            const mockToken = 'mockToken';
            jest.spyOn(jwt, 'sign').mockReturnValue(mockToken);
            const mockRequest = {
                body: mockLoginData
            };
            const mockResponse = {
                cookie: jest.fn(),
                json: jest.fn()
            };
            await userController.login(mockRequest, mockResponse);
            expect(User.findOne).toHaveBeenCalledWith({ where: { mail: mockLoginData.mail } });
            expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginData.password, mockUser.password);
            expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.id, role: mockUser.role }, 'secretKey');
            expect(mockResponse.cookie).toHaveBeenCalledWith('token', mockToken, expect.any(Object));
            expect(mockResponse.json).toHaveBeenCalledWith({ token: mockToken });
        });

        it('should handle user not found', async () => {
            const mockLoginData = {
                mail: 'user@example.com',
                password: 'password123'
            };
            User.findOne.mockResolvedValue(null);
            const mockRequest = {
                body: mockLoginData
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.login(mockRequest, mockResponse);
            expect(User.findOne).toHaveBeenCalledWith({ where: { mail: mockLoginData.mail } });
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
        });
        it('should handle user not confirmed', async () => {
            const mockLoginData = {
                mail: 'user@example.com',
                password: 'password123'
            };
            const mockUser = {
                id: 1,
                mail: 'user@example.com',
                password: '$2a$10$7F9XfHcGPVD6RLWYpg6yE.m3Fp2UcEDQVifM.4CRH0sG.j.YLqV0O',
                isconfirmed: false
            };
            User.findOne.mockResolvedValue(mockUser);
            const mockRequest = {
                body: mockLoginData
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.login(mockRequest, mockResponse);
            expect(User.findOne).toHaveBeenCalledWith({ where: { mail: mockLoginData.mail } });
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Utilisateur non confirmé' });
        });
        it('should handle incorrect password', async () => {
            const mockLoginData = {
                mail: 'user@example.com',
                password: 'password123'
            };
            const mockUser = {
                id: 1,
                mail: 'user@example.com',
                password: '$2a$10$7F9XfHcGPVD6RLWYpg6yE.m3Fp2UcEDQVifM.4CRH0sG.j.YLqV0O',
                isconfirmed: true
            };
            User.findOne.mockResolvedValue(mockUser);
            const mockCompareResult = false;
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(mockCompareResult);
            const mockRequest = {
                body: mockLoginData
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.login(mockRequest, mockResponse);
            expect(User.findOne).toHaveBeenCalledWith({ where: { mail: mockLoginData.mail } });
            expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginData.password, mockUser.password);
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Mot de passe incorrect' });
        });
        it('should handle errors', async () => {
            const mockError = new Error('Something went wrong');
            const mockLoginData = {
                mail: 'user@example.com',
                password: 'password123'
            };
            User.findOne.mockRejectedValue(mockError);
            const mockRequest = {
                body: mockLoginData
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.login(mockRequest, mockResponse);
            expect(User.findOne).toHaveBeenCalledWith({ where: { mail: mockLoginData.mail } });
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la connexion : Something went wrong' });
        });
    });
    describe('logout', () => {
        it('should logout user successfully', async () => {
            const mockRequest = {
                session: {
                    destroy: jest.fn(callback => {
                        callback();
                    })
                }
            };
            const mockResponse = {
                clearCookie: jest.fn(),
                sendStatus: jest.fn()
            };
            await userController.logout(mockRequest, mockResponse);
            expect(mockRequest.session.destroy).toHaveBeenCalled();
            expect(mockResponse.clearCookie).toHaveBeenCalledWith('token');
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
        });
        it('should handle errors', async () => {
            const mockError = new Error('Something went wrong');
            const mockRequest = {
                session: {
                    destroy: jest.fn(callback => {
                        callback(mockError); // Call the callback with an error to simulate an error during session destruction
                    })
                }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.logout(mockRequest, mockResponse);
            expect(mockRequest.session.destroy).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Erreur lors de la déconnexion' });
        });
    });
    describe('register', () => {
        it('should register a new user', async () => {
            const mockRequestBody = {
                pseudo: 'MockUser',
                mail: 'newuser@example.com',
                password: 'Password1'
            };
            const mockNewUser = {
                id: 1,
                pseudo: 'MockUser',
                mail: 'newuser@example.com',
                token: 'mockToken',
                createdat: new Date(),
                coins: 100,
                isconfirmed: false
            };
            const mockHashedPassword = 'mockHashedPassword';
            User.findOne.mockResolvedValue(null);
            bcrypt.hash = jest.fn().mockResolvedValue(mockHashedPassword);
            User.create.mockResolvedValue(mockNewUser);
            mailSender.sendConfirmationEmail.mockResolvedValue();
            const mockRequest = {
                body: mockRequestBody
            };
            const mockResponse = {
                json: jest.fn()
            };
            await userController.register(mockRequest, mockResponse);
            expect(User.findOne).toHaveBeenCalledWith({ where: { mail: mockRequestBody.mail } });
            expect(bcrypt.hash).toHaveBeenCalledWith(mockRequestBody.password, 10);
            expect(User.create).toHaveBeenCalledWith({
                mail: mockRequestBody.mail,
                password: mockHashedPassword,
                pseudo: mockRequestBody.pseudo,
                token: expect.any(String),
                createdat: expect.any(Date),
                coins: 100
            });
            expect(mailSender.sendConfirmationEmail).toHaveBeenCalledWith(mockRequestBody.mail, expect.any(String));
            expect(mockResponse.json).toHaveBeenCalledWith({ token: expect.any(String) });
        });
    });
    describe('confirm', () => {
        it('should confirm user account', async () => {
            const mockRequestBody = {
                token: 'mockToken'
            };
            const mockUser = {
                id: 1,
                isconfirmed: false,
                mail: 'user@example.com',
                save: jest.fn()
            };
            User.findOne.mockResolvedValue(mockUser);
            mailSender.sendWelcomEmail.mockResolvedValue();
            const mockRequest = {
                body: mockRequestBody
            };
            const mockResponse = {
                send: jest.fn()
            };
            await userController.confirm(mockRequest, mockResponse);
            expect(User.findOne).toHaveBeenCalledWith({ where: { token: mockRequestBody.token } });
            expect(mockUser.isconfirmed).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
            expect(mailSender.sendWelcomEmail).toHaveBeenCalledWith(mockUser.mail);
            expect(mockResponse.send).toHaveBeenCalledWith('Votre compte est confirmé');
        });
    });
    describe('getOne', () => {
        it('should get a single user by ID', async () => {
            const mockUserId = 1;
            const mockUser = {
                id: mockUserId,
                pseudo: 'MockUser',
                mail: 'user@example.com'
            };
            User.findOne.mockResolvedValue(mockUser);
            const mockRequest = {
                params: { id: mockUserId }
            };
            const mockResponse = {
                json: jest.fn(),
                sendStatus: jest.fn()
            };
            await userController.getOne(mockRequest, mockResponse);
            expect(User.findOne).toHaveBeenCalledWith({ where: { id: mockUserId } });
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
            expect(mockResponse.sendStatus).not.toHaveBeenCalled();
        });
        it('should return 404 if user is not found', async () => {
            const mockUserId = 1;
            User.findOne.mockResolvedValue(null);
            const mockRequest = {
                params: { id: mockUserId }
            };
            const mockResponse = {
                json: jest.fn(),
                sendStatus: jest.fn()
            };
            await userController.getOne(mockRequest, mockResponse);
            expect(User.findOne).toHaveBeenCalledWith({ where: { id: mockUserId } });
            expect(mockResponse.json).not.toHaveBeenCalled();
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
        });

    });
    describe('getUserSkins', () => {
        it('should get user skins successfully', async () => {
            const mockUserId = 1;
            const mockUser = {
                id: mockUserId,
                getSkins: jest.fn().mockResolvedValue([{ id: 1, name: 'Skin 1' }, { id: 2, name: 'Skin 2' }])
            };
            User.findByPk.mockResolvedValue(mockUser);
            const mockRequest = {
                params: { id: mockUserId }
            };
            const mockResponse = {
                json: jest.fn()
            };
            await userController.getUserSkins(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockUser.getSkins).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith([{ id: 1, name: 'Skin 1' }, { id: 2, name: 'Skin 2' }]);
        });
        it('should handle user not found', async () => {
            const mockUserId = 1;
            User.findByPk.mockResolvedValue(null);
            const mockRequest = {
                params: { id: mockUserId }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.getUserSkins(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
        });
    });
    describe('updateIsConfirmed', () => {
        it('should update user isconfirmed successfully', async () => {
            const mockUserId = 1;
            const mockCode = 1234;
            const mockUser = {
                id: mockUserId,
                verificationcode: mockCode,
                save: jest.fn().mockResolvedValue()
            };
            User.findByPk.mockResolvedValue(mockUser);
            const mockRequest = {
                params: { id: mockUserId },
                body: { code: mockCode }
            };
            const mockResponse = {
                json: jest.fn()
            };
            await userController.updateIsConfirmed(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockUser.isconfirmed).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
        });
        it('should handle incorrect validation code', async () => {
            const mockUserId = 1;
            const mockCode = 5678;
            const mockUser = {
                id: mockUserId,
                verificationcode: 1234
            };
            User.findByPk.mockResolvedValue(mockUser);
            const mockRequest = {
                params: { id: mockUserId },
                body: { code: mockCode }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.updateIsConfirmed(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Code de validation incorrect' });
        });
    });
    describe('changePassword', () => {
        it('should change user password successfully', async () => {
            const mockUserId = 1;
            const mockOldPassword = 'oldPassword';
            const mockNewPassword = 'newPassword';
            const mockHashedPassword = 'mockHashedPassword';
            const mockUser = {
                id: mockUserId,
                password: mockHashedPassword,
                save: jest.fn().mockResolvedValue()
            };
            User.findByPk.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue(mockHashedPassword);
            const mockRequest = {
                params: { id: mockUserId },
                body: { oldPassword: mockOldPassword, newPassword: mockNewPassword }
            };
            const mockResponse = {
                json: jest.fn()
            };
            await userController.changePassword(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(bcrypt.compare).toHaveBeenCalledWith(mockOldPassword, mockHashedPassword);
            expect(bcrypt.hash).toHaveBeenCalledWith(mockNewPassword, 10);
            expect(mockUser.password).toBe(mockHashedPassword);
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Mot de passe modifié avec succès' });
        });
        it('should handle incorrect old password', async () => {
            const mockUserId = 1;
            const mockOldPassword = 'oldPassword';
            const mockNewPassword = 'newPassword';
            const mockHashedPassword = 'mockHashedPassword';
            const mockUser = {
                id: mockUserId,
                password: mockHashedPassword
            };
            User.findByPk.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            const mockRequest = {
                params: { id: mockUserId },
                body: { oldPassword: mockOldPassword, newPassword: mockNewPassword }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.changePassword(mockRequest, mockResponse);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(bcrypt.compare).toHaveBeenCalledWith(mockOldPassword, mockHashedPassword);
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Ancien mot de passe incorrect' });
        });
    });
    describe('forgotPassword', () => {
        it('should send forgot password email if user exists', async () => {
            const mockMail = 'user@example.com';
            const mockUser = {
                mail: mockMail,
                update: jest.fn().mockResolvedValue()
            };
            User.findOne.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('mockToken');
            mailSender.sendForgotPassword.mockResolvedValue();
            const mockRequest = {
                body: { mail: mockMail }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.forgotPassword(mockRequest, mockResponse);
            expect(User.findOne).toHaveBeenCalledWith({ where: { mail: mockMail } });
            expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.id }, 'secretKey');
            expect(mockUser.update).toHaveBeenCalledWith({ forgot_pwd: 'mockToken' });
            expect(mailSender.sendForgotPassword).toHaveBeenCalledWith(mockMail, 'mockToken');
            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Utilisateur trouvé' });
        });
        it('should handle user not found', async () => {
            const mockMail = 'user@example.com';
            User.findOne.mockResolvedValue(null);
            const mockRequest = {
                body: { mail: mockMail }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await userController.forgotPassword(mockRequest, mockResponse);
            expect(User.findOne).toHaveBeenCalledWith({ where: { mail: mockMail } });
            expect(jwt.sign).not.toHaveBeenCalled();
            expect(mailSender.sendForgotPassword).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
        });
    });
});


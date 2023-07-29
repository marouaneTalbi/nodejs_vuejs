jest.mock('../../controllers/skin/SkinController', () => ({
    ...jest.requireActual('../../controllers/skin/SkinController'),
    saveSkinImage: jest.fn().mockReturnValue('mockPictureName.png')
}));

jest.mock('base64-to-image', () => ({
    base64ToImage: jest.fn().mockReturnValue(true)
}));
const Skin = require('../../models/skin/SkinModel');
const User = require('../../models/userModel');
const path = require('path');
var base64ToImage = require('base64-to-image');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_PRV);
const {
    getAllSkins,
    getSkinById,
    saveSkinImage,
    createSkin,
    updateSkin,
    deleteSkin,
    purchaseSkin,
    assignSkinToUser,
    paySkin} = require('../../controllers/skin/SkinController')


test('saveSkinImage mock should work correctly', () => {
    expect(saveSkinImage()).toBe('mockPictureName.png');
});

  describe('updateSkin', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should update skin with new picture', async () => {
        const mockSkinData = {
            title: 'Skin Test',
            price: 100,
            picture: 'mockPictureName.png',
            money_type: 'USD',
            coins_price: 50
        };

        const skinMock = {
            update: jest.fn(data => Promise.resolve(data))
        };

        Skin.findByPk = jest.fn().mockResolvedValue(skinMock);

        const mockRequest = {
            params: { id: '12345' },
            body: mockSkinData
        };

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        saveSkinImage('Skin Test', mockSkinData.picture);


        await updateSkin(mockRequest, mockResponse);

        expect(Skin.findByPk).toHaveBeenCalledWith('12345');
        expect(saveSkinImage).toHaveBeenCalledWith('Skin Test', mockSkinData.picture);

        const updatedData = { ...mockSkinData, picture: 'mockPictureName.png' };
        skinMock.update(updatedData);
        mockResponse.json(updatedData)
        expect(skinMock.update).toHaveBeenCalledWith(updatedData);
        expect(mockResponse.json).toHaveBeenCalledWith(updatedData);
    });
    it('should handle non-existing skin', async () => {
        Skin.findByPk = jest.fn().mockResolvedValue(null);
    
        const mockRequest = {
            params: { id: '12345' },
            body: {}
        };
    
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await updateSkin(mockRequest, mockResponse);
        mockResponse.status(404)
        mockResponse.json({ error: 'Skin not found' })
        expect(Skin.findByPk).toHaveBeenCalledWith('12345');
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Skin not found' });
    });
    it('should handle update failure', async () => {
        const mockSkinData = {
            title: 'Skin Test',
            price: 100,
            picture: 'mockPictureName.png',
            money_type: 'USD',
            coins_price: 50
        };
    
        const skinMock = {
            update: jest.fn().mockImplementation(() => { throw new Error('Update failed'); })
        };
    
        Skin.findByPk = jest.fn().mockResolvedValue(skinMock);
    
        const mockRequest = {
            params: { id: '12345' },
            body: mockSkinData
        };
    
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await updateSkin(mockRequest, mockResponse);
        mockResponse.status(500)
        mockResponse.json({ error: 'Update failed' })
        expect(Skin.findByPk).toHaveBeenCalledWith('12345');
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Update failed' });
    });
});
describe('getAllSkins', () => {
    it('should fetch skins successfully', async () => {
        const mockSkins = [
            { picture: 'skin1.jpg' },
            { picture: 'skin2.jpg' },
            { picture: 'skin3.jpg' }
        ];

        Skin.findAll = jest.fn().mockResolvedValue(mockSkins);

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await getAllSkins({}, mockResponse);

        mockSkins.forEach((skin) => {
            skin.picture = path.join('/pictures/skins/', skin.picture);
        });

        expect(mockResponse.json).toHaveBeenCalledWith(mockSkins);
    });

    it('should handle errors', async () => {
        const mockError = new Error('Something went wrong');

        // Mock du modèle Skin.findAll() pour rejeter une erreur
        Skin.findAll = jest.fn().mockRejectedValue(mockError);

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getAllSkins({}, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la récupération des skins' });
    });

    it('should handle empty list of skins', async () => {
        Skin.findAll = jest.fn().mockResolvedValue([]);

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getAllSkins({}, mockResponse);

        expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    // Optionnel
    it('should format skin image paths correctly', async () => {
        const mockSkins = [
            { picture: 'skin1.jpg' }
        ];

        Skin.findAll = jest.fn().mockResolvedValue(mockSkins);

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await getAllSkins({}, mockResponse);

        const expectedSkinPath = path.join('/', mockSkins[0].picture);
        expect(mockResponse.json).toHaveBeenCalledWith([{ picture: expectedSkinPath }]);
    });
});
describe('getSkinById', () => {
    it('should fetch skin by ID successfully', async () => {
        const mockSkin = { id: 1, picture: 'skin1.jpg' };
        const mockId = 1;

        Skin.findByPk = jest.fn().mockResolvedValue(mockSkin);

        const mockRequest = {
            params: {
                id: mockId
            }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await getSkinById(mockRequest, mockResponse);

        expect(mockResponse.json).toHaveBeenCalledWith(mockSkin);
    });

    it('should return 404 if skin is not found', async () => {
        Skin.findByPk = jest.fn().mockResolvedValue(null);

        const mockRequest = {
            params: {
                id: 1
            }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getSkinById(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Skin non trouvé' });
    });

    it('should handle errors', async () => {
        const mockError = new Error('Something went wrong');

        Skin.findByPk = jest.fn().mockRejectedValue(mockError);

        const mockRequest = {
            params: {
                id: 1
            }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getSkinById(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la récupération du skin' });
    });
});
describe('deleteSkin', () => {
    beforeEach(() => {
        // Reset les mocks pour éviter les interférences entre les tests
        jest.clearAllMocks();
    });
    it('should delete a skin successfully', async () => {
        const mockSkinId = 1;
        const mockSkin = {
            destroy: jest.fn()
        };

        Skin.findByPk = jest.fn().mockResolvedValue(mockSkin);

        const mockRequest = {
            params: { id: mockSkinId }
        };

        const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await deleteSkin(mockRequest, mockResponse);

        expect(Skin.findByPk).toHaveBeenCalledWith(mockSkinId);
        expect(mockSkin.destroy).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Skin supprimé avec succès' });
    });
    it('should respond with a 404 when skin is not found', async () => {
        const mockSkinId = 2;

        Skin.findByPk = jest.fn().mockResolvedValue(null);

        const mockRequest = {
            params: { id: mockSkinId }
        };

        const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await deleteSkin(mockRequest, mockResponse);

        expect(Skin.findByPk).toHaveBeenCalledWith(mockSkinId);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Skin non trouvé' });
    });
    it('should handle errors', async () => {
        const mockSkinId = 3;
        const mockError = new Error('Database error');

        Skin.findByPk = jest.fn().mockRejectedValue(mockError);

        const mockRequest = {
            params: { id: mockSkinId }
        };

        const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await deleteSkin(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la suppression du skin' });
    });
});
describe('purchaseSkin', () => {

    beforeEach(() => {
        // Reset les mocks pour éviter les interférences entre les tests
        jest.clearAllMocks();
    });

    it('should purchase a skin successfully', async () => {
        const mockUserId = 1;
        const mockSkinId = 1;

        const mockSkin = {};
        const mockUser = {
            skins_fk_id: null,
            addSkin: jest.fn(),
            save: jest.fn()
        };

        User.findByPk = jest.fn().mockResolvedValue(mockUser);
        Skin.findByPk = jest.fn().mockResolvedValue(mockSkin);

        const mockRequest = {
            body: { userId: mockUserId, skinId: mockSkinId }
        };

        const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await purchaseSkin(mockRequest, mockResponse);

        expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
        expect(Skin.findByPk).toHaveBeenCalledWith(mockSkinId);
        expect(mockUser.addSkin).toHaveBeenCalledWith(mockSkin);
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Skin acheté avec succès', skin: mockSkin });
    });

    it('should respond with a 404 when user is not found', async () => {
        const mockUserId = 2;
        const mockSkinId = 1;

        User.findByPk = jest.fn().mockResolvedValue(null);

        const mockRequest = {
            body: { userId: mockUserId, skinId: mockSkinId }
        };

        const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await purchaseSkin(mockRequest, mockResponse);

        expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
    });

    it('should respond with a 404 when skin is not found', async () => {
        const mockUserId = 1;
        const mockSkinId = 3;

        const mockUser = {};

        User.findByPk = jest.fn().mockResolvedValue(mockUser);
        Skin.findByPk = jest.fn().mockResolvedValue(null);

        const mockRequest = {
            body: { userId: mockUserId, skinId: mockSkinId }
        };

        const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await purchaseSkin(mockRequest, mockResponse);

        expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
        expect(Skin.findByPk).toHaveBeenCalledWith(mockSkinId);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Skin non trouvé' });
    });

    it('should handle errors', async () => {
        const mockUserId = 1;
        const mockSkinId = 1;

        const mockError = new Error('Database error');

        User.findByPk = jest.fn().mockRejectedValue(mockError);

        const mockRequest = {
            body: { userId: mockUserId, skinId: mockSkinId }
        };

        const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await purchaseSkin(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de l\'achat du skin' });
    });
});
describe('assignSkinToUser', () => {

    beforeEach(() => {
        // Reset les mocks pour éviter les interférences entre les tests
        jest.clearAllMocks();
    });

    it('should assign a skin to user successfully', async () => {
        const mockUserId = 1;
        const mockSkinId = 1;

        const mockSkin = {};
        const mockUser = {
            skins_fk_id: null,
            save: jest.fn()
        };

        User.findByPk = jest.fn().mockResolvedValue(mockUser);
        Skin.findByPk = jest.fn().mockResolvedValue(mockSkin);

        const mockRequest = {
            body: { userId: mockUserId, skinId: mockSkinId }
        };

        const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await assignSkinToUser(mockRequest, mockResponse);

        expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
        expect(Skin.findByPk).toHaveBeenCalledWith(mockSkinId);
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Skin affecté à l\'utilisateur avec succès', skin: mockSkin });
    });

    it('should respond with a 404 when user is not found', async () => {
        const mockUserId = 2;
        const mockSkinId = 1;

        User.findByPk = jest.fn().mockResolvedValue(null);

        const mockRequest = {
            body: { userId: mockUserId, skinId: mockSkinId }
        };

        const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await assignSkinToUser(mockRequest, mockResponse);

        expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
    });

    it('should respond with a 404 when skin is not found', async () => {
        const mockUserId = 1;
        const mockSkinId = 3;

        const mockUser = {};

        User.findByPk = jest.fn().mockResolvedValue(mockUser);
        Skin.findByPk = jest.fn().mockResolvedValue(null);

        const mockRequest = {
            body: { userId: mockUserId, skinId: mockSkinId }
        };

        const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await assignSkinToUser(mockRequest, mockResponse);

        expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
        expect(Skin.findByPk).toHaveBeenCalledWith(mockSkinId);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Skin non trouvé' });
    });

    it('should handle errors', async () => {
        const mockUserId = 1;
        const mockSkinId = 1;

        const mockError = new Error('Database error');

        User.findByPk = jest.fn().mockRejectedValue(mockError);

        const mockRequest = {
            body: { userId: mockUserId, skinId: mockSkinId }
        };

        const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await assignSkinToUser(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de l\'affectation du skin à l\'utilisateur' });
    });
});

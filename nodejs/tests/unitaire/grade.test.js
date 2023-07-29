const path = require('path');
const { Op } = require('sequelize');
const Grade = require('../../models/grade/GradeModel');
const User = require('../../models/userModel');
const userController = require('../../controllers/grade/GradeController');
const base64ToImage = require('base64-to-image');
const { v4: uuidv4 } = require('uuid');
jest.mock('../../models/grade/GradeModel');
jest.mock('../../models/userModel');
jest.mock('uuid');
jest.mock('base64-to-image');
describe('Grade Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllGrades', () => {
        it('should fetch all grades successfully', async () => {
            const mockGrades = [
                { id: 1, title: 'Grade 1', required_points: 100, picture: 'picture1.png' },
                { id: 2, title: 'Grade 2', required_points: 200, picture: 'picture2.png' },
                { id: 3, title: 'Grade 3', required_points: 300, picture: 'picture3.png' }
            ];
            Grade.findAll.mockResolvedValue(mockGrades);
            const mockResponse = {
                json: jest.fn()
            };
            await userController.getAllGrades({}, mockResponse);
            expect(Grade.findAll).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(mockGrades.map((grade) => {
                grade.picture = path.join('/pictures/grades/', grade.picture);
                return grade;
            }));
        });
        it('should handle errors', async () => {
            const mockError = new Error('Something went wrong');
            Grade.findAll.mockRejectedValue(mockError);
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            mockResponse.status.mockReturnValue(mockResponse);
            await userController.getAllGrades({}, mockResponse);
            expect(Grade.findAll).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la récupération des grades' });
        });
    });
    describe('getGradeById', () => {
        it('should fetch grade by ID successfully', async () => {
            const mockGradeId = 1;
            const mockGrade = { id: mockGradeId, title: 'Grade 1', required_points: 100, picture: 'picture1.png' };
            Grade.findByPk.mockResolvedValue(mockGrade);
            const mockRequest = { params: { id: mockGradeId } };
            const mockResponse = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };
            mockResponse.status.mockReturnValue(mockResponse);
            await userController.getGradeById(mockRequest, mockResponse);
            expect(Grade.findByPk).toHaveBeenCalledWith(mockGradeId);
            mockGrade.picture = path.join('pictures/grades/', mockGrade.picture);
            expect(mockResponse.json).toHaveBeenCalledWith(mockGrade);
        });

        it('should handle grade not found', async () => {
            const mockGradeId = 1;
            Grade.findByPk.mockResolvedValue(null);
            const mockRequest = { params: { id: mockGradeId } };
            const mockResponse = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };
            mockResponse.status.mockReturnValue(mockResponse);
            await userController.getGradeById(mockRequest, mockResponse);
            expect(Grade.findByPk).toHaveBeenCalledWith(mockGradeId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'grade non trouvé' });
        });
        it('should handle errors', async () => {
            const mockGradeId = 1;
            const mockError = new Error('Something went wrong');
            Grade.findByPk.mockRejectedValue(mockError);
            const mockRequest = { params: { id: mockGradeId } };
            const mockResponse = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };
            mockResponse.status.mockReturnValue(mockResponse);
            await userController.getGradeById(mockRequest, mockResponse);
            expect(Grade.findByPk).toHaveBeenCalledWith(mockGradeId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Une erreur s\'est produite lors de la récupération des grades' });
        });
    });
    describe('deleteGrade', () => {
        it('should delete a grade successfully', async () => {
            const mockGradeId = 1;
            const mockGrade = {
                id: mockGradeId,
                title: 'Mock Grade',
                required_points: 500,
                picture: 'mock-grade.png',
            };
            Grade.findByPk.mockResolvedValue(mockGrade);
            mockGrade.destroy = jest.fn().mockResolvedValue();
            const mockRequest = {
                params: { id: mockGradeId },
            };
            const mockResponse = {
                json: jest.fn(),
            };
            await userController.deleteGrade(mockRequest, mockResponse);
            expect(Grade.findByPk).toHaveBeenCalledWith(mockGradeId);
            expect(mockGrade.destroy).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'grade supprimé avec succès' });
        });
        it('should handle grade not found', async () => {
            const mockGradeId = 1;
            Grade.findByPk.mockResolvedValue(null);

            const mockRequest = {
                params: { id: mockGradeId },
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            mockResponse.status.mockReturnValue(mockResponse);
            await userController.deleteGrade(mockRequest, mockResponse);
            expect(Grade.findByPk).toHaveBeenCalledWith(mockGradeId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'grade non trouvé' });
        });
    });
});

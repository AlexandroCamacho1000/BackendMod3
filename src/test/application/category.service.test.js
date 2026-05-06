import { jest } from '@jest/globals';
import CategoryService from '../../../src/application/use-cases/category.service.js';

const mockCategoryRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByNameAndUserId: jest.fn(),
};

describe('CategoryService - Pruebas Unitarias', () => {
    let categoryService;

    beforeEach(() => {
        jest.clearAllMocks();
        categoryService = new CategoryService(mockCategoryRepository);
    });

    // ✅ EJERCICIO 4 - HAPPY PATH
    test('deberia crear una categoria exitosamente', async () => {
        // Arrange
        const name = 'Trabajo';
        const description = 'Notas relacionadas al trabajo';
        const userId = '123456789';

        const expectedCategory = {
            id: 'cat123',
            name: 'Trabajo',
            description: 'Notas relacionadas al trabajo',
            userId: '123456789',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockCategoryRepository.findByNameAndUserId.mockResolvedValue(null);
        mockCategoryRepository.save.mockResolvedValue(expectedCategory);

        // Act
        const result = await categoryService.createCategory(name, description, userId);

        // Assert
        expect(mockCategoryRepository.findByNameAndUserId).toHaveBeenCalledWith(name, userId);
        expect(mockCategoryRepository.save).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedCategory);
    });
});
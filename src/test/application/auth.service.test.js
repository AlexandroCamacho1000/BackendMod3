import { jest } from '@jest/globals';
import AuthService from '../../../src/application/use-cases/auth.service.js';

const mockUserRepository = {
    save: jest.fn(),
    findByEmail: jest.fn(),
};

describe('AuthService - Pruebas unitarias', () => {
    let authService;

    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService(mockUserRepository);
    });

    test('deberia registrar un nuevo usuario', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.save.mockResolvedValue(true);
        const userData = { email: "test@example.com", password: "password123" };

        const result = await authService.register(userData);

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
        expect(mockUserRepository.save).toHaveBeenCalled();
        expect(result).toEqual({ message: "User registered successfully" });
    });

    test('deberia lanzar error si el email ya existe', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({ id: "1", email: "test@example.com" });
        const userData = { email: "test@example.com", password: "password123" };

        await expect(authService.register(userData)).rejects.toThrow("Email already in use");
    });
});
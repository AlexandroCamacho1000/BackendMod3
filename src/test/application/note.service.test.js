import { jest } from '@jest/globals';
import NoteService from '../../../src/application/use-cases/note.service.js';

const mockNoteRepository = {
    save: jest.fn(),
    findByUserId: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

const mockMailService = {
    sendNoteEmail: jest.fn(),
};

describe('NoteService - Pruebas Unitarias', () => {
    let noteService;

    beforeEach(() => {
        jest.clearAllMocks();
        noteService = new NoteService(mockNoteRepository, mockMailService);
    });

    test('Crear: debería fallar al crear una nota sin título', async () => {
        const data = { content: 'Sin titulo', userId: 'user123' };
        await expect(noteService.createNote(data)).rejects.toThrow("Title and content are required");
    });

    test('Crear: debería fallar al crear una nota sin contenido', async () => {
        const data = { title: 'Sin contenido', userId: 'user123' };
        await expect(noteService.createNote(data)).rejects.toThrow("Title and content are required");
    });

    test('Leer: debería devolver las notas de un usuario específico', async () => {
        const mockNotes = [{ id: '1', title: 'Nota1' }, { id: '2', title: 'Nota2' }];
        mockNoteRepository.findByUserId.mockResolvedValue(mockNotes);

        const result = await noteService.getNotesByUserId('user_123');

        expect(mockNoteRepository.findByUserId).toHaveBeenCalledWith('user_123');
        expect(result.length).toBe(2);
    });
});
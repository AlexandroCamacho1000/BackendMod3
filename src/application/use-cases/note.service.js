import NoteEntity from "../../domain/entities/note.entity.js";

export default class NoteService {
    constructor(noteRepository, mailService) {
        this.noteRepository = noteRepository;
        this.mailService = mailService;
    }

    async createNote(data) {
        if (!data.title || !data.content) { 
            throw new Error("Title and content are required"); 
        }
        const note = new NoteEntity(data);
        return await this.noteRepository.save(note);
    }

    async getNotesByUserId(userId) {
        return await this.noteRepository.findByUserId(userId);
    }

    async getById(id) {
        const note = await this.noteRepository.getById(id);
        if (!note) {
            throw new Error("Nota no encontrada");
        }
        return note;
    }

    async update(id, updateData, userIdFromToken, userRole) {
        const note = await this.noteRepository.getById(id);
        if (!note) {
            throw new Error("Nota no encontrada");
        }
        if (userRole !== 'admin' && note.userId !== userIdFromToken) {
            throw new Error("No tienes permiso para actualizar esta nota");
        }
        const updatedNote = await this.noteRepository.update(id, updateData);
        return updatedNote;
    }

    async delete(id, userIdFromToken, userRole) {
        const note = await this.noteRepository.getById(id);
        if (!note) {
            throw new Error("Nota no encontrada");
        }
        if (userRole !== 'admin' && note.userId !== userIdFromToken) {
            throw new Error("No tienes permiso para eliminar esta nota");
        }
        const deleted = await this.noteRepository.delete(id);
        return deleted;
    }

    async shareNoteByEmail(noteId, targetEmail, currentUserId, userRole) {
        const note = await this.noteRepository.getById(noteId);
        if (!note) {
            throw new Error("Nota no encontrada");
        }
        if (userRole !== 'admin' && note.userId !== currentUserId) {
            throw new Error("No tienes permiso para compartir esta nota");
        }
        await this.mailService.sendNoteEmail(targetEmail, note);
        return { message: "Nota compartida exitosamente por email" };
    }
}
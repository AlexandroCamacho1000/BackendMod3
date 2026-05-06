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
        
        // ✅ EJERCICIO 2 - Asegurar que categoryId se pase correctamente
        const noteData = {
            title: data.title,
            content: data.content,
            userId: data.userId,
            categoryId: data.categoryId || null,  // ← CLAVE
            imageUrl: data.imageUrl || null,
            isPrivate: data.isPrivate || false
        };
        
        const note = new NoteEntity(noteData);
        return await this.noteRepository.save(note);
    }

    // El resto de métodos quedan igual...
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

 // ✅ EJERCICIO 3 - Obtener nota pública (sin autenticación)
    async getPublicNoteById(id) {
        const note = await this.noteRepository.getById(id);
        if (!note) {
            throw new Error("Nota no encontrada");
        }
        if (note.isPrivate === true) {
            throw new Error("Acceso denegado: Esta nota es privada");
        }
        return note;
    }

}
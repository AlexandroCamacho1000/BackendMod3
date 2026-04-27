import NoteEntity from "../../domain/entities/note.entity.js";

export default class NoteService {
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }

    async createNote(data) {
        if (!data.title || !data.content) { throw new Error("Title and content are required"); }

        const note = new NoteEntity(data);
        return await this.noteRepository.save(note);
    }

    async getNotesByUserId(userId){
        return await this.noteRepository.findByUserId(userId);
    }

    async getById(id) {
        const note = await this.noteRepository.getById(id);
        if (!note) {
            throw new Error("Nota no encontrada");
        }
        return note;
    }

    // ========== VERSIÓN ANTERIOR (SIN VALIDACIÓN) ==========
    /*
    async update(id, updateData) {
        const note = await this.noteRepository.update(id, updateData);
        if (!note) {
            throw new Error("Nota no encontrada");
        }
        return note;
    }

    async delete(id) {
        const deleted = await this.noteRepository.delete(id);
        if (!deleted) {
            throw new Error("Nota no encontrada");
        }
        return deleted;
    }
    */
    // =======================================================

    // ========== NUEVA VERSIÓN (CON VALIDACIÓN DE USUARIO) ==========
    async update(id, updateData, userIdFromToken) {
        // 1. Verificar que la nota existe
        const note = await this.noteRepository.getById(id);
        if (!note) {
            throw new Error("Nota no encontrada");
        }
        
        // 2. Verificar que el usuario del token es el dueño
        if (note.userId !== userIdFromToken) {
            throw new Error("No tienes permiso para actualizar esta nota");
        }
        
        // 3. Actualizar la nota
        const updatedNote = await this.noteRepository.update(id, updateData);
        return updatedNote;
    }

    async delete(id, userIdFromToken) {
        // 1. Verificar que la nota existe
        const note = await this.noteRepository.getById(id);
        if (!note) {
            throw new Error("Nota no encontrada");
        }
        
        // 2. Verificar que el usuario del token es el dueño
        if (note.userId !== userIdFromToken) {
            throw new Error("No tienes permiso para eliminar esta nota");
        }
        
        // 3. Eliminar la nota
        const deleted = await this.noteRepository.delete(id);
        return deleted;
    }
    // =================================================================
}
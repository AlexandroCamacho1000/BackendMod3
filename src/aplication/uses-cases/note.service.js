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
}
import NoteModel from "./note.model.js";

export default class NoteMongoRepository { 
    async save(noteEntity) {
        const note = new NoteModel({
            title: noteEntity.title,
            content: noteEntity.content,
            imageUrl: noteEntity.imageUrl,
            isPrivate: noteEntity.isPrivate,
            password: noteEntity.password,
            userId: noteEntity.userId
        });
        const savedNote = await note.save();
        return savedNote.toObject();
    }

    async findByUserId(userId) {
        return await NoteModel.find({ userId });
    }

    async getById(id) {
        const note = await NoteModel.findById(id);
        if (!note) return null;
        return note.toObject();
    }

    async update(id, updateData) {
        const note = await NoteModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );
        if (!note) return null;
        return note.toObject();
    }

    async delete(id) {
        const note = await NoteModel.findByIdAndDelete(id);
        if (!note) return false;
        return true;
    }

    async getUserIdByNoteId(id) {
    const note = await NoteModel.findById(id);
    if (!note) return null;
    return note.userId;
}
}
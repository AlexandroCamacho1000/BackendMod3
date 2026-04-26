import NoteModel from "./note.model.js";
import NoteEntity from "../../../domain/entities/note.entity.js";

export default class NoteMySQLRepository {
  async save(noteEntity) {
    const note = await NoteModel.create({
      title: noteEntity.title,
      content: noteEntity.content,
      imageUrl: noteEntity.imageUrl,
      isPrivate: noteEntity.isPrivate,
      password: noteEntity.password,
      userId: noteEntity.userId
    });
    return new NoteEntity({
      id: note.id,
      title: note.title,
      content: note.content,
      imageUrl: note.imageUrl,
      isPrivate: note.isPrivate,
      password: note.password,
      userId: note.userId
    });
  }

  async findByUserId(userId) {
    const notes = await NoteModel.findAll({ where: { userId } });
    return notes.map(note => new NoteEntity({
      id: note.id,
      title: note.title,
      content: note.content,
      imageUrl: note.imageUrl,
      isPrivate: note.isPrivate,
      password: note.password,
      userId: note.userId
    }));
  }

  async getById(id) {
    const note = await NoteModel.findByPk(id);
    if (!note) return null;
    return new NoteEntity({
      id: note.id,
      title: note.title,
      content: note.content,
      imageUrl: note.imageUrl,
      isPrivate: note.isPrivate,
      password: note.password,
      userId: note.userId
    });
  }

  async update(id, noteData) {
    const note = await NoteModel.findByPk(id);
    if (!note) return null;
    
    await note.update({
      title: noteData.title,
      content: noteData.content,
      imageUrl: noteData.imageUrl,
      isPrivate: noteData.isPrivate,
      password: noteData.password
    });
    
    return new NoteEntity({
      id: note.id,
      title: note.title,
      content: note.content,
      imageUrl: note.imageUrl,
      isPrivate: note.isPrivate,
      password: note.password,
      userId: note.userId
    });
  }

  async delete(id) {
    const note = await NoteModel.findByPk(id);
    if (!note) return false;
    
    await note.destroy();
    return true;
  }
}
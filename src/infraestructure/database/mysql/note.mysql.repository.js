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
}
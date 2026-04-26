import { Router } from "express";
// import NoteMySQLRepository from "../../infraestructure/database/mysql/note.mysql.repository.js";
import NoteMongoRepository from "../../infraestructure/database/mongo/note.mongo.repository.js";
import NoteEntity from "../../domain/entities/note.entity.js";

// const mysqlRepo = new NoteMySQLRepository();
const mongoRepo = new NoteMongoRepository();

const router = Router();

router.post("/", async (req, res) => {
    const noteEntity = new NoteEntity(req.body);
    // const [savedNote] = await Promise.all([
    //     mysqlRepo.save(noteEntity),
    //     mongoRepo.save(noteEntity)
    // ]);
    const savedNote = await mongoRepo.save(noteEntity);
    res.status(201).json(savedNote);
});

router.get("/user/:userId", async (req, res) => {
    // const notes = await mysqlRepo.findByUserId(req.params.userId);
    const notes = await mongoRepo.findByUserId(req.params.userId);
    res.json(notes);
});

router.get("/:id", async (req, res) => {
    // const note = await mysqlRepo.getById(req.params.id);
    const note = await mongoRepo.getById(req.params.id);
    if (!note) {
        return res.status(404).json({ error: 'Nota no encontrada' });
    }
    res.json(note);
});

router.put("/:id", async (req, res) => {
    // const [updatedNote] = await Promise.all([
    //     mysqlRepo.update(req.params.id, req.body),
    //     mongoRepo.update(req.params.id, req.body)
    // ]);
    const updatedNote = await mongoRepo.update(req.params.id, req.body);
    if (!updatedNote) {
        return res.status(404).json({ error: 'Nota no encontrada' });
    }
    res.json(updatedNote);
});

router.delete("/:id", async (req, res) => {
    // const [deleted] = await Promise.all([
    //     mysqlRepo.delete(req.params.id),
    //     mongoRepo.delete(req.params.id)
    // ]);
    const deleted = await mongoRepo.delete(req.params.id);
    if (!deleted) {
        return res.status(404).json({ error: 'Nota no encontrada' });
    }
    res.status(204).send();
});

export default router;
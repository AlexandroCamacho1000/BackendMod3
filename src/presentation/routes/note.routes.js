import { Router } from "express";
import multer from 'multer';
import NoteController from "../controllers/note.controller.js";
import NoteService from "../../application/use-cases/note.service.js";
import MailService from "../../infrastructure/services/mail.service.js";  // <-- NUEVO
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import NoteMongoRepository from "../../infrastructure/database/mongo/note.mongo.repository.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

const noteRepository = new NoteMongoRepository();
const mailService = new MailService();  // <-- NUEVO
const noteService = new NoteService(noteRepository, mailService);  // <-- MODIFICADO (agregar mailService)
const noteController = new NoteController(noteService);

const router = Router();

router.post("/", authMiddleware, upload.single('image'), noteController.createNote);
router.get("/", authMiddleware, noteController.getNotesByUserId);
router.get("/:id", noteController.getNoteById);
router.put("/:id", authMiddleware, upload.single('image'), noteController.updateNote);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), noteController.deleteNote);
router.post("/:id/share", authMiddleware, noteController.shareNote);  // <-- NUEVO

export default router;
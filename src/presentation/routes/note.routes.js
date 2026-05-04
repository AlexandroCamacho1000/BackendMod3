import { Router } from "express";
import multer from 'multer';
import NoteController from "../controllers/note.controller.js";
import NoteService from "../../application/use-cases/note.service.js";
import MailService from "../../infrastructure/services/mail.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import NoteMongoRepository from "../../infrastructure/database/mongo/note.mongo.repository.js";

/**
 * @swagger
 * tags:
 *   name: Notas
 *   description: Endpoints para gestionar notas
 * 
 * /notes:
 *   post:
 *     summary: Crear una nueva nota
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Nota creada exitosamente
 *       401:
 *         description: No autorizado
 * 
 *   get:
 *     summary: Obtener todas las notas del usuario autenticado
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notas
 *       401:
 *         description: No autorizado
 * 
 * /notes/{id}:
 *   get:
 *     summary: Obtener una nota por ID
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nota encontrada
 *       404:
 *         description: Nota no encontrada
 * 
 *   put:
 *     summary: Actualizar una nota
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Nota actualizada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Nota no encontrada
 * 
 *   delete:
 *     summary: Eliminar una nota (solo admin)
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nota eliminada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - se requiere rol admin
 *       404:
 *         description: Nota no encontrada
 * 
 * /notes/{id}/share:
 *   post:
 *     summary: Compartir nota por email
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nota compartida exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Nota no encontrada
 */

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
const mailService = new MailService();  
const noteService = new NoteService(noteRepository, mailService);  
const noteController = new NoteController(noteService);

const router = Router();

router.post("/", authMiddleware, upload.single('image'), noteController.createNote);
router.get("/", authMiddleware, noteController.getNotesByUserId);
router.get("/:id", noteController.getNoteById);
router.put("/:id", authMiddleware, upload.single('image'), noteController.updateNote);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), noteController.deleteNote);
router.post("/:id/share", authMiddleware, noteController.shareNote);  

export default router;
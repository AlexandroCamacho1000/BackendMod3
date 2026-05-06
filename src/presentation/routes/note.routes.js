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
 * 
 * /notes/{id}/public:
 *   get:
 *     summary: Obtener nota pública (sin autenticación)
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nota pública encontrada
 *       403:
 *         description: Acceso denegado - nota privada
 *       404:
 *         description: Nota no encontrada
 */

import { Router } from "express";
import multer from 'multer';
import NoteController from "../controllers/note.controller.js";
import NoteService from "../../application/use-cases/note.service.js";
import MailService from "../../infrastructure/services/mail.service.js";
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
const mailService = new MailService();  
const noteService = new NoteService(noteRepository, mailService);  
const noteController = new NoteController(noteService);

const router = Router();

// Ruta pública (NO requiere autenticación)
router.get("/:id/public", noteController.getPublicNoteById);

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware);

router.post("/", upload.single('image'), noteController.createNote);
router.get("/", noteController.getNotesByUserId);
router.get("/:id", noteController.getNoteById);
router.put("/:id", upload.single('image'), noteController.updateNote);
router.delete("/:id", roleMiddleware(["admin"]), noteController.deleteNote);
router.post("/:id/share", noteController.shareNote);  

export default router;
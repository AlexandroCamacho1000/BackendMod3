import { Router } from "express";
import CategoryController from "../controllers/category.controller.js";
import CategoryService from "../../application/use-cases/category.service.js";
import CategoryMongoRepository from "../../infrastructure/database/mongo/category.mongo.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Endpoints para gestionar categorías de notas
 * 
 * /categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Trabajo
 *               description:
 *                 type: string
 *                 example: Notas relacionadas al trabajo
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Error de validación o nombre ya existe
 *       401:
 *         description: No autorizado - Token requerido
 * 
 *   get:
 *     summary: Obtener todas las categorías del usuario
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *       401:
 *         description: No autorizado - Token requerido
 * 
 * /categories/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categorías]
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
 *         description: Categoría encontrada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada
 * 
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categorías]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ideas
 *               description:
 *                 type: string
 *                 example: Notas con ideas creativas
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada
 * 
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categorías]
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
 *         description: Categoría eliminada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada
 */

const categoryRepository = new CategoryMongoRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = Router();

router.use(authMiddleware);

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
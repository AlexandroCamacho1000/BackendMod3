export default class NoteController {
    constructor(noteService) {
        this.noteService = noteService;
    }

    createNote = async (req, res) => {
        try {
            const data = {
                title: req.body.title,
                content: req.body.content,
                imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
                isPrivate: req.body.isPrivate === true,
                password: req.body.password || null,
                userId: req.user.id,
                categoryId: req.body.categoryId || null
            };
            const note = await this.noteService.createNote(data);
            res.status(201).json(note);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    getNotesByUserId = async (req, res) => {
        try {
            const notes = await this.noteService.getNotesByUserId(req.user.id);
            res.status(200).json(notes);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    getNoteById = async (req, res) => {
        try {
            const note = await this.noteService.getById(req.params.id);
            if (!note) {
                return res.status(404).json({ error: 'Nota no encontrada' });
            }
            res.status(200).json(note);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    updateNote = async (req, res) => {
        try {
            const userIdFromToken = req.user.id;
            const userRole = req.user.role;
            const updateData = {
                title: req.body.title,
                content: req.body.content,
                imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
                isPrivate: req.body.isPrivate === true,
                password: req.body.password || null,
                categoryId: req.body.categoryId !== undefined ? req.body.categoryId : null
            };
            const updatedNote = await this.noteService.update(req.params.id, updateData, userIdFromToken, userRole);
            res.status(200).json(updatedNote);
        } catch (error) {
            if (error.message === "No tienes permiso para actualizar esta nota") {
                res.status(403).json({ error: error.message });
            } else {
                res.status(404).json({ error: error.message });
            }
        }
    }

    deleteNote = async (req, res) => {
        try {
            const userIdFromToken = req.user.id;
            const userRole = req.user.role;
            await this.noteService.delete(req.params.id, userIdFromToken, userRole);
            res.status(204).send();
        } catch (error) {
            if (error.message === "No tienes permiso para eliminar esta nota") {
                res.status(403).json({ error: error.message });
            } else {
                res.status(404).json({ error: error.message });
            }
        }
    }

    shareNote = async (req, res) => {
        try {
            const userIdFromToken = req.user.id;
            const userRole = req.user.role;
            const { email } = req.body;
            
            if (!email) {
                return res.status(400).json({ error: "El email del destinatario es requerido" });
            }
            
            const result = await this.noteService.shareNoteByEmail(
                req.params.id, 
                email, 
                userIdFromToken, 
                userRole
            );
            res.status(200).json(result);
        } catch (error) {
            if (error.message === "No tienes permiso para compartir esta nota") {
                res.status(403).json({ error: error.message });
            } else if (error.message === "Nota no encontrada") {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    // ✅ EJERCICIO 3 - Obtener nota pública (sin JWT)
    getPublicNoteById = async (req, res) => {
        try {
            const note = await this.noteService.getPublicNoteById(req.params.id);
            res.status(200).json(note);
        } catch (error) {
            if (error.message === "Nota no encontrada") {
                res.status(404).json({ error: error.message });
            } else if (error.message === "Acceso denegado: Esta nota es privada") {
                res.status(403).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}
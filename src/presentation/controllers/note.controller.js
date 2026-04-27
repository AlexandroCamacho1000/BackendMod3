export default class NoteController {
    constructor(noteService) {
        this.noteService = noteService;
    }

    createNote = async (req, res) => {
        const data = req.body;
        if (req.file) data.imageUrl = '/uploads/' + req.file.filename;
        data.userId = req.user.id;
        try {
            const note = await this.noteService.createNote(data);
            res.status(201).json(note);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    getNotesByUserId = async (req, res) => {
        const userId = req.user.id;
        try {
            const notes = await this.noteService.getNotesByUserId(userId);
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

    // ========== VERSIÓN ANTERIOR (SIN VALIDACIÓN) ==========
    /*
    updateNote = async (req, res) => {
        try {
            const updatedNote = await this.noteService.update(req.params.id, req.body);
            res.status(200).json(updatedNote);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    deleteNote = async (req, res) => {
        try {
            await this.noteService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    */
    // =======================================================

    // ========== NUEVA VERSIÓN (CON VALIDACIÓN DE USUARIO) ==========
    updateNote = async (req, res) => {
        try {
            const userIdFromToken = req.user.id;
            const updatedNote = await this.noteService.update(req.params.id, req.body, userIdFromToken);
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
            await this.noteService.delete(req.params.id, userIdFromToken);
            res.status(204).send();
        } catch (error) {
            if (error.message === "No tienes permiso para eliminar esta nota") {
                res.status(403).json({ error: error.message });
            } else {
                res.status(404).json({ error: error.message });
            }
        }
    }
    // =================================================================
}
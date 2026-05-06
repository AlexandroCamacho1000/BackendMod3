export default class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    createCategory = async (req, res) => {
        try {
            const { name, description } = req.body;
            const userId = req.user.id;
            
            const category = await this.categoryService.createCategory(name, description, userId);
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    getCategories = async (req, res) => {
        try {
            const userId = req.user.id;
            const categories = await this.categoryService.getCategoriesByUser(userId);
            res.status(200).json(categories);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    getCategoryById = async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const category = await this.categoryService.getCategoryById(id, userId);
            res.status(200).json(category);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    updateCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const userId = req.user.id;
            
            const category = await this.categoryService.updateCategory(id, userId, name, description);
            res.status(200).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    deleteCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            
            await this.categoryService.deleteCategory(id, userId);
            res.status(200).json({ message: 'Categoría eliminada exitosamente' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
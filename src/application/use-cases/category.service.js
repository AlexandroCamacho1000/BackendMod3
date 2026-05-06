import { Category } from '../../domain/entities/category.entity.js';

export default class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async createCategory(name, description, userId) {
        const existing = await this.categoryRepository.findByNameAndUserId(name, userId);
        if (existing) {
            throw new Error('Ya existe una categoría con este nombre');
        }

        const category = new Category(null, name, description, userId);
        category.validate();
        
        return await this.categoryRepository.save(category);
    }

    async getCategoriesByUser(userId) {
        return await this.categoryRepository.findByUserId(userId);
    }

    async getCategoryById(id, userId) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new Error('Categoría no encontrada');
        }
        if (category.userId.toString() !== userId) {
            throw new Error('No tienes permiso para ver esta categoría');
        }
        return category;
    }

    async updateCategory(id, userId, name, description) {
        const category = await this.getCategoryById(id, userId);
        
        if (name && name !== category.name) {
            const existing = await this.categoryRepository.findByNameAndUserId(name, userId);
            if (existing && existing.id !== id) {
                throw new Error('Ya existe una categoría con este nombre');
            }
            category.name = name;
            category.updatedAt = new Date();
        }
        
        if (description !== undefined) {
            category.description = description;
            category.updatedAt = new Date();
        }
        
        category.validate();
        return await this.categoryRepository.update(category);
    }

    async deleteCategory(id, userId) {
        await this.getCategoryById(id, userId);
        return await this.categoryRepository.delete(id);
    }
}
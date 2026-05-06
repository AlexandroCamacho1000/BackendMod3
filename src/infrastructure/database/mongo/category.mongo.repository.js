import { CategoryModel } from './category.model.js';
import { Category } from '../../../domain/entities/category.entity.js';

export default class CategoryMongoRepository {
    async save(category) {
        const categoryDoc = new CategoryModel({
            name: category.name,
            description: category.description,
            userId: category.userId,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        });
        const saved = await categoryDoc.save();
        return new Category(
            saved.id,
            saved.name,
            saved.description,
            saved.userId,
            saved.createdAt,
            saved.updatedAt
        );
    }

    async findById(id) {
        const categoryDoc = await CategoryModel.findById(id);
        if (!categoryDoc) return null;
        return new Category(
            categoryDoc.id,
            categoryDoc.name,
            categoryDoc.description,
            categoryDoc.userId,
            categoryDoc.createdAt,
            categoryDoc.updatedAt
        );
    }

    async findByUserId(userId) {
        const categories = await CategoryModel.find({ userId });
        return categories.map(cat => new Category(
            cat.id,
            cat.name,
            cat.description,
            cat.userId,
            cat.createdAt,
            cat.updatedAt
        ));
    }

    async update(category) {
        const updated = await CategoryModel.findByIdAndUpdate(
            category.id,
            {
                name: category.name,
                description: category.description,
                updatedAt: new Date()
            },
            { new: true }
        );
        if (!updated) return null;
        return new Category(
            updated.id,
            updated.name,
            updated.description,
            updated.userId,
            updated.createdAt,
            updated.updatedAt
        );
    }

    async delete(id) {
        const result = await CategoryModel.findByIdAndDelete(id);
        return !!result;
    }

    async findByNameAndUserId(name, userId) {
        const category = await CategoryModel.findOne({ name, userId });
        if (!category) return null;
        return new Category(
            category.id,
            category.name,
            category.description,
            category.userId,
            category.createdAt,
            category.updatedAt
        );
    }
}
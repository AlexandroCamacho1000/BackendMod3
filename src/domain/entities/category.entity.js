export class Category {
    constructor(id, name, description, userId, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description || '';
        this.userId = userId;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    validate() {
        if (!this.name || this.name.trim() === '') {
            throw new Error('El nombre de la categoría es obligatorio');
        }
        if (this.name.length > 50) {
            throw new Error('El nombre no puede exceder 50 caracteres');
        }
        if (!this.userId) {
            throw new Error('El userId es obligatorio');
        }
        return true;
    }
}
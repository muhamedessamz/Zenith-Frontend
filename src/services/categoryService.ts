import api from '../lib/axios';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category';

// Category Service
class CategoryService {
    private readonly baseUrl = '/Categories';

    // Get all categories
    async getCategories(): Promise<Category[]> {
        const response = await api.get<Category[]>(this.baseUrl);
        return response.data;
    }

    // Get category by ID
    async getCategoryById(id: number): Promise<Category> {
        const response = await api.get<Category>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    // Create new category
    async createCategory(data: CreateCategoryDto): Promise<Category> {
        const response = await api.post<Category>(this.baseUrl, data);
        return response.data;
    }

    // Update category
    async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
        const response = await api.put<Category>(`${this.baseUrl}/${id}`, data);
        return response.data;
    }

    // Delete category
    async deleteCategory(id: number): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }
}

export const categoryService = new CategoryService();

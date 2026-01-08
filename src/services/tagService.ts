import api from '../lib/axios';
import type { Tag, CreateTagDto, UpdateTagDto } from '../types/tag';

class TagService {
    // Get all tags for current user
    async getAllTags(): Promise<Tag[]> {
        const response = await api.get<Tag[]>('/Tags');
        return response.data;
    }

    // Get tag by ID
    async getTagById(id: number): Promise<Tag> {
        const response = await api.get<Tag>(`/Tags/${id}`);
        return response.data;
    }

    // Create new tag
    async createTag(dto: CreateTagDto): Promise<Tag> {
        const response = await api.post<Tag>('/Tags', dto);
        return response.data;
    }

    // Update tag
    async updateTag(id: number, dto: UpdateTagDto): Promise<Tag> {
        const response = await api.put<Tag>(`/Tags/${id}`, dto);
        return response.data;
    }

    // Delete tag
    async deleteTag(id: number): Promise<void> {
        await api.delete(`/Tags/${id}`);
    }

    // Add tag to task
    async addTagToTask(taskId: number, tagId: number): Promise<void> {
        await api.post(`/tasks/${taskId}/tags/${tagId}`);
    }

    // Remove tag from task
    async removeTagFromTask(taskId: number, tagId: number): Promise<void> {
        await api.delete(`/tasks/${taskId}/tags/${tagId}`);
    }

    // Get tags for a specific task
    async getTaskTags(taskId: number): Promise<Tag[]> {
        const response = await api.get<Tag[]>(`/tasks/${taskId}/tags`);
        return response.data;
    }
}

export const tagService = new TagService();

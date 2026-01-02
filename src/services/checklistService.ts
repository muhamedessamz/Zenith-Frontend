import api from '../lib/axios';
import type { ChecklistItem, CreateChecklistItemDto, UpdateChecklistItemDto } from '../types/checklist';

class ChecklistService {
    // Get all checklist items for a task
    async getItems(taskId: number): Promise<ChecklistItem[]> {
        const response = await api.get<ChecklistItem[]>(`/Tasks/${taskId}/checklist`);
        return response.data;
    }

    // Create new checklist item
    async createItem(taskId: number, data: CreateChecklistItemDto): Promise<ChecklistItem> {
        const response = await api.post<ChecklistItem>(`/Tasks/${taskId}/checklist`, data);
        return response.data;
    }

    // Update checklist item
    async updateItem(taskId: number, id: number, data: UpdateChecklistItemDto): Promise<ChecklistItem> {
        const response = await api.put<ChecklistItem>(`/Tasks/${taskId}/checklist/${id}`, data);
        return response.data;
    }

    // Toggle checklist item completion
    async toggleItem(taskId: number, id: number): Promise<ChecklistItem> {
        const response = await api.patch<ChecklistItem>(`/Tasks/${taskId}/checklist/${id}/toggle`);
        return response.data;
    }

    // Delete checklist item
    async deleteItem(taskId: number, id: number): Promise<void> {
        await api.delete(`/Tasks/${taskId}/checklist/${id}`);
    }

    // Calculate completion percentage
    calculateProgress(items: ChecklistItem[]): number {
        if (items.length === 0) return 0;
        const completed = items.filter(item => item.isCompleted).length;
        return Math.round((completed / items.length) * 100);
    }
}

export const checklistService = new ChecklistService();

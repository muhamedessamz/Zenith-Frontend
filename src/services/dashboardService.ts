import api from '../lib/axios';
import type { DashboardStats, TasksPerDay } from '../types/dashboard';

class DashboardService {
    // Get comprehensive dashboard statistics
    async getStats(): Promise<DashboardStats> {
        const response = await api.get<DashboardStats>('/Dashboard/stats');
        return response.data;
    }

    // Get tasks created per day for the last N days
    async getTasksPerDay(days: number = 7): Promise<TasksPerDay[]> {
        const response = await api.get<TasksPerDay[]>(`/Dashboard/tasks-per-day?days=${days}`);
        return response.data;
    }
}

export const dashboardService = new DashboardService();

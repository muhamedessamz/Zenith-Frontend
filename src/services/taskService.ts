import api from '../lib/axios';
import type {
    Task,
    CreateTaskDto,
    UpdateTaskDto,
    TaskFilters,
    PaginatedResponse
} from '../types/task';

// Task Service
class TaskService {
    private readonly baseUrl = '/Tasks';

    // Get all tasks with optional filters
    async getTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
        const params = new URLSearchParams();

        // Add pagination
        params.append('page', String(filters?.page || 1));
        params.append('pageSize', String(filters?.pageSize || 20));

        // Add filters
        if (filters?.categoryId) {
            params.append('categoryId', String(filters.categoryId));
        }
        if (filters?.priority) {
            params.append('priority', filters.priority);
        }
        if (filters?.isCompleted !== undefined) {
            params.append('isCompleted', String(filters.isCompleted));
        }

        const url = `${this.baseUrl}/paged?${params.toString()}`;
        const response = await api.get<PaginatedResponse<Task>>(url);
        return response.data;
    }

    // Get task by ID
    async getTaskById(id: number): Promise<Task> {
        const response = await api.get<Task>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    // Create new task
    async createTask(data: CreateTaskDto): Promise<Task> {
        // Combine date and time if both are provided
        const taskData = this.prepareDateTimeData(data);
        // Convert priority to number for backend
        const preparedData = this.convertPriorityToNumber(taskData);
        const response = await api.post<Task>(this.baseUrl, preparedData);
        return response.data;
    }

    // Update task
    // Update task
    async updateTask(id: number, data: UpdateTaskDto): Promise<Task> {
        // Combine date and time if both are provided
        const taskData = this.prepareDateTimeData(data);
        // Convert priority to number for backend
        const preparedData = this.convertPriorityToNumber(taskData);

        // Final payload construction
        // removing taskId if it exists in data to avoid confusion, and ensuring id is set
        const { taskId, ...otherData } = preparedData;
        const finalData = { ...otherData, id: id };

        // Debug logging
        console.log('🔍 Update Task Payload:', finalData);

        const response = await api.put<Task>(`${this.baseUrl}/${id}`, finalData);
        return response.data;
    }

    // Helper to combine date and time
    private prepareDateTimeData(data: CreateTaskDto | UpdateTaskDto): any {
        const { dueTime, ...rest } = data;

        // If both date and time are provided, combine them
        if (data.dueDate && dueTime) {
            return {
                ...rest,
                dueDate: `${data.dueDate}T${dueTime}:00`  // ISO format: 2024-12-22T14:30:00
            };
        }

        // If only date is provided, use it as is
        return rest;
    }

    // Helper to convert priority string to number (backend expects enum values)
    private convertPriorityToNumber(data: any): any {
        if (!data.priority) return data;

        const priorityMap: Record<string, number> = {
            'Low': 1,
            'Medium': 2,
            'High': 3,
            'Critical': 4
        };

        return {
            ...data,
            priority: typeof data.priority === 'string'
                ? priorityMap[data.priority] || 2  // Default to Medium if not found
                : data.priority
        };
    }

    // Delete task
    async deleteTask(id: number): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    // Toggle task completion
    async toggleTaskCompletion(id: number): Promise<Task> {
        const task = await this.getTaskById(id);

        // The API returns priority as string, but we need to send it as the original value
        // The convertPriorityToNumber helper will handle the conversion
        return this.updateTask(id, {
            title: task.title,
            description: task.description,
            priority: task.priority, // Will be converted by convertPriorityToNumber
            categoryId: task.categoryId,
            projectId: task.projectId,
            dueDate: task.dueDate,
            isCompleted: !task.isCompleted,
            recurrencePattern: 0 // Default to None when toggling completion
        });
    }

    // Get tasks by status
    async getTasksByStatus(status: string): Promise<Task[]> {
        const response = await this.getTasks({ status, pageSize: 100 });
        return response.data;
    }

    // Get completed tasks
    async getCompletedTasks(): Promise<Task[]> {
        const response = await this.getTasks({ isCompleted: true, pageSize: 100 });
        return response.data;
    }

    // Get pending tasks
    async getPendingTasks(): Promise<Task[]> {
        const response = await this.getTasks({ isCompleted: false, pageSize: 100 });
        return response.data;
    }

    // Get overdue tasks
    async getOverdueTasks(): Promise<Task[]> {
        const response = await this.getTasks({ pageSize: 100 });
        const now = new Date();
        return response.data.filter(task =>
            task.dueDate &&
            new Date(task.dueDate) < now &&
            !task.isCompleted
        );
    }

    // Search tasks
    async searchTasks(query: string): Promise<Task[]> {
        const response = await this.getTasks({ searchQuery: query, pageSize: 100 });
        return response.data;
    }
}

export const taskService = new TaskService();

// Task Types
import type { Tag } from './tag';

export interface Task {
    id: number;
    title: string;
    description?: string;
    isCompleted: boolean;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    createdAt: string;
    completedAt?: string;
    dueDate?: string;
    userId: string;
    categoryId?: number;
    categoryName?: string;
    projectId?: number;
    projectTitle?: string;
    recurrencePattern?: number;
    nextOccurrence?: string;
    assignments?: TaskAssignment[];
    tags?: Tag[];
}

export interface TaskAssignment {
    id: number;
    taskId: number;
    assignedTo: {
        id: string;
        email: string;
        displayName: string;
        firstName: string;
        lastName: string;
        profilePicture?: string;
    };
    assignedAt: string;
    note?: string;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    priority?: 'Low' | 'Medium' | 'High' | 'Critical';
    isCompleted?: boolean;
    dueDate?: string;
    dueTime?: string;  // Added for time selection
    categoryId?: number;
    projectId?: number;
    recurrencePattern?: number;
}

export type UpdateTaskDto = CreateTaskDto;

export interface TaskFilters {
    status?: string;
    priority?: string;
    categoryId?: number;
    isCompleted?: boolean;
    searchQuery?: string;
    sortBy?: 'DueDate' | 'Priority' | 'CreatedAt' | 'Title';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

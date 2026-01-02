// Category Types

export interface Category {
    id: number;
    name: string;
    description?: string;
    color: string;
    createdAt: string;
    userId: string;
    taskCount: number;
}

export interface CreateCategoryDto {
    name: string;
    description?: string;
    color?: string;
}

export interface UpdateCategoryDto {
    id: number;
    name: string;
    description?: string;
    color: string;
}

export interface ChecklistItem {
    id: number;
    title: string;
    isCompleted: boolean;
    order: number;
    createdAt: string;
    taskId: number;
}

export interface CreateChecklistItemDto {
    title: string;
    order: number;
}

export interface UpdateChecklistItemDto {
    id: number;
    title: string;
    isCompleted: boolean;
    order: number;
}

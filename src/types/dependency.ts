export interface TaskDependency {
    id: number;
    taskId: number;
    dependsOnTaskId: number;
    dependsOnTask: {
        id: number;
        title: string;
        isCompleted: boolean;
        priority: string;
    };
    createdAt: string;
}

export interface CreateDependencyDto {
    dependsOnTaskId: number;
}

export interface DependencyBlocker {
    taskId: number;
    taskTitle: string;
    isCompleted: boolean;
    blockedTasks: Array<{
        id: number;
        title: string;
    }>;
}

export interface Notification {
    type: string;
    message: string;
    taskId?: number;
    projectId?: number;
    commentId?: number;
    timestamp: string;
    read?: boolean;
    id?: string;
}

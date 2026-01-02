// Tag Types matching Backend DTOs

export interface Tag {
    id: number;
    name: string;
    color: string;
    createdAt: string;
    taskCount: number;
}

export interface CreateTagDto {
    name: string;
    color: string;
}

export interface UpdateTagDto {
    id: number;
    name: string;
    color: string;
}

// Task-Tag relationship
export interface TaskTag {
    id: number;
    taskId: number;
    tagId: number;
    tag: Tag;
}

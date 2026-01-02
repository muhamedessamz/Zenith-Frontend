export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    updatedAt?: string;
    userName?: string; // Legacy
    userId?: string;
    user?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        displayName?: string;
        profilePicture?: string;
    }
}

export interface CreateCommentDto {
    content: string;
}

export interface UpdateCommentDto {
    content: string;
}

import api from '../lib/axios';
import type { Comment, CreateCommentDto, UpdateCommentDto } from '../types/comment';


export const commentService = {
    // Get all comments for a task
    getComments: async (taskId: number): Promise<Comment[]> => {
        const response = await api.get(`/tasks/${taskId}/comments`);
        return response.data;
    },

    // Create a new comment
    createComment: async (taskId: number, dto: CreateCommentDto): Promise<Comment> => {
        const response = await api.post(`/tasks/${taskId}/comments`, dto);
        return response.data;
    },

    // Update a comment
    updateComment: async (taskId: number, commentId: number, dto: UpdateCommentDto): Promise<Comment> => {
        const response = await api.put(`/tasks/${taskId}/comments/${commentId}`, dto);
        return response.data;
    },

    // Delete a comment
    deleteComment: async (taskId: number, commentId: number): Promise<void> => {
        await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    },
};

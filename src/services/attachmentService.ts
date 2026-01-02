import api from '../lib/axios';
import type { Attachment } from '../types/attachment';

const API_URL = import.meta.env.VITE_API_URL || 'http://zenith.runasp.net';

export const attachmentService = {
    // Get all attachments for a task
    getAttachments: async (taskId: number): Promise<Attachment[]> => {
        const response = await api.get(`/tasks/${taskId}/attachments`);
        return response.data;
    },

    // Upload a file
    uploadFile: async (taskId: number, file: File): Promise<Attachment> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(
            `/tasks/${taskId}/attachments`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    // Delete an attachment
    deleteAttachment: async (taskId: number, attachmentId: number): Promise<void> => {
        await api.delete(`/api/tasks/${taskId}/attachments/${attachmentId}`);
    },

    // Get download URL
    getDownloadUrl: (filePath: string): string => {
        return `${API_URL}/${filePath}`;
    },

    // Format file size
    formatFileSize: (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
};

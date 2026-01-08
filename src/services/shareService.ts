import api from '../lib/axios';
import type { SharedLink, GenerateLinkRequest, SharedContent } from '../types/share';


export const shareService = {
    // Generate a shared link
    generateLink: async (request: GenerateLinkRequest): Promise<SharedLink> => {
        const response = await api.post('/share/generate', request);
        const data = response.data;

        // Replace API URL with frontend URL
        const frontendUrl = window.location.origin;
        const publicUrl = `${frontendUrl}/shared/${data.token}`;

        return {
            ...data,
            publicUrl,
        };
    },

    // View shared content (no auth required)
    viewSharedContent: async (token: string): Promise<SharedContent> => {
        const response = await api.get(`/share/view/${token}`);
        return response.data;
    },

    // Revoke a shared link
    revokeLink: async (token: string): Promise<void> => {
        await api.delete(`/share/revoke/${token}`);
    },

    // Copy link to clipboard
    copyToClipboard: async (url: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(url);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    },
};

import api from '../lib/axios';
import type { TimeEntry, TimeTrackingStats } from '../types/timeTracking';

export const timeTrackingService = {
    // Start timer for a task
    startTimer: async (taskId: number): Promise<TimeEntry> => {
        const response = await api.post(`/tasks/${taskId}/time/start`);
        return response.data;
    },

    // Stop timer for a task
    stopTimer: async (taskId: number): Promise<TimeEntry> => {
        const response = await api.post(`/tasks/${taskId}/time/stop`);
        return response.data;
    },

    // Get time tracking history and stats
    getTaskHistory: async (taskId: number): Promise<TimeTrackingStats> => {
        const response = await api.get(`/tasks/${taskId}/time`);
        return response.data;
    }
};

import api from '../lib/axios';

// Export interface first
export interface CalendarConnectionStatus {
    isConnected: boolean;
    connectedEmail?: string;
    connectedAt?: string;
}

// Calendar Service class
class CalendarService {
    // Get OAuth URL to connect Google Calendar
    async getConnectUrl(): Promise<string> {
        const response = await api.get<{ authUrl: string }>('/calendar/connect');
        return response.data.authUrl;
    }

    // Check connection status
    async getConnectionStatus(): Promise<CalendarConnectionStatus> {
        try {
            const response = await api.get<CalendarConnectionStatus>('/calendar/status');
            return response.data;
        } catch (error) {
            return { isConnected: false };
        }
    }

    // Disconnect Google Calendar
    async disconnect(): Promise<void> {
        await api.post('/calendar/disconnect');
    }

    // Manually sync a task to calendar
    async syncTask(taskId: number): Promise<void> {
        await api.post(`/calendar/sync/${taskId}`);
    }

    // Open OAuth popup and handle callback
    async connectWithPopup(): Promise<boolean> {
        try {
            const authUrl = await this.getConnectUrl();

            // Open popup window
            const width = 600;
            const height = 700;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;

            const popup = window.open(
                authUrl,
                'Google Calendar Authorization',
                `width=${width},height=${height},left=${left},top=${top}`
            );

            if (!popup) {
                throw new Error('Popup blocked. Please allow popups for this site.');
            }

            // Wait for popup to close or callback
            return new Promise((resolve) => {
                const checkPopup = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkPopup);
                        // Check if connection was successful
                        this.getConnectionStatus().then(status => {
                            resolve(status.isConnected);
                        });
                    }
                }, 500);

                // Timeout after 5 minutes
                setTimeout(() => {
                    clearInterval(checkPopup);
                    if (!popup.closed) {
                        popup.close();
                    }
                    resolve(false);
                }, 300000);
            });
        } catch (error) {
            console.error('Failed to connect calendar:', error);
            return false;
        }
    }
}

// Export service instance
export const calendarService = new CalendarService();

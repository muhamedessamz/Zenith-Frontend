import * as signalR from '@microsoft/signalr';
import type { Notification } from '../types/notification';

const API_URL = import.meta.env.VITE_API_URL || 'http://zenith.runasp.net';

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private listeners: ((notification: Notification) => void)[] = [];

    private isConnecting = false;

    async connect() {
        const token = localStorage.getItem('zenith_token');
        if (!token) return;

        // Prevent multiple simultaneous connection attempts
        if (this.isConnecting) return;

        // If already connected, don't reconnect
        if (this.connection?.state === signalR.HubConnectionState.Connected) return;

        this.isConnecting = true;

        try {
            // Disconnect existing connection if it's not in a clean state
            if (this.connection) {
                await this.disconnect();
            }

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(`${API_URL}/hubs/notifications`, {
                    accessTokenFactory: () => token,
                    skipNegotiation: true, // Try to skip negotiation if using WebSockets directly (optional, but helps with some proxies)
                    transport: signalR.HttpTransportType.WebSockets // Force WebSockets to avoid fallback issues
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.None)
                .build();

            this.connection.on('ReceiveNotification', (notification: Notification) => {
                this.onNotificationReceived(notification);
            });

            this.connection.onclose(async (_error) => {
                this.isConnecting = false;
                // console.log('SignalR Connection closed', error);
            });

            await this.connection.start();
            console.log('✅ SignalR Connected');
        } catch (err: any) {
            // Ignore AbortError which happens when component unmounts quickly (React Strict Mode)
            if (err && err.message && err.message.includes('before stop() was called')) {
                console.debug('SignalR connection cancelled (likely due to unmount).');
                return;
            }
            console.error('SignalR Connection Error:', err);
        } finally {
            this.isConnecting = false;
        }
    }

    private onNotificationReceived(notification: Notification) {
        this.listeners.forEach(listener => listener(notification));
        this.showBrowserNotification(notification);
    }

    async disconnect() {
        this.isConnecting = false;
        if (this.connection) {
            try {
                await this.connection.stop();
                console.log('SignalR Disconnected');
            } catch (err) {
                // Ignore errors during disconnection
            }
            this.connection = null;
        }
    }

    onNotification(callback: (notification: Notification) => void) {
        this.listeners.push(callback);

        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    private showBrowserNotification(notification: Notification) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Task Management', {
                body: notification.message,
                icon: '/logo.png',
                tag: notification.id,
            });
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }
}

export const signalRService = new SignalRService();

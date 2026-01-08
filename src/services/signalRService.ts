import * as signalR from '@microsoft/signalr';
import type { Notification } from '../types/notification';

// Backend doesn't support HTTPS, so we MUST use Vercel proxy
// Use Long Polling instead of WebSockets (Vercel limitation)
const SIGNALR_URL = import.meta.env.VITE_API_URL || '';
const USE_PROXY = !import.meta.env.VITE_API_URL; // Use proxy in production

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

            // Use Vercel proxy in production (relative path), direct connection in dev
            const hubUrl = USE_PROXY ? '/hubs/notifications' : `${SIGNALR_URL}/hubs/notifications`;

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(hubUrl, {
                    accessTokenFactory: () => token,
                    // Force Long Polling in production (Vercel proxy limitation)
                    ...(USE_PROXY && {
                        transport: signalR.HttpTransportType.LongPolling,
                        skipNegotiation: false
                    })
                })
                .withAutomaticReconnect([0, 2000, 5000, 10000]) // Retry with delays
                .configureLogging(signalR.LogLevel.Information)
                .build();

            this.connection.onreconnecting((error) => {
                console.log('SignalR reconnecting...', error);
            });

            this.connection.onreconnected(() => {
                console.log('✅ SignalR reconnected');
            });

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

            // Log warning but don't throw - app should work without SignalR
            console.warn('⚠️ SignalR connection failed (notifications disabled):', err.message || err);
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

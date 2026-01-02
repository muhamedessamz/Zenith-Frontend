import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import {
    Calendar as CalendarIcon,
    Link2,
    CheckCircle2,
    XCircle,
    Loader2,
    RefreshCw,
    AlertCircle,
    ExternalLink,
    Settings
} from 'lucide-react';
import { calendarService } from '../services/calendarService';
import type { CalendarConnectionStatus } from '../types/calendarConnection';
import { toast } from 'react-hot-toast';

export const CalendarSettingsPage = () => {
    const [status, setStatus] = useState<CalendarConnectionStatus>({ isConnected: false });
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const connectionStatus = await calendarService.getConnectionStatus();
            setStatus(connectionStatus);
        } catch (error) {
            console.error('Failed to fetch calendar status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        try {
            setConnecting(true);
            const success = await calendarService.connectWithPopup();

            if (success) {
                toast.success('Google Calendar connected successfully!');
                await fetchStatus();
            } else {
                toast.error('Failed to connect Google Calendar. Please try again.');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to connect Google Calendar');
        } finally {
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm('Are you sure you want to disconnect Google Calendar? Your tasks will no longer sync.')) {
            return;
        }

        try {
            setDisconnecting(true);
            await calendarService.disconnect();
            toast.success('Google Calendar disconnected successfully');
            await fetchStatus();
        } catch (error) {
            toast.error('Failed to disconnect Google Calendar');
        } finally {
            setDisconnecting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
                        <span className="gradient-text">Calendar Settings</span>
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                        Connect and manage your Google Calendar integration
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <Loader2 size={48} className="animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading calendar settings...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Connection Status Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w - 12 h - 12 rounded - lg flex items - center justify - center ${status.isConnected ? 'bg-green-100' : 'bg-gray-100'
                                    } `}>
                                    <CalendarIcon size={24} className={
                                        status.isConnected ? 'text-green-600' : 'text-gray-400'
                                    } />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Google Calendar Integration
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {status.isConnected
                                            ? 'Your account is connected'
                                            : 'Connect your Google Calendar to sync tasks'}
                                    </p>
                                </div>
                                {status.isConnected ? (
                                    <CheckCircle2 size={32} className="text-green-600" />
                                ) : (
                                    <XCircle size={32} className="text-gray-400" />
                                )}
                            </div>

                            {/* Connection Details */}
                            {status.isConnected && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-green-900">
                                                Connected Account
                                            </p>
                                            {status.connectedEmail && (
                                                <p className="text-sm text-green-700 mt-1">
                                                    {status.connectedEmail}
                                                </p>
                                            )}
                                            {status.connectedAt && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    Connected on {new Date(status.connectedAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {status.isConnected ? (
                                    <>
                                        <button
                                            onClick={fetchStatus}
                                            className="flex-1 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium flex items-center justify-center gap-2"
                                        >
                                            <RefreshCw size={20} />
                                            Refresh Status
                                        </button>
                                        <button
                                            onClick={handleDisconnect}
                                            disabled={disconnecting}
                                            className="flex-1 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {disconnecting ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" />
                                                    Disconnecting...
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={20} />
                                                    Disconnect
                                                </>
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleConnect}
                                        disabled={connecting}
                                        className="w-full btn btn-primary py-4 text-lg"
                                    >
                                        {connecting ? (
                                            <>
                                                <Loader2 size={24} className="animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <Link2 size={24} />
                                                Connect Google Calendar
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* How It Works */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Settings size={20} className="text-gray-700" />
                                <h3 className="text-lg font-bold text-gray-900">How It Works</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Connect Your Account</h4>
                                        <p className="text-sm text-gray-600">
                                            Click the connect button to authorize access to your Google Calendar
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Automatic Sync</h4>
                                        <p className="text-sm text-gray-600">
                                            Your tasks will automatically sync to Google Calendar when created or updated
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Stay Organized</h4>
                                        <p className="text-sm text-gray-600">
                                            View and manage your tasks from both platforms seamlessly
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Features</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Auto-Sync Tasks</p>
                                        <p className="text-sm text-gray-600">Tasks sync automatically to calendar</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Due Date Events</p>
                                        <p className="text-sm text-gray-600">Tasks with due dates become events</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Real-Time Updates</p>
                                        <p className="text-sm text-gray-600">Changes sync instantly</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Secure Connection</p>
                                        <p className="text-sm text-gray-600">OAuth 2.0 authentication</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Privacy Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900 mb-1">
                                        Privacy & Security
                                    </p>
                                    <p className="text-sm text-blue-700">
                                        We only access your calendar to create and manage events for your tasks.
                                        Your data is encrypted and we never share it with third parties.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Help Link */}
                        <div className="text-center">
                            <a
                                href="https://support.google.com/calendar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
                            >
                                Need help with Google Calendar?
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

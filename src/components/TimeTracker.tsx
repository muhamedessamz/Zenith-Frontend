import { useState, useEffect, useRef } from 'react';
import { Play, Square, History, User as UserIcon } from 'lucide-react';
import { timeTrackingService } from '../services/timeTrackingService';
import type { TimeEntry, TimeTrackingStats } from '../types/timeTracking';
import { format } from 'date-fns';

interface TimeTrackerProps {
    taskId: number;
}

export const TimeTracker = ({ taskId }: TimeTrackerProps) => {
    const [stats, setStats] = useState<TimeTrackingStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchHistory();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [taskId]);

    // Check for active timer on stats update
    useEffect(() => {
        if (stats) {
            const running = stats.entries.find(e => !e.endTime);
            setActiveEntry(running || null);

            if (running) {
                // Ensure the start time is treated as UTC
                let startTimeStr = running.startTime;
                if (!startTimeStr.endsWith('Z')) {
                    startTimeStr += 'Z';
                }
                const startTime = new Date(startTimeStr).getTime();

                const updateTimer = () => {
                    const now = new Date().getTime();
                    const diff = Math.max(0, Math.floor((now - startTime) / 1000));
                    setElapsedSeconds(diff);
                };
                updateTimer();
                timerRef.current = setInterval(updateTimer, 1000);
            } else {
                if (timerRef.current) clearInterval(timerRef.current);
                setElapsedSeconds(0);
            }
        }
    }, [stats]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const data = await timeTrackingService.getTaskHistory(taskId);
            setStats(data);
            setError(null);
        } catch (err) {
            console.error('Failed to load time history:', err);
            setError('Failed to load time history');
        } finally {
            setLoading(false);
        }
    };

    const handleStart = async () => {
        try {
            setError(null);
            await timeTrackingService.startTimer(taskId);
            await fetchHistory(); // Refresh to get the new active entry
        } catch (err: any) {
            setError(err.response?.data || 'Failed to start timer');
        }
    };

    const handleStop = async () => {
        try {
            setError(null);
            await timeTrackingService.stopTimer(taskId);
            if (timerRef.current) clearInterval(timerRef.current);
            await fetchHistory();
        } catch (err: any) {
            setError(err.response?.data || 'Failed to stop timer');
        }
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const calculateDuration = (start: string, end: string) => {
        const diff = new Date(end).getTime() - new Date(start).getTime();
        return formatDuration(Math.floor(diff / 1000));
    };

    if (loading && !stats) {
        return <div className="p-4 text-center text-gray-500">Loading time data...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Active Timer / Controls */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col items-center justify-center">
                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="text-4xl font-mono font-bold text-gray-900 mb-6 tracking-wider">
                    {activeEntry ? formatDuration(elapsedSeconds) : (stats?.totalTime || "00:00:00")}
                </div>

                {activeEntry ? (
                    <button
                        onClick={handleStop}
                        className="flex items-center gap-2 px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-200 font-medium"
                    >
                        <Square size={20} fill="currentColor" />
                        Stop Timer
                    </button>
                ) : (
                    <button
                        onClick={handleStart}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 font-medium"
                    >
                        <Play size={20} fill="currentColor" />
                        Start Timer
                    </button>
                )}

                <div className="mt-4 text-sm text-gray-500">
                    {activeEntry ? 'Timer is running...' : 'Total time spent on this task'}
                </div>
            </div>

            {/* History List */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
                    <History size={16} />
                    Time Logs
                </h3>

                <div className="space-y-3">
                    {stats?.entries && stats.entries.length > 0 ? (
                        stats.entries.slice().reverse().map((entry) => (
                            <div key={entry.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg text-sm hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <UserIcon size={14} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{entry.userName}</div>
                                        <div className="text-gray-500 text-xs">
                                            {format(new Date(entry.startTime), 'MMM d, yyyy HH:mm')}
                                        </div>
                                    </div>
                                </div>
                                <div className="font-mono text-gray-600 font-medium">
                                    {entry.endTime ? calculateDuration(entry.startTime, entry.endTime) : (
                                        <span className="text-green-600 animate-pulse">Running...</span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-4 text-sm">No time entries recorded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

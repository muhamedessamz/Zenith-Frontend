import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { shareService } from '../services/shareService';
import { Loader2, CheckCircle2, Calendar, Tag, AlertCircle, Flag } from 'lucide-react';
import type { SharedContent } from '../types/share';

export const SharedViewPage = () => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Low': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    const { token } = useParams<{ token: string }>();
    const [content, setContent] = useState<SharedContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            fetchSharedContent(token);
        }
    }, [token]);

    const fetchSharedContent = async (token: string) => {
        try {
            setLoading(true);
            const data = await shareService.viewSharedContent(token);
            setContent(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load shared content');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading shared content...</p>
                </div>
            </div>
        );
    }

    if (error || !content) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h1>
                    <p className="text-gray-600 mb-6">
                        {error || 'This link is invalid, expired, or has been revoked.'}
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Go to Homepage
                    </a>
                </div>
            </div>
        );
    }

    // Render Task
    if (content.entityType === 'Task') {
        const task = content.data;

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
                        <div className="flex items-start gap-4">
                            {/* Read-only Checkbox */}
                            <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center mt-1 ${task.isCompleted
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300'
                                }`}>
                                {task.isCompleted && <CheckCircle2 size={16} className="text-white" />}
                            </div>

                            {/* Task Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <h1 className={`text-xl font-bold ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                        {task.title}
                                    </h1>
                                </div>

                                {task.description && (
                                    <p className="text-gray-600 text-base mb-6">{task.description}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Completion Badge */}
                                    {task.isCompleted && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                            <CheckCircle2 size={14} />
                                            Completed
                                        </span>
                                    )}

                                    {/* Priority Badge */}
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                        <Flag size={14} />
                                        {task.priority || 'Medium'}
                                    </span>

                                    {/* Due Date & Time */}
                                    {task.dueDate && (
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                            <Calendar size={14} />
                                            {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                            {new Date(task.dueDate).getHours() !== 0 || new Date(task.dueDate).getMinutes() !== 0 ? (
                                                <span className="ml-1 font-medium">
                                                    {new Date(task.dueDate).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    })}
                                                </span>
                                            ) : null}
                                        </span>
                                    )}

                                    {/* Category */}
                                    {task.categoryName && (
                                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-200 flex items-center gap-1">
                                            <Tag size={14} />
                                            {task.categoryName}
                                        </span>
                                    )}
                                </div>

                                {(task.projectTitle || task.createdAt) && (
                                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-500">
                                        {task.projectTitle && (
                                            <div>
                                                <span className="font-medium text-gray-700">Project:</span> {task.projectTitle}
                                            </div>
                                        )}
                                        {task.createdAt && (
                                            <div>
                                                <span className="font-medium text-gray-700">Created:</span> {new Date(task.createdAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Branding */}
                    <div className="text-center mt-8">
                        <a
                            href="/"
                            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                        >
                            Powered by Zenith
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback for other entity types
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Shared Content</h1>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
                    {JSON.stringify(content, null, 2)}
                </pre>
            </div>
        </div>
    );
};

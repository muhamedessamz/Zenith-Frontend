import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Navbar } from '../components/Navbar';
import {
    Plus,
    Calendar,
    CheckCircle2,
    Trash2,
    Edit,
    Loader2,
    AlertCircle,
    Flag
} from 'lucide-react';
import { taskService } from '../services/taskService';
import type { Task, TaskFilters } from '../types/task';
import { TaskModal } from '../components/TaskModal';
import { TagBadge } from '../components/Tags/TagBadge';

export const TasksPage = () => {
    // const { logout } = useAuthStore();
    const navigate = useNavigate();

    // State
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<TaskFilters>({
        page: 1,
        pageSize: 20
    });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });
    const [categories, setCategories] = useState<any[]>([]);

    // Fetch categories for filter
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { categoryService } = await import('../services/categoryService');
                const data = await categoryService.getCategories();
                setCategories(data);
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch tasks
    useEffect(() => {
        fetchTasks();
    }, [filters]);

    const fetchTasks = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            setError(null);
            const response = await taskService.getTasks(filters);
            setTasks(response.data);
            setPagination(response.pagination);
        } catch (err: any) {
            console.error('Failed to fetch tasks:', err);
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load tasks');
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    const handleFilterChange = (key: keyof TaskFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setShowCreateModal(true);
    };

    const handleEditTask = (task: Task) => {
        navigate(`/tasks/${task.id}`);
    };

    const handleDeleteTask = async (id: number) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await taskService.deleteTask(id);
            fetchTasks();
        } catch (err: any) {
            alert(err.response?.data?.error || err.response?.data?.message || 'Failed to delete task');
        }
    };

    const handleToggleComplete = async (task: Task) => {
        // 1. Optimistic Update: Update UI immediately
        const previousTasks = [...tasks];
        setTasks(currentTasks =>
            currentTasks.map(t =>
                t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
            )
        );

        try {
            // 2. Perform API call
            await taskService.toggleTaskCompletion(task.id);

            // 3. Optional: Sync in background without loader
            fetchTasks(false);
        } catch (err: any) {
            // 4. Revert UI on failure
            setTasks(previousTasks);

            console.error('Toggle complete error:', err);
            const errorData = err.response?.data;
            let errorMessage = 'Failed to update task';

            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.errors) {
                    // ASP.NET Core Validation Errors
                    errorMessage = Object.entries(errorData.errors)
                        .map(([key, msgs]: [string, any]) => `${key}: ${msgs.join(', ')}`)
                        .join('\n');
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else {
                    errorMessage = JSON.stringify(errorData, null, 2);
                }
            }

            alert(`Error updating task:\n${errorMessage}`);
        }
    };



    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Low': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Shared Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
                            <span className="gradient-text">Tasks</span>
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg">Manage and organize your tasks efficiently</p>
                    </div>
                    <button onClick={handleCreateTask} className="hidden sm:flex btn btn-primary shadow-lg hover:shadow-xl transition-shadow">
                        <Plus size={20} />
                        Create Task
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Category</label>
                            <select
                                value={filters.categoryId || ''}
                                onChange={(e) => handleFilterChange('categoryId', e.target.value ? parseInt(e.target.value) : undefined)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category: any) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Priority</label>
                            <select
                                value={filters.priority || ''}
                                onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                                <option value="">All Priorities</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
                            <select
                                value={filters.isCompleted === undefined ? '' : filters.isCompleted ? 'completed' : 'pending'}
                                onChange={(e) => handleFilterChange('isCompleted', e.target.value === '' ? undefined : e.target.value === 'completed')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                                <option value="">All Tasks</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tasks List */}
                {loading ? (
                    <div className="text-center py-20">
                        <Loader2 size={48} className="animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading tasks...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button onClick={() => fetchTasks()} className="btn btn-primary">Try Again</button>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={48} className="text-gray-400" />
                        </div>
                        {filters.categoryId || filters.priority || filters.isCompleted !== undefined ? (
                            <>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No matching tasks</h3>
                                <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
                                <button
                                    onClick={() => setFilters({ page: 1, pageSize: 20 })}
                                    className="btn btn-secondary shadow-lg"
                                >
                                    Clear Filters
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No tasks found</h3>
                                <p className="text-gray-600 mb-6">Create your first task to get started!</p>
                                <button onClick={handleCreateTask} className="btn btn-primary shadow-lg">
                                    <Plus size={20} />
                                    Create Task
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            {tasks.map((task) => (
                                <div key={task.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        {/* Checkbox */}
                                        <button
                                            onClick={() => handleToggleComplete(task)}
                                            className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all mt-1 ${task.isCompleted
                                                ? 'bg-green-500 border-green-500'
                                                : 'border-gray-300 hover:border-indigo-500'
                                                }`}
                                        >
                                            {task.isCompleted && <CheckCircle2 size={16} className="text-white" />}
                                        </button>

                                        {/* Task Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <h3
                                                    className={`text-lg font-semibold ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
                                                        }`}
                                                >
                                                    {task.title}
                                                </h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditTask(task)}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {task.description && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
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
                                                    {task.priority}
                                                </span>

                                                {/* Due Date & Time */}
                                                {task.dueDate && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                                        <Calendar size={14} />
                                                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                        {/* Show time if it's not midnight (00:00) */}
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
                                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-200">
                                                        {task.categoryName}
                                                    </span>
                                                )}

                                                {/* Tags */}
                                                {task.tags && task.tags.length > 0 && (
                                                    <>
                                                        {task.tags.map(tag => (
                                                            <TagBadge key={tag.id} tag={tag} size="sm" />
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-600">
                                    Showing {((pagination.currentPage - 1) * filters.pageSize!) + 1} to{' '}
                                    {Math.min(pagination.currentPage * filters.pageSize!, pagination.totalItems)} of{' '}
                                    {pagination.totalItems} tasks
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleFilterChange('page', filters.page! - 1)}
                                        disabled={!pagination.hasPreviousPage}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handleFilterChange('page', filters.page! + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Floating Action Button (Mobile Only) */}
            <button
                onClick={handleCreateTask}
                className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center z-40 active:scale-95"
                aria-label="Create Task"
            >
                <Plus size={28} strokeWidth={2.5} />
            </button>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <TaskModal
                    task={editingTask}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingTask(null);
                    }}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        setEditingTask(null);
                        fetchTasks();
                    }}
                />
            )}
        </div>
    );
};

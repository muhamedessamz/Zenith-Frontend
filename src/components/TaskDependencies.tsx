import { useState, useEffect } from 'react';
import { Link2, X, AlertCircle, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { dependencyService } from '../services/dependencyService';
import { taskService } from '../services/taskService';
import type { TaskDependency } from '../types/dependency';
import type { Task } from '../types/task';

interface TaskDependenciesProps {
    taskId: number;
    onDependenciesChange?: () => void;
}

export const TaskDependencies = ({ taskId, onDependenciesChange }: TaskDependenciesProps) => {
    const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
    const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchDependencies();
    }, [taskId]);

    const fetchDependencies = async () => {
        try {
            setLoading(true);
            const deps = await dependencyService.getDependencies(taskId);
            setDependencies(deps);
        } catch (error) {
            console.error('Failed to load dependencies:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableTasks = async () => {
        try {
            const response = await taskService.getTasks({ pageSize: 100 });
            // Filter out current task and already dependent tasks
            const dependentTaskIds = dependencies.map(d => d.dependsOnTaskId);
            const filtered = response.data.filter(
                t => t.id !== taskId && !dependentTaskIds.includes(t.id)
            );
            setAvailableTasks(filtered);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    const handleAddDependency = async () => {
        if (!selectedTaskId) return;

        try {
            setAdding(true);
            await dependencyService.addDependency(taskId, selectedTaskId);
            await fetchDependencies();
            setShowAddDialog(false);
            setSelectedTaskId(null);
            setSearchQuery('');
            onDependenciesChange?.();
        } catch (error: any) {
            console.error('Failed to add dependency:', error);
            alert(error.response?.data?.error || 'Failed to add dependency. This might create a circular dependency.');
        } finally {
            setAdding(false);
        }
    };

    const handleRemoveDependency = async (dependsOnTaskId: number) => {
        if (!window.confirm('Are you sure you want to remove this dependency?')) return;

        try {
            await dependencyService.removeDependency(taskId, dependsOnTaskId);
            await fetchDependencies();
            onDependenciesChange?.();
        } catch (error) {
            console.error('Failed to remove dependency:', error);
            alert('Failed to remove dependency');
        }
    };

    const handleOpenAddDialog = () => {
        setShowAddDialog(true);
        fetchAvailableTasks();
    };

    const filteredTasks = availableTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const canStart = dependencyService.canStartTask(dependencies);
    const incompleteDeps = dependencyService.getIncompleteDependencies(dependencies);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'text-red-600 bg-red-50';
            case 'High': return 'text-orange-600 bg-orange-50';
            case 'Medium': return 'text-blue-600 bg-blue-50';
            case 'Low': return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link2 size={20} className="text-gray-700" />
                    <h3 className="font-semibold text-gray-900">Dependencies ({dependencies.length})</h3>
                </div>
                <button
                    onClick={handleOpenAddDialog}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                >
                    Add Dependency
                </button>
            </div>

            {/* Status Warning */}
            {dependencies.length > 0 && !canStart && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-amber-900">
                            This task cannot be started yet
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                            {incompleteDeps.length} {incompleteDeps.length === 1 ? 'dependency' : 'dependencies'} must be completed first
                        </p>
                    </div>
                </div>
            )}

            {/* Dependencies List */}
            <div className="space-y-2">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">
                        <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                        Loading dependencies...
                    </div>
                ) : dependencies.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        No dependencies yet. This task can be started anytime.
                    </div>
                ) : (
                    dependencies.map((dep) => (
                        <div
                            key={dep.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${dep.dependsOnTask.isCompleted
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-white border-gray-200 hover:border-indigo-300'
                                }`}
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {dep.dependsOnTask.isCompleted ? (
                                    <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                                ) : (
                                    <AlertCircle size={20} className="text-amber-600 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${dep.dependsOnTask.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                                        }`}>
                                        {dep.dependsOnTask.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(dep.dependsOnTask.priority)}`}>
                                            {dep.dependsOnTask.priority}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {dep.dependsOnTask.isCompleted ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveDependency(dep.dependsOnTaskId)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                                title="Remove dependency"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Dependency Dialog */}
            {showAddDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                        {/* Dialog Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Add Dependency</h3>
                            <button
                                onClick={() => setShowAddDialog(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search tasks..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        {/* Tasks List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {filteredTasks.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No tasks available
                                </div>
                            ) : (
                                filteredTasks.map((task) => (
                                    <button
                                        key={task.id}
                                        onClick={() => setSelectedTaskId(task.id)}
                                        className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedTaskId === task.id
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            {task.isCompleted && (
                                                <span className="text-xs text-green-600">✓ Completed</span>
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Dialog Footer */}
                        <div className="p-4 border-t border-gray-200 flex gap-2">
                            <button
                                onClick={() => setShowAddDialog(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddDependency}
                                disabled={!selectedTaskId || adding}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {adding ? 'Adding...' : 'Add Dependency'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

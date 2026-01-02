import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { categoryService } from '../services/categoryService';
import { projectService } from '../services/projectService';
import { Navbar } from '../components/Navbar';
import { TaskDetailsHeader } from '../components/TaskDetails/TaskDetailsHeader';
import { TaskDetailsActions } from '../components/TaskDetails/TaskDetailsActions';
import { TaskDetailsSidebar } from '../components/TaskDetails/TaskDetailsSidebar';
import { TaskDetailsContent } from '../components/TaskDetails/TaskDetailsContent';
import { TaskAssignments } from '../components/TaskDetails/TaskAssignments';
import { ShareModal } from '../components/ShareModal';
import type { Task } from '../types/task';

export const TaskDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [showShareModal, setShowShareModal] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        fetchTask();
        fetchCategories();
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchTask = async () => {
        try {
            setLoading(true);
            const data = await taskService.getTaskById(Number(id));
            setTask(data);
        } catch (error) {
            console.error('Failed to fetch task:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };

    const handleToggleComplete = async () => {
        if (!task) return;
        try {
            await taskService.toggleTaskCompletion(task.id);
            await fetchTask();
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const handleDelete = async () => {
        if (!task) return;
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await taskService.deleteTask(task.id);
            navigate('/tasks');
        } catch (error) {
            console.error('Failed to delete task:', error);
            alert('Failed to delete task. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="text-center">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mx-auto"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent absolute top-0 left-1/2 -translate-x-1/2"></div>
                        </div>
                        <p className="mt-6 text-gray-600 font-medium">Loading task details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Not Found</h2>
                        <p className="text-gray-600 mb-6">The task you're looking for doesn't exist or has been deleted.</p>
                        <button
                            onClick={() => navigate('/tasks')}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                        >
                            ← Back to Tasks
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const category = categories.find(c => c.id === task.categoryId);
    const project = projects.find(p => p.id === task.projectId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Actions */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <TaskDetailsHeader
                            task={task}
                            onToggleComplete={handleToggleComplete}
                        />
                    </div>
                    <TaskDetailsActions
                        onShare={() => setShowShareModal(true)}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <TaskDetailsSidebar
                            task={task}
                            category={category}
                            project={project}
                            onUpdate={fetchTask}
                        />
                        <TaskAssignments
                            taskId={task.id}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <TaskDetailsContent taskId={task.id} />
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <ShareModal
                    entityType="Task"
                    entityId={task.id}
                    entityTitle={task.title}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
};

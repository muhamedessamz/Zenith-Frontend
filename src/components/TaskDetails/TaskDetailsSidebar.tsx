import { useState, useEffect } from 'react';
import { Calendar, Flag, Folder, Clock, Edit2, Save, X } from 'lucide-react';
import { taskService } from '../../services/taskService';
import { categoryService } from '../../services/categoryService';
import { projectService } from '../../services/projectService';
import type { Task } from '../../types/task';
import type { Category } from '../../types/category';
import type { Project } from '../../types/project';

interface TaskDetailsSidebarProps {
    task: Task;
    category?: Category;
    project?: Project;
    onUpdate: () => void;
}

interface TaskFormData {
    title: string;
    description: string;
    priority: string;
    categoryId?: number;
    projectId?: number;
    dueDate: string;
    dueTime: string;
}

export const TaskDetailsSidebar = ({ task, category, project, onUpdate }: TaskDetailsSidebarProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [formData, setFormData] = useState<TaskFormData>({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        categoryId: task.categoryId,
        projectId: task.projectId,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        dueTime: task.dueDate ? new Date(task.dueDate).toTimeString().slice(0, 5) : '',
    });

    useEffect(() => {
        fetchCategories();
        fetchProjects();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            setCategories([]);
        }
    };

    const fetchProjects = async () => {
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error) {
            setProjects([]);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Combine date and time
            let dueDate: string | undefined = undefined;
            if (formData.dueDate) {
                const dateTime = formData.dueTime
                    ? `${formData.dueDate}T${formData.dueTime}:00`
                    : `${formData.dueDate}T00:00:00`;
                dueDate = new Date(dateTime).toISOString();
            }

            await taskService.updateTask(task.id, {
                title: formData.title,
                description: formData.description,
                priority: formData.priority as 'Low' | 'Medium' | 'High' | 'Critical',
                categoryId: formData.categoryId,
                projectId: formData.projectId,
                dueDate,
            });

            setIsEditing(false);
            onUpdate();
        } catch (error) {
            alert('Failed to update task');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            categoryId: task.categoryId,
            projectId: task.projectId,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
            dueTime: task.dueDate ? new Date(task.dueDate).toTimeString().slice(0, 5) : '',
        });
        setIsEditing(false);
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

    if (isEditing) {
        return (
            <div className="space-y-4">
                {/* Edit Form */}
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Edit Task</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Cancel"
                            >
                                <X size={18} />
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Save"
                            >
                                <Save size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                style={{ color: '#111827', backgroundColor: 'white' }}
                            >
                                <option value="Low" style={{ color: '#111827', backgroundColor: 'white' }}>Low</option>
                                <option value="Medium" style={{ color: '#111827', backgroundColor: 'white' }}>Medium</option>
                                <option value="High" style={{ color: '#111827', backgroundColor: 'white' }}>High</option>
                                <option value="Critical" style={{ color: '#111827', backgroundColor: 'white' }}>Critical</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={formData.categoryId || ''}
                                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) || undefined })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                style={{ color: '#111827', backgroundColor: 'white' }}
                            >
                                <option value="" style={{ color: '#111827', backgroundColor: 'white' }}>No Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id} style={{ color: '#111827', backgroundColor: 'white' }}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Project */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project
                            </label>
                            <select
                                value={formData.projectId || ''}
                                onChange={(e) => setFormData({ ...formData, projectId: Number(e.target.value) || undefined })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                style={{
                                    color: '#111827',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="" style={{ color: '#111827', backgroundColor: 'white' }}>
                                    No Project
                                </option>
                                {projects.map((proj) => (
                                    <option
                                        key={proj.id}
                                        value={proj.id}
                                        style={{ color: '#111827', backgroundColor: 'white' }}
                                    >
                                        {proj.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Due Time */}
                        {formData.dueDate && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Time
                                </label>
                                <input
                                    type="time"
                                    value={formData.dueTime}
                                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        )}

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={saving || !formData.title}
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Edit Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors font-medium"
                >
                    <Edit2 size={18} />
                    Edit Details
                </button>
            </div>

            {/* Priority */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <Flag size={18} className="text-indigo-600" />
                    <span className="font-semibold">Priority</span>
                </div>
                <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
            </div>

            {/* Category */}
            {category && (
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                        <Folder size={18} className="text-indigo-600" />
                        <span className="font-semibold">Category</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: category.color }}
                        />
                        <span className="text-gray-900 font-medium">{category.name}</span>
                    </div>
                </div>
            )}

            {/* Project */}
            {project && (
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                        <Folder size={18} className="text-indigo-600" />
                        <span className="font-semibold">Project</span>
                    </div>
                    <span className="text-gray-900 font-medium">{project.title}</span>
                </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                        <Calendar size={18} className="text-indigo-600" />
                        <span className="font-semibold">Due Date</span>
                    </div>
                    <span className="text-gray-900 font-medium">
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                        {' at '}
                        {new Date(task.dueDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <Clock size={18} className="text-indigo-600" />
                    <span className="font-semibold">Timeline</span>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-900 font-medium">
                            {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    {task.completedAt && (
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Completed:</span>
                            <span className="text-green-600 font-medium">
                                {new Date(task.completedAt).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

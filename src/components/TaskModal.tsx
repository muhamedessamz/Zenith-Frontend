import { useState, useEffect } from 'react';
import { X, Loader2, Share2 } from 'lucide-react';
import { taskService } from '../services/taskService';
import { TimePicker } from './TimePicker';
import { Comments } from './Comments';
import { Attachments } from './Attachments';
import { ShareModal } from './ShareModal';
import { TimeTracker } from './TimeTracker';
import { Checklist } from './Checklist';
import { TaskDependencies } from './TaskDependencies';
import { TagsSelector } from './Tags/TagsSelector';
import type { Task, CreateTaskDto } from '../types/task';
import type { Tag } from '../types/tag';

// Task Modal Component
interface TaskModalProps {
    task: Task | null;
    initialProjectId?: number; // Added to support pre-selecting project
    onClose: () => void;
    onSuccess: () => void;
}

export const TaskModal = ({ task, initialProjectId, onClose, onSuccess }: TaskModalProps) => {
    // Extract date and time from task.dueDate if it exists
    const extractDateTime = (dueDate?: string) => {
        if (!dueDate) return { date: '', time: '' };

        const dateTime = new Date(dueDate);
        const date = dateTime.toISOString().split('T')[0];
        const time = dateTime.toTimeString().slice(0, 5); // HH:MM format

        return { date, time };
    };

    const { date: initialDate, time: initialTime } = extractDateTime(task?.dueDate);

    const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'attachments' | 'time' | 'checklist' | 'dependencies'>('details');

    const [formData, setFormData] = useState<CreateTaskDto>({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'Medium',
        isCompleted: task?.isCompleted || false,
        dueDate: initialDate,
        dueTime: initialTime,
        categoryId: task?.categoryId,
        projectId: task?.projectId || initialProjectId,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [projectMembers, setProjectMembers] = useState<any[]>([]);
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
        task?.assignments?.map(a => a.assignedTo?.id).filter(Boolean) || []
    );
    const [selectedTags, setSelectedTags] = useState<Tag[]>(task?.tags || []);
    const [showShareModal, setShowShareModal] = useState(false);

    // Fetch categories and projects
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { categoryService } = await import('../services/categoryService');
                const { projectService } = await import('../services/projectService');
                const [categoriesData, projectsData] = await Promise.all([
                    categoryService.getCategories(),
                    projectService.getProjects()
                ]);
                setCategories(categoriesData);
                setProjects(projectsData);
            } catch (err) {
                console.error('Failed to load data:', err);
            }
        };
        fetchData();
    }, []);

    // Fetch project members when project changes
    useEffect(() => {
        const fetchProjectMembers = async () => {
            if (!formData.projectId) {
                setProjectMembers([]);
                return;
            }
            try {
                const { projectService } = await import('../services/projectService');
                const members = await projectService.getMembers(formData.projectId);
                setProjectMembers(members);
            } catch (err) {
                console.error('Failed to load project members:', err);
            }
        };
        fetchProjectMembers();
    }, [formData.projectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let taskId: number;

            if (task) {
                await taskService.updateTask(task.id, formData);
                taskId = task.id;

                // Handle assignments for update
                if (formData.projectId && selectedAssignees.length > 0) {
                    const { taskAssignmentService } = await import('../services/taskAssignmentService');

                    // Get current assignments
                    const currentAssignments = task?.assignments || [];
                    const currentAssigneeIds = currentAssignments.map(a => a.assignedTo.id);

                    // Add new assignments
                    const toAdd = selectedAssignees.filter(id => !currentAssigneeIds.includes(id));
                    for (const userId of toAdd) {
                        await taskAssignmentService.assignTask(taskId, { userIdentifier: userId });
                    }

                    // Remove unselected assignments
                    const toRemove = currentAssignments.filter(a => !selectedAssignees.includes(a.assignedTo.id));
                    for (const assignment of toRemove) {
                        await taskAssignmentService.removeAssignment(taskId, assignment.id);
                    }
                }
            } else {
                // For new tasks, include assignedUserIds in the payload
                const taskPayload = {
                    ...formData,
                    assignedUserIds: selectedAssignees.length > 0 ? selectedAssignees : undefined
                };
                const createdTask = await taskService.createTask(taskPayload);
                taskId = createdTask.id;
            }

            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    const toggleAssignee = (userId: string) => {
        setSelectedAssignees(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fadeIn">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-slideUp sm:animate-none scrollbar-thin small-scrollbar">
                <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <div className="flex items-center gap-2">
                        {task && (
                            <button
                                type="button"
                                onClick={() => setShowShareModal(true)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Share Task"
                            >
                                <Share2 size={20} />
                            </button>
                        )}
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                {task && (
                    <div className="flex border-b border-gray-200 px-6">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab('time')}
                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'time'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Time Tracking
                        </button>
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'comments'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Comments
                        </button>
                        <button
                            onClick={() => setActiveTab('attachments')}
                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'attachments'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Attachments
                        </button>
                        <button
                            onClick={() => setActiveTab('checklist')}
                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'checklist'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Checklist
                        </button>
                        <button
                            onClick={() => setActiveTab('dependencies')}
                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'dependencies'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Dependencies
                        </button>
                    </div>
                )}

                <div className="p-6 space-y-6">
                    {/* Details Tab */}
                    {activeTab === 'details' && (
                        <>
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder="Enter task title"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder="Enter task description"
                                />
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <select
                                    value={formData.categoryId || ''}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? parseInt(e.target.value) : undefined })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                >
                                    <option value="">No Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Project */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Project</label>
                                <select
                                    value={formData.projectId || ''}
                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value ? parseInt(e.target.value) : undefined })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                >
                                    <option value="">No Project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Assign Members (only if project is selected) */}
                            {formData.projectId && projectMembers.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Assign Members
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                                        {projectMembers.map((member) => (
                                            <label
                                                key={member.userId}
                                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAssignees.includes(member.userId)}
                                                    onChange={() => toggleAssignee(member.userId)}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <div className="flex items-center gap-2 flex-1">
                                                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                                                        {member.displayName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {member.displayName}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{member.email}</div>
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${member.role === 'Owner' ? 'bg-purple-100 text-purple-700' :
                                                    member.role === 'Editor' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {member.role}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {selectedAssignees.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            {selectedAssignees.length} member(s) selected
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Due Date and Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <TimePicker
                                    value={formData.dueTime || ''}
                                    onChange={(time) => setFormData({ ...formData, dueTime: time })}
                                    label="Due Time"
                                />
                            </div>

                            {/* Tags */}
                            <TagsSelector
                                taskId={task?.id}
                                selectedTags={selectedTags}
                                onTagsChange={setSelectedTags}
                                disabled={!task}
                            />

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all">
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit as any}
                                    disabled={loading}
                                    className="flex-1 btn btn-primary"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>{task ? 'Update Task' : 'Create Task'}</>
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Time Tracking Tab */}
                    {activeTab === 'time' && task && (
                        <div className="animate-fadeIn">
                            <TimeTracker taskId={task.id} />
                        </div>
                    )}

                    {/* Comments Tab */}
                    {activeTab === 'comments' && task && (
                        <div className="animate-fadeIn">
                            <Comments taskId={task.id} />
                        </div>
                    )}

                    {/* Attachments Tab */}
                    {activeTab === 'attachments' && task && (
                        <div className="animate-fadeIn">
                            <Attachments taskId={task.id} />
                        </div>
                    )}

                    {/* Checklist Tab */}
                    {activeTab === 'checklist' && task && (
                        <div className="animate-fadeIn">
                            <Checklist taskId={task.id} />
                        </div>
                    )}

                    {/* Dependencies Tab */}
                    {activeTab === 'dependencies' && task && (
                        <div className="animate-fadeIn">
                            <TaskDependencies taskId={task.id} />
                        </div>
                    )}
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && task && (
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

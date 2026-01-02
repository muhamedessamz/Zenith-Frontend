import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
    FolderKanban,
    Plus,
    Edit2,
    Trash2,
    CheckCircle2,
    Clock,
    PlayCircle,
    PauseCircle,
    X,
    Search as SearchIcon
} from 'lucide-react';
import { projectService } from '../services/projectService';
import type { Project, CreateProjectDto, UpdateProjectDto } from '../types/project';

type ProjectStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'OnHold';

const statusConfig = {
    NotStarted: {
        label: 'Not Started',
        icon: Clock,
        color: 'text-gray-500',
        bg: 'bg-gray-100',
        border: 'border-gray-200'
    },
    InProgress: {
        label: 'In Progress',
        icon: PlayCircle,
        color: 'text-blue-500',
        bg: 'bg-blue-100',
        border: 'border-blue-200'
    },
    Completed: {
        label: 'Completed',
        icon: CheckCircle2,
        color: 'text-green-500',
        bg: 'bg-green-100',
        border: 'border-green-200'
    },
    OnHold: {
        label: 'On Hold',
        icon: PauseCircle,
        color: 'text-amber-500',
        bg: 'bg-amber-100',
        border: 'border-amber-200'
    }
};

export const ProjectsPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState<CreateProjectDto>({
        title: '',
        description: '',
        status: 'NotStarted'
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingProject(null);
        setFormData({
            title: '',
            description: '',
            status: 'NotStarted'
        });
        setShowModal(true);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description || '',
            status: project.status
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingProject) {
                await projectService.updateProject(editingProject.id, formData as UpdateProjectDto);
                setShowModal(false);
                loadProjects();
            } else {
                const newProject = await projectService.createProject(formData);
                setShowModal(false);
                // Navigate to the new project's details page
                navigate(`/projects/${newProject.id}`);
            }
        } catch (error) {
            console.error('Failed to save project:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await projectService.deleteProject(id);
            loadProjects();
        } catch (error: any) {
            console.error('Failed to delete project:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to delete project';
            alert(`Error deleting project: ${errorMessage}\n\nCheck console for details.`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2 text-gray-900">
                            Projects
                        </h1>
                        <p className="text-gray-600 text-base">
                            Track progress, manage teams, and hit your deadlines.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative group">
                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 w-full sm:w-64 transition-all"
                                onChange={(e) => {
                                    // Simple client-side search logic if needed, currently just UI
                                    const term = e.target.value.toLowerCase();
                                    const cards = document.querySelectorAll('.project-card');
                                    cards.forEach((card: any) => {
                                        const title = card.dataset.title;
                                        card.style.display = title.includes(term) ? 'block' : 'none';
                                    });
                                }}
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <SearchIcon size={18} />
                            </div>
                        </div>

                        <button
                            onClick={handleCreate}
                            className="btn btn-primary flex items-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">New Project</span>
                        </button>
                    </div>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-6 h-48 animate-pulse shadow-sm border border-gray-100">
                                <div className="h-6 bg-gray-100 rounded-md w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-100 rounded-md w-full mb-2"></div>
                                <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FolderKanban size={40} className="text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No projects yet</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Projects help you organize tasks and team members. Create your first project to get started.</p>
                        <button onClick={handleCreate} className="btn btn-primary px-8 py-3">
                            <Plus size={20} className="mr-2" />
                            Create Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => {
                            const statusInfo = statusConfig[project.status as ProjectStatus] || statusConfig.InProgress;


                            // Determine border color for left strip based on status
                            const stripColor = project.status === 'Completed' ? 'bg-green-500'
                                : project.status === 'InProgress' ? 'bg-blue-500'
                                    : project.status === 'OnHold' ? 'bg-amber-500'
                                        : 'bg-gray-400';

                            return (
                                <div
                                    key={project.id}
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    // used for search filtering
                                    data-title={project.title.toLowerCase()}
                                    className="project-card group bg-white rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                                >
                                    {/* Status Color Strip */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stripColor}`}></div>

                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-4 pl-3">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.color.replace('text-', 'bg-')}`}></div>
                                            {statusInfo.label}
                                        </div>

                                        {/* Actions Menu */}
                                        <div className="relative" onClick={e => e.stopPropagation()}>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(project);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit Project"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                {project.currentUserRole === 'Owner' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(project.id);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                                                        title="Delete Project"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="pl-3 mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px]">
                                            {project.description || "No description provided."}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="pl-3 flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <FolderKanban size={16} className="text-gray-400" />
                                                {project.taskCount || 0} Tasks
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={16} className="text-gray-400" />
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Indicate clickable */}
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-45">
                                            <Plus size={16} className="rotate-45" /> {/* Makes an arrow-like icon when rotated or just arrow */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingProject ? 'Edit Project' : 'New Project'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Enter project name"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    placeholder="Enter project description"
                                    rows={3}
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    {Object.entries(statusConfig).map(([value, config]) => (
                                        <option key={value} value={value}>
                                            {config.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    {editingProject ? 'Save Changes' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Tag as TagIcon, Plus, Edit2, Trash2, X, Loader2, Hash } from 'lucide-react';
import { tagService } from '../services/tagService';
import type { Tag, CreateTagDto } from '../types/tag';
import { toast } from 'react-hot-toast';

export const TagsPage = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [formData, setFormData] = useState<CreateTagDto>({
        name: '',
        color: '#6366f1'
    });

    const predefinedColors = [
        '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
        '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
        '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
        '#ec4899', '#f43f5e', '#64748b', '#6b7280', '#78716c'
    ];

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            setLoading(true);
            const data = await tagService.getAllTags();
            setTags(data);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to load tags');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Tag name is required');
            return;
        }

        try {
            if (editingTag) {
                await tagService.updateTag(editingTag.id, {
                    id: editingTag.id,
                    ...formData
                });
                toast.success('Tag updated successfully');
            } else {
                await tagService.createTag(formData);
                toast.success('Tag created successfully');
            }

            setShowModal(false);
            setEditingTag(null);
            setFormData({ name: '', color: '#6366f1' });
            fetchTags();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to save tag');
        }
    };

    const handleEdit = (tag: Tag) => {
        setEditingTag(tag);
        setFormData({
            name: tag.name,
            color: tag.color
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this tag?')) return;

        try {
            await tagService.deleteTag(id);
            toast.success('Tag deleted successfully');
            fetchTags();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to delete tag');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTag(null);
        setFormData({ name: '', color: '#6366f1' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
                            <span className="gradient-text">Tags</span>
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg">
                            Organize your tasks with colorful tags
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">New Tag</span>
                    </button>
                </div>

                {/* Tags Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <Loader2 size={48} className="animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading tags...</p>
                    </div>
                ) : tags.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <TagIcon size={64} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tags yet</h3>
                        <p className="text-gray-600 mb-6">Create your first tag to organize your tasks</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary inline-flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Create Tag
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {tags.map((tag) => (
                            <div
                                key={tag.id}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: tag.color + '20' }}
                                        >
                                            <Hash size={20} style={{ color: tag.color }} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {tag.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {tag.taskCount} {tag.taskCount === 1 ? 'task' : 'tasks'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(tag)}
                                        className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit2 size={16} />
                                        <span className="text-sm font-medium">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tag.id)}
                                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        <span className="text-sm font-medium">Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingTag ? 'Edit Tag' : 'Create New Tag'}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Tag Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tag Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Urgent, Personal, Work"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        required
                                        maxLength={50}
                                    />
                                    <p className="text-xs text-gray-500 mt-1 text-right">
                                        {formData.name.length}/50
                                    </p>
                                </div>

                                {/* Color Picker */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Tag Color
                                    </label>
                                    <div className="grid grid-cols-10 gap-2">
                                        {predefinedColors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color })}
                                                className={`w-8 h-8 rounded-lg transition-all ${formData.color === color
                                                    ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                                                    : 'hover:scale-110'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>

                                    {/* Custom Color Input */}
                                    <div className="mt-3 flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                                        />
                                        <span className="text-sm text-gray-600">
                                            Custom: {formData.color}
                                        </span>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium max-w-full h-auto"
                                        style={{
                                            backgroundColor: formData.color + '20',
                                            color: formData.color
                                        }}
                                    >
                                        <Hash size={14} className="flex-shrink-0" />
                                        <span className="break-all whitespace-normal text-left">{formData.name || 'Tag Name'}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 btn btn-primary"
                                    >
                                        {editingTag ? 'Update Tag' : 'Create Tag'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

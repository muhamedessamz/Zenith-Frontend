import { useEffect, useState } from 'react';

import { Navbar } from '../components/Navbar';
import {
    Plus,
    Tag,
    Edit,
    Trash2,
    X,
    Loader2,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { categoryService } from '../services/categoryService';
import type { Category, CreateCategoryDto } from '../types/category';

export const CategoriesPage = () => {
    // const { user, logout } = useAuthStore();
    // const navigate = useNavigate();

    // State
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getCategories();
            setCategories(data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category? Tasks in this category will not be deleted.')) {
            return;
        }

        try {
            await categoryService.deleteCategory(id);
            fetchCategories();
        } catch (err: any) {
            alert(err.response?.data?.error || err.response?.data?.message || 'Failed to delete category');
        }
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setShowCreateModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
            {/* Shared Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                                Categories
                            </h1>
                            <p className="text-gray-600">
                                Organize your tasks with custom categories
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingCategory(null);
                                setShowCreateModal(true);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">Create Category</span>
                            <span className="sm:hidden">New</span>
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Categories Grid */}
                {categories.length === 0 ? (
                    <div className="text-center py-16">
                        <Tag size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No categories yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Create your first category to organize your tasks
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg font-medium"
                        >
                            <Plus size={20} />
                            Create Category
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${category.color}20` }}
                                        >
                                            <Tag size={24} style={{ color: category.color }} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {category.taskCount} {category.taskCount === 1 ? 'task' : 'tasks'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditCategory(category)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {category.description && (
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <CategoryModal
                    category={editingCategory}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingCategory(null);
                    }}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        setEditingCategory(null);
                        fetchCategories();
                    }}
                />
            )}
        </div>
    );
};

// Category Modal Component
interface CategoryModalProps {
    category: Category | null;
    onClose: () => void;
    onSuccess: () => void;
}

const CategoryModal = ({ category, onClose, onSuccess }: CategoryModalProps) => {
    const [formData, setFormData] = useState<CreateCategoryDto>({
        name: category?.name || '',
        description: category?.description || '',
        color: category?.color || '#6366f1',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const predefinedColors = [
        '#6366f1', // Indigo
        '#06b6d4', // Cyan
        '#10b981', // Green
        '#f59e0b', // Amber
        '#ef4444', // Red
        '#8b5cf6', // Purple
        '#ec4899', // Pink
        '#14b8a6', // Teal
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (category) {
                await categoryService.updateCategory(category.id, {
                    ...formData,
                    color: formData.color || '#6366f1',
                    id: category.id,
                });
            } else {
                await categoryService.createCategory(formData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fadeIn">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-slideUp sm:animate-none">
                <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        {category ? 'Edit Category' : 'Create New Category'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            placeholder="e.g., Work, Personal, Shopping"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                            rows={3}
                            placeholder="Optional description..."
                        />
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Color
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {predefinedColors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-10 h-10 rounded-lg transition-all ${formData.color === color
                                        ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                                        : 'hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    {category ? 'Update' : 'Create'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

import { useState, useEffect } from 'react';
import { Hash, X, Plus, Loader2 } from 'lucide-react';
import { tagService } from '../../services/tagService';
import type { Tag } from '../../types/tag';
import { toast } from 'react-hot-toast';

interface TagsSelectorProps {
    taskId?: number;
    selectedTags: Tag[];
    onTagsChange: (tags: Tag[]) => void;
    disabled?: boolean;
}

export const TagsSelector = ({ taskId, selectedTags, onTagsChange, disabled }: TagsSelectorProps) => {
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            setLoading(true);
            const tags = await tagService.getAllTags();
            setAllTags(tags);
        } catch (error: any) {
            console.error('Failed to load tags:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = async (tag: Tag) => {
        if (disabled) return;

        // Check if tag already selected
        if (selectedTags.some(t => t.id === tag.id)) {
            toast.error('Tag already added');
            return;
        }

        try {
            // If taskId exists, add to backend
            if (taskId) {
                await tagService.addTagToTask(taskId, tag.id);
                toast.success('Tag added successfully');
            }

            // Update local state
            onTagsChange([...selectedTags, tag]);
            setShowDropdown(false);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to add tag');
        }
    };

    const handleRemoveTag = async (tag: Tag) => {
        if (disabled) return;

        try {
            // If taskId exists, remove from backend
            if (taskId) {
                await tagService.removeTagFromTask(taskId, tag.id);
                toast.success('Tag removed successfully');
            }

            // Update local state
            onTagsChange(selectedTags.filter(t => t.id !== tag.id));
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to remove tag');
        }
    };

    const availableTags = allTags.filter(
        tag => !selectedTags.some(st => st.id === tag.id)
    );

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                Tags
            </label>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 rounded-lg border border-gray-200">
                {selectedTags.length === 0 ? (
                    <span className="text-sm text-gray-400 italic">No tags selected</span>
                ) : (
                    selectedTags.map(tag => (
                        <div
                            key={tag.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all group"
                            style={{
                                backgroundColor: tag.color + '20',
                                color: tag.color
                            }}
                        >
                            <Hash size={14} />
                            <span>{tag.name}</span>
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Tag Button */}
            {!disabled && (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Add Tag
                    </button>

                    {/* Dropdown */}
                    {showDropdown && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowDropdown(false)}
                            />

                            {/* Dropdown Menu */}
                            <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-60 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center">
                                        <Loader2 size={20} className="animate-spin text-indigo-600 mx-auto" />
                                    </div>
                                ) : availableTags.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-gray-500">
                                        {allTags.length === 0 ? (
                                            <>
                                                No tags available.
                                                <br />
                                                <a href="/tags" className="text-indigo-600 hover:underline">
                                                    Create tags first
                                                </a>
                                            </>
                                        ) : (
                                            'All tags already added'
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        {availableTags.map(tag => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => handleAddTag(tag)}
                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{ backgroundColor: tag.color + '20' }}
                                                >
                                                    <Hash size={16} style={{ color: tag.color }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {tag.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {tag.taskCount} {tag.taskCount === 1 ? 'task' : 'tasks'}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

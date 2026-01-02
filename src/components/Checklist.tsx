import { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, Trash2, Edit2, Check, X, GripVertical } from 'lucide-react';
import { checklistService } from '../services/checklistService';
import type { ChecklistItem, CreateChecklistItemDto } from '../types/checklist';

interface ChecklistProps {
    taskId: number;
}

export const Checklist = ({ taskId }: ChecklistProps) => {
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [newItemTitle, setNewItemTitle] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingTitle, setEditingTitle] = useState('');

    useEffect(() => {
        fetchItems();
    }, [taskId]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await checklistService.getItems(taskId);
            setItems(data.sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error('Failed to load checklist items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemTitle.trim()) return;

        try {
            const newItem: CreateChecklistItemDto = {
                title: newItemTitle.trim(),
                order: items.length
            };
            const created = await checklistService.createItem(taskId, newItem);
            setItems([...items, created]);
            setNewItemTitle('');
        } catch (error) {
            console.error('Failed to create checklist item:', error);
            alert('Failed to create checklist item');
        }
    };

    const handleToggle = async (item: ChecklistItem) => {
        try {
            const updated = await checklistService.toggleItem(taskId, item.id);
            setItems(items.map(i => i.id === item.id ? updated : i));
        } catch (error) {
            console.error('Failed to toggle checklist item:', error);
        }
    };

    const handleStartEdit = (item: ChecklistItem) => {
        setEditingId(item.id);
        setEditingTitle(item.title);
    };

    const handleSaveEdit = async (item: ChecklistItem) => {
        if (!editingTitle.trim()) {
            setEditingId(null);
            return;
        }

        try {
            const updated = await checklistService.updateItem(taskId, item.id, {
                id: item.id,
                title: editingTitle.trim(),
                isCompleted: item.isCompleted,
                order: item.order
            });
            setItems(items.map(i => i.id === item.id ? updated : i));
            setEditingId(null);
        } catch (error) {
            console.error('Failed to update checklist item:', error);
            alert('Failed to update checklist item');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingTitle('');
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await checklistService.deleteItem(taskId, id);
            setItems(items.filter(i => i.id !== id));
        } catch (error) {
            console.error('Failed to delete checklist item:', error);
            alert('Failed to delete checklist item');
        }
    };

    const progress = checklistService.calculateProgress(items);

    return (
        <div className="space-y-4">
            {/* Header with Progress */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CheckSquare size={20} className="text-gray-700" />
                    <h3 className="font-semibold text-gray-900">
                        Checklist ({items.filter(i => i.isCompleted).length}/{items.length})
                    </h3>
                </div>
                {items.length > 0 && (
                    <span className="text-sm font-medium text-indigo-600">{progress}%</span>
                )}
            </div>

            {/* Progress Bar */}
            {items.length > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Add New Item Form */}
            <form onSubmit={handleAddItem} className="flex gap-2">
                <input
                    type="text"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    placeholder="Add a checklist item..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
                <button
                    type="submit"
                    disabled={!newItemTitle.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                    <Plus size={16} />
                    Add
                </button>
            </form>

            {/* Checklist Items */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading checklist...</div>
                ) : items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        No checklist items yet. Add one to get started!
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${item.isCompleted
                                    ? 'bg-gray-50 border-gray-200'
                                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                                }`}
                        >
                            {/* Drag Handle */}
                            <div className="flex-shrink-0 text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical size={16} />
                            </div>

                            {/* Checkbox */}
                            <button
                                onClick={() => handleToggle(item)}
                                className="flex-shrink-0"
                            >
                                {item.isCompleted ? (
                                    <CheckSquare size={20} className="text-indigo-600" />
                                ) : (
                                    <Square size={20} className="text-gray-400 hover:text-indigo-600" />
                                )}
                            </button>

                            {/* Title */}
                            {editingId === item.id ? (
                                <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveEdit(item);
                                        if (e.key === 'Escape') handleCancelEdit();
                                    }}
                                    className="flex-1 px-2 py-1 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    autoFocus
                                />
                            ) : (
                                <span
                                    className={`flex-1 text-sm ${item.isCompleted
                                            ? 'line-through text-gray-500'
                                            : 'text-gray-900'
                                        }`}
                                >
                                    {item.title}
                                </span>
                            )}

                            {/* Actions */}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {editingId === item.id ? (
                                    <>
                                        <button
                                            onClick={() => handleSaveEdit(item)}
                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                            title="Save"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                            title="Cancel"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleStartEdit(item)}
                                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

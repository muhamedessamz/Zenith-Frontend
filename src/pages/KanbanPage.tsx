import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Navbar } from '../components/Navbar';
import {
    Plus,
    Loader2,
    AlertCircle,
    Calendar,
    Flag
} from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core';

import { taskService } from '../services/taskService';
import type { Task } from '../types/task';
import type { DragStartEvent, DragEndEvent } from '../types/utils';

type TaskStatus = 'pending' | 'inProgress' | 'completed';

interface KanbanColumn {
    id: TaskStatus;
    title: string;
    color: string;
    tasks: Task[];
}

export const KanbanPage = () => {
    // const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    // State
    const [columns, setColumns] = useState<KanbanColumn[]>([
        { id: 'pending', title: 'To Do', color: 'bg-indigo-500', tasks: [] },
        { id: 'inProgress', title: 'In Progress', color: 'bg-amber-500', tasks: [] },
        { id: 'completed', title: 'Completed', color: 'bg-green-500', tasks: [] },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Drag & Drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Fetch tasks
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await taskService.getTasks({ pageSize: 100 });
            const tasks = response.data;

            // Organize tasks by status
            const pending = tasks.filter(t => !t.isCompleted && !t.dueDate);
            const inProgress = tasks.filter(t => !t.isCompleted && t.dueDate);
            const completed = tasks.filter(t => t.isCompleted);

            setColumns([
                { id: 'pending', title: 'To Do', color: 'bg-indigo-500', tasks: pending },
                { id: 'inProgress', title: 'In Progress', color: 'bg-amber-500', tasks: inProgress },
                { id: 'completed', title: 'Completed', color: 'bg-green-500', tasks: completed },
            ]);
        } catch (err: any) {
            console.error('Failed to fetch tasks:', err);
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = findTaskById(active.id as number);
        setActiveTask(task || null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = active.id as number;
        const newColumnId = over.id as TaskStatus;

        // Find the task and its current column
        const task = findTaskById(taskId);
        const currentColumn = columns.find(col => col.tasks.some(t => t.id === taskId));

        if (!task || !currentColumn || currentColumn.id === newColumnId) return;

        // Optimistic update
        const newColumns = columns.map(col => {
            if (col.id === currentColumn.id) {
                return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
            }
            if (col.id === newColumnId) {
                return { ...col, tasks: [...col.tasks, task] };
            }
            return col;
        });

        setColumns(newColumns);

        // Update task status in backend
        try {
            const isCompleted = newColumnId === 'completed';

            // Determine dueDate based on target column
            let dueDate = task.dueDate;

            if (newColumnId === 'inProgress') {
                // In Progress: Always ensure there's a dueDate
                if (!dueDate) {
                    dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                }
            } else if (newColumnId === 'pending') {
                // To Do: Remove dueDate
                dueDate = undefined;
            }
            // Completed: Keep existing dueDate

            console.log('📝 Updating task:', {
                taskId,
                title: task.title,
                from: currentColumn.id,
                to: newColumnId,
                isCompleted,
                oldDueDate: task.dueDate,
                newDueDate: dueDate
            });

            await taskService.updateTask(taskId, {
                title: task.title,
                description: task.description,
                priority: task.priority,
                categoryId: task.categoryId,
                projectId: task.projectId,
                isCompleted,
                dueDate
            });

            console.log('✅ Task updated successfully');
        } catch (err: any) {
            console.error('❌ Failed to update task:', err);
            // Revert on error
            fetchTasks();
        }
    };

    const findTaskById = (id: number): Task | undefined => {
        for (const column of columns) {
            const task = column.tasks.find(t => t.id === id);
            if (task) return task;
        }
        return undefined;
    };



    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'border-l-4 border-red-500';
            case 'High': return 'border-l-4 border-orange-500';
            case 'Medium': return 'border-l-4 border-blue-500';
            case 'Low': return 'border-l-4 border-gray-400';
            default: return 'border-l-4 border-gray-300';
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
                            <span className="gradient-text">Kanban Board</span>
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg">Drag and drop tasks to update their status</p>
                    </div>
                    <button onClick={() => navigate('/tasks')} className="hidden sm:flex btn btn-primary shadow-lg hover:shadow-xl transition-shadow">
                        <Plus size={20} />
                        Create Task
                    </button>
                </div>

                {/* Kanban Board */}
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 size={48} className="animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading board...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button onClick={fetchTasks} className="btn btn-primary">Try Again</button>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        {/* Mobile: Horizontal scroll, Desktop: Grid */}
                        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none -mx-4 px-4 md:mx-0 md:px-0">
                            {columns.map((column) => (
                                <div key={column.id} className="flex-shrink-0 w-[85vw] md:w-auto snap-center md:snap-align-none">
                                    <DroppableColumn
                                        column={column}
                                        getPriorityColor={getPriorityColor}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Drag Overlay */}
                        <DragOverlay>
                            {activeTask ? (
                                <div className={`bg-white rounded-lg p-4 shadow-xl ${getPriorityColor(activeTask.priority)} opacity-90`}>
                                    <h4 className="font-semibold text-gray-800">{activeTask.title}</h4>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}
            </main>

            {/* Floating Action Button (Mobile Only) */}
            <button
                onClick={() => navigate('/tasks')}
                className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center z-40 active:scale-95"
                aria-label="Create Task"
            >
                <Plus size={28} strokeWidth={2.5} />
            </button>
        </div >
    );
};

// Droppable Column Component
interface DroppableColumnProps {
    column: {
        id: TaskStatus;
        title: string;
        tasks: Task[];
        color: string;
    };
    getPriorityColor: (priority: string) => string;
}

const DroppableColumn = ({ column, getPriorityColor }: DroppableColumnProps) => {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    return (
        <div className="flex flex-col">
            {/* Column Header */}
            <div className={`${column.color} text-white rounded-t-xl px-5 py-4 flex items-center justify-between shadow-md`}>
                <h3 className="font-bold text-lg">{column.title}</h3>
                <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-semibold">
                    {column.tasks.length}
                </span>
            </div>

            {/* Column Content - Droppable Zone */}
            <div
                ref={setNodeRef}
                className="bg-white rounded-b-xl p-4 min-h-[500px] space-y-3 shadow-md border border-gray-100"
            >
                {column.tasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Calendar size={24} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-medium">No tasks</p>
                        <p className="text-xs mt-1">Drag tasks here</p>
                    </div>
                ) : (
                    column.tasks.map((task) => (
                        <DraggableTaskCard
                            key={task.id}
                            task={task}
                            getPriorityColor={getPriorityColor}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

// Draggable Task Card Component
interface DraggableTaskCardProps {
    task: Task;
    getPriorityColor: (priority: string) => string;
}

const DraggableTaskCard = ({ task, getPriorityColor }: DraggableTaskCardProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all cursor-move border border-gray-100 ${getPriorityColor(task.priority)}`}
        >
            <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{task.title}</h4>
            {task.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
            )}
            <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    {task.dueDate && (
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    )}
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <Flag size={12} />
                        {task.priority}
                    </span>
                </div>
            </div>
        </div>
    );
};

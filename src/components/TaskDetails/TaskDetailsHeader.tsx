import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../../types/task';

interface TaskDetailsHeaderProps {
    task: Task;
    onToggleComplete: () => void;
}

export const TaskDetailsHeader = ({ task, onToggleComplete }: TaskDetailsHeaderProps) => {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            <button
                onClick={() => navigate('/tasks')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Tasks</span>
            </button>

            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={onToggleComplete}
                            className="flex-shrink-0 transition-transform hover:scale-110"
                        >
                            {task.isCompleted ? (
                                <CheckCircle2 size={32} className="text-green-600" />
                            ) : (
                                <Circle size={32} className="text-gray-400 hover:text-indigo-600 transition-colors" />
                            )}
                        </button>
                        <h1 className={`text-3xl font-bold transition-all ${task.isCompleted
                                ? 'line-through text-gray-500'
                                : 'text-gray-900'
                            }`}>
                            {task.title}
                        </h1>
                    </div>
                    {task.description && (
                        <p className="text-gray-600 ml-11 text-lg">{task.description}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

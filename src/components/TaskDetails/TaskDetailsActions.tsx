import { Share2, Trash2 } from 'lucide-react';

interface TaskDetailsActionsProps {
    onShare: () => void;
    onDelete: () => void;
}

export const TaskDetailsActions = ({ onShare, onDelete }: TaskDetailsActionsProps) => {
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onShare}
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors font-medium"
                title="Share Task"
            >
                <Share2 size={18} />
                <span>Share</span>
            </button>
            <button
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
                title="Delete Task"
            >
                <Trash2 size={18} />
                <span>Delete</span>
            </button>
        </div>
    );
};

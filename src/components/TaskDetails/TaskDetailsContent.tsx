import { useState } from 'react';
import { Clock, CheckSquare, Link2, MessageSquare, Paperclip } from 'lucide-react';
import { TimeTracker } from '../TimeTracker';
import { Checklist } from '../Checklist';
import { TaskDependencies } from '../TaskDependencies';
import { Comments } from '../Comments';
import { Attachments } from '../Attachments';

interface TaskDetailsContentProps {
    taskId: number;
}

export const TaskDetailsContent = ({ taskId }: TaskDetailsContentProps) => {
    const [activeTab, setActiveTab] = useState('time-tracking');

    const tabs = [
        { id: 'time-tracking', label: 'Time Tracking', icon: Clock },
        { id: 'checklist', label: 'Checklist', icon: CheckSquare },
        { id: 'dependencies', label: 'Dependencies', icon: Link2 },
        { id: 'comments', label: 'Comments', icon: MessageSquare },
        { id: 'attachments', label: 'Attachments', icon: Paperclip },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === 'time-tracking' && (
                    <div className="animate-fadeIn">
                        <TimeTracker taskId={taskId} />
                    </div>
                )}

                {activeTab === 'checklist' && (
                    <div className="animate-fadeIn">
                        <Checklist taskId={taskId} />
                    </div>
                )}

                {activeTab === 'dependencies' && (
                    <div className="animate-fadeIn">
                        <TaskDependencies taskId={taskId} />
                    </div>
                )}

                {activeTab === 'comments' && (
                    <div className="animate-fadeIn">
                        <Comments taskId={taskId} />
                    </div>
                )}

                {activeTab === 'attachments' && (
                    <div className="animate-fadeIn">
                        <Attachments taskId={taskId} />
                    </div>
                )}
            </div>
        </div>
    );
};

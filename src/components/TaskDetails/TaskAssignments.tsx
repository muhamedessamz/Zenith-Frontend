import { useState, useEffect } from 'react';
import { User, Plus, X, Loader2, Search } from 'lucide-react';
import { taskAssignmentService } from '../../services/taskAssignmentService';
import api from '../../lib/axios';

interface TaskAssignmentsProps {
    taskId: number;

}

export const TaskAssignments = ({ taskId }: TaskAssignmentsProps) => {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searching, setSearching] = useState(false);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchAssignments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId]);

    // Debounced search - wait 400ms after user stops typing
    useEffect(() => {
        if (searchTerm.length >= 2) {
            // Set searching state immediately for better UX
            setSearching(true);

            const debounceTimer = setTimeout(() => {
                searchUsers();
            }, 400); // Wait 400ms after last keystroke

            return () => {
                clearTimeout(debounceTimer);
                setSearching(false);
            };
        } else {
            setSearchResults([]);
            setSearching(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const data = await taskAssignmentService.getTaskAssignments(taskId);
            setAssignments(data);
        } catch (error) {
            console.error('Failed to fetch assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchUsers = async () => {
        try {
            setSearching(true);
            const response = await api.get(`/Users/search?query=${encodeURIComponent(searchTerm)}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Failed to search users:', error);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    const handleAddAssignment = async (userId: string) => {
        try {
            setAdding(true);
            await taskAssignmentService.assignTask(taskId, userId);
            await fetchAssignments();
            setShowAddModal(false);
            setSearchTerm('');
            setSearchResults([]);
        } catch (error) {
            console.error('Failed to add assignment:', error);
            alert('Failed to assign user');
        } finally {
            setAdding(false);
        }
    };

    const handleRemoveAssignment = async (userId: string) => {
        if (!window.confirm('Remove this assignment?')) return;

        try {
            await taskAssignmentService.unassignTask(taskId, userId);
            await fetchAssignments();
        } catch (error) {
            console.error('Failed to remove assignment:', error);
            alert('Failed to remove assignment');
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <User size={18} className="text-indigo-600" />
                    <span className="font-semibold">Assigned To</span>
                </div>
                <div className="flex items-center justify-center py-4">
                    <Loader2 size={20} className="animate-spin text-indigo-600" />
                </div>
            </div>
        );
    }

    // Filter out already assigned users from search results
    const availableUsers = searchResults.filter(
        user => !assignments.some(a => a.userId === user.id)
    );

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-gray-700">
                        <User size={18} className="text-indigo-600" />
                        <span className="font-semibold">Assigned To</span>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Add Assignment"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                {assignments.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">No assignments yet</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="mt-2 text-indigo-600 text-sm hover:underline"
                        >
                            Assign someone
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {assignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                                        <span className="text-white text-sm font-semibold">
                                            {assignment.assignedTo?.displayName?.charAt(0).toUpperCase() ||
                                                assignment.assignedTo?.email?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-medium">
                                            {assignment.assignedTo?.displayName ||
                                                assignment.assignedTo?.email ||
                                                `${assignment.assignedTo?.firstName} ${assignment.assignedTo?.lastName}` ||
                                                'Unknown User'}
                                        </p>
                                        {assignment.assignedTo?.email && (
                                            <p className="text-xs text-gray-500">{assignment.assignedTo.email}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveAssignment(assignment.userId)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Remove Assignment"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Smart Add Assignment Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">Assign User</h3>
                            <p className="text-sm text-gray-500 mt-1">Search for a user to assign to this task</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Search Input */}
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Type at least 2 characters to search..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    autoFocus
                                />
                            </div>

                            {/* Search Results */}
                            <div className="h-80 overflow-y-auto space-y-1 scrollbar-hide">
                                {searching ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <Loader2 size={32} className="mx-auto animate-spin text-indigo-600" />
                                            <p className="text-gray-500 mt-3">Searching...</p>
                                        </div>
                                    </div>
                                ) : searchTerm.length < 2 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center text-gray-500">
                                            <Search size={48} className="mx-auto mb-3 opacity-20" />
                                            <p className="font-medium">Start typing to search</p>
                                            <p className="text-sm mt-1">Enter at least 2 characters</p>
                                        </div>
                                    </div>
                                ) : availableUsers.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center text-gray-500">
                                            <User size={48} className="mx-auto mb-3 opacity-20" />
                                            <p className="font-medium">No users found</p>
                                            <p className="text-sm mt-1">Try a different search term</p>
                                        </div>
                                    </div>
                                ) : (
                                    availableUsers.map((user) => {
                                        const displayName = user.displayName || user.email || `${user.firstName} ${user.lastName}` || 'Unknown';
                                        return (
                                            <button
                                                key={user.id}
                                                onClick={() => handleAddAssignment(user.id)}
                                                disabled={adding}
                                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors text-left disabled:opacity-50 group"
                                            >
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    <span className="text-white text-sm font-semibold">
                                                        {displayName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-gray-900 font-medium truncate">
                                                        {displayName}
                                                    </p>
                                                    {user.email && (
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {user.email}
                                                        </p>
                                                    )}
                                                </div>
                                                {adding && (
                                                    <Loader2 size={18} className="animate-spin text-indigo-600" />
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setSearchTerm('');
                                    setSearchResults([]);
                                }}
                                disabled={adding}
                                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

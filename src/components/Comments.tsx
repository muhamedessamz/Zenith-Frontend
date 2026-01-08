import { useState, useEffect } from 'react';
import { MessageCircle, Send, Edit2, Trash2 } from 'lucide-react';
import { commentService } from '../services/commentService';
import type { Comment } from '../types/comment';
import { useAuthStore } from '../store/authStore';
import { UserDisplay } from './UserDisplay';

interface CommentsProps {
    taskId: number;
}

export const Comments = ({ taskId }: CommentsProps) => {
    const { user } = useAuthStore();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const data = await commentService.getComments(taskId);
            setComments(data);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmitting(true);
            const comment = await commentService.createComment(taskId, { content: newComment });
            setComments([comment, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditComment = async (commentId: number) => {
        if (!editContent.trim()) return;

        try {
            const updated = await commentService.updateComment(taskId, commentId, { content: editContent });
            setComments(comments.map(c => c.id === commentId ? updated : c));
            setEditingId(null);
            setEditContent('');
        } catch (error) {
            console.error('Failed to update comment:', error);
            alert('Failed to update comment');
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await commentService.deleteComment(taskId, commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('Failed to delete comment');
        }
    };

    const startEdit = (comment: Comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 text-gray-700">
                <MessageCircle size={20} />
                <h3 className="font-semibold">Comments ({comments.length})</h3>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={submitting}
                />
                <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Send size={16} />
                    {submitting ? 'Sending...' : 'Send'}
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                            {editingId === comment.id ? (
                                // Edit Mode
                                <div className="space-y-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditComment(comment.id)}
                                            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <UserDisplay user={comment.user} fallbackName={comment.userName} />
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </span>
                                                    {comment.updatedAt && (
                                                        <span className="text-xs text-gray-400">(edited)</span>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 whitespace-pre-wrap ml-10">{comment.content}</p>
                                            </div>
                                        </div>
                                        {user?.id === comment.userId && (
                                            <div className="flex gap-1 shrink-0">
                                                <button
                                                    onClick={() => startEdit(comment)}
                                                    className="p-1 text-gray-400 hover:text-indigo-600 rounded"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

import { useState, useEffect } from 'react';
import { Paperclip, Upload, Download, Trash2, File, Loader2 } from 'lucide-react';
import { attachmentService } from '../services/attachmentService';
import type { Attachment } from '../types/attachment';

interface AttachmentsProps {
    taskId: number;
}

export const Attachments = ({ taskId }: AttachmentsProps) => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchAttachments();
    }, [taskId]);

    const fetchAttachments = async () => {
        try {
            setLoading(true);
            const data = await attachmentService.getAttachments(taskId);
            setAttachments(data);
        } catch (error) {
            console.error('Failed to load attachments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds the maximum limit of 10MB');
            return;
        }

        try {
            setUploading(true);
            const attachment = await attachmentService.uploadFile(taskId, file);
            setAttachments([...attachments, attachment]);
            // Reset input
            e.target.value = '';
        } catch (error: any) {
            console.error('Failed to upload file:', error);
            alert(error.response?.data || 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (attachmentId: number) => {
        if (!window.confirm('Are you sure you want to delete this attachment?')) return;

        try {
            await attachmentService.deleteAttachment(taskId, attachmentId);
            setAttachments(attachments.filter(a => a.id !== attachmentId));
        } catch (error) {
            console.error('Failed to delete attachment:', error);
            alert('Failed to delete attachment');
        }
    };

    const handleDownload = (attachment: Attachment) => {
        const url = attachmentService.getDownloadUrl(attachment.filePath);
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                    <Paperclip size={20} />
                    <h3 className="font-semibold">Attachments ({attachments.length})</h3>
                </div>

                {/* Upload Button */}
                <label className="cursor-pointer">
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                    <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 text-sm">
                        {uploading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload size={16} />
                                Upload File
                            </>
                        )}
                    </div>
                </label>
            </div>

            {/* File Size Limit Notice */}
            <p className="text-xs text-gray-500">Maximum file size: 10MB</p>

            {/* Attachments List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading attachments...</div>
                ) : attachments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        No attachments yet. Upload a file to get started!
                    </div>
                ) : (
                    attachments.map((attachment) => (
                        <div
                            key={attachment.id}
                            className="bg-gray-50 rounded-lg p-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                    <File size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">
                                        {attachment.fileName}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>{attachmentService.formatFileSize(attachment.fileSize)}</span>
                                        <span>•</span>
                                        <span>{attachment.uploadedBy}</span>
                                        <span>•</span>
                                        <span>{new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1 ml-2">
                                <button
                                    onClick={() => handleDownload(attachment)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                                    title="Download"
                                >
                                    <Download size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(attachment.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

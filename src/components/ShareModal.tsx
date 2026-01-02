import { useState } from 'react';
import { X, Share2, Copy, Check, Calendar, Loader2 } from 'lucide-react';
import { shareService } from '../services/shareService';
import type { SharedLink } from '../types/share';

interface ShareModalProps {
    entityType: 'Task' | 'Project';
    entityId: number;
    entityTitle: string;
    onClose: () => void;
}

export const ShareModal = ({ entityType, entityId, entityTitle, onClose }: ShareModalProps) => {
    const [loading, setLoading] = useState(false);
    const [sharedLink, setSharedLink] = useState<SharedLink | null>(null);
    const [copied, setCopied] = useState(false);
    const [expiryDays, setExpiryDays] = useState<number | ''>('');

    const handleGenerate = async () => {
        try {
            setLoading(true);

            const expiresAt = expiryDays
                ? new Date(Date.now() + Number(expiryDays) * 24 * 60 * 60 * 1000).toISOString()
                : undefined;

            const link = await shareService.generateLink({
                entityType,
                entityId,
                expiresAt,
            });

            setSharedLink(link);
        } catch (error) {
            console.error('Failed to generate link:', error);
            alert('Failed to generate shared link');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!sharedLink) return;

        const success = await shareService.copyToClipboard(sharedLink.publicUrl);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slideUp">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                            <Share2 size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Share {entityType}</h2>
                            <p className="text-sm text-gray-500">{entityTitle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {!sharedLink ? (
                        <>
                            {/* Expiry Options */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Calendar size={16} className="inline mr-2" />
                                    Link Expiry (Optional)
                                </label>
                                <select
                                    value={expiryDays}
                                    onChange={(e) => setExpiryDays(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Never expires</option>
                                    <option value="1">1 day</option>
                                    <option value="7">7 days</option>
                                    <option value="30">30 days</option>
                                    <option value="90">90 days</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-2">
                                    Choose when this link should expire. Leave as "Never expires" for permanent access.
                                </p>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full btn btn-primary"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Share2 size={20} />
                                        Generate Shared Link
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Generated Link */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Shared Link
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={sharedLink.publicUrl}
                                        readOnly
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={18} />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={18} />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Expiry Info */}
                            {sharedLink.expiry && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-sm text-yellow-800">
                                        <Calendar size={16} className="inline mr-2" />
                                        This link will expire on {new Date(sharedLink.expiry).toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {/* Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    ℹ️ Anyone with this link can view this {entityType.toLowerCase()} without logging in.
                                </p>
                            </div>

                            {/* Generate Another */}
                            <button
                                onClick={() => setSharedLink(null)}
                                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Generate Another Link
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

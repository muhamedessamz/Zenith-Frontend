import { useState } from 'react';
import { Camera } from 'lucide-react';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';

interface ProfilePictureUploadProps {
    currentImage?: string | null;
    onUploadSuccess?: (imageUrl: string) => void;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ProfilePictureUpload = ({
    currentImage,
    onUploadSuccess,
    size = 'xl'
}: ProfilePictureUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const { refreshSession } = useAuthStore();

    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32',
        xl: 'w-40 h-40'
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setError('Only JPG, PNG, and GIF images are allowed');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/User/upload-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Use relative path (goes through Vercel proxy) instead of fullUrl
            const imageUrl = response.data.profilePicture;

            // Immediately update local state to show the image
            setUploadedImage(imageUrl);

            // Refresh the session to update user data in store
            await refreshSession();

            // Call callback if provided
            if (onUploadSuccess) {
                onUploadSuccess(imageUrl);
            }

        } catch (err: any) {
            console.error('Failed to upload image:', err);
            setError(err.response?.data?.error || 'Failed to upload image');
        } finally {
            setUploading(false);
            // Reset file input
            e.target.value = '';
        }
    };

    const getInitials = () => {
        // You can pass user name as prop if needed
        return '?';
    };

    // Use uploaded image if available, otherwise use current image
    const displayImage = uploadedImage || currentImage;

    return (
        <div className="relative inline-block">
            {/* Profile Picture Display */}
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg`}>
                {displayImage ? (
                    <img
                        src={`${displayImage}?t=${Date.now()}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
                        {getInitials()}
                    </div>
                )}
            </div>

            {/* Upload Button Overlay */}
            <label
                htmlFor="profile-pic-upload"
                className={`absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <Camera size={20} />
                <input
                    id="profile-pic-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                />
            </label>

            {/* Loading Indicator */}
            {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-600 text-xs px-3 py-1 rounded whitespace-nowrap">
                    {error}
                </div>
            )}
        </div>
    );
};

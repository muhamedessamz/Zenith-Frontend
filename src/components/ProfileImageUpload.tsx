import { useRef, useState, useEffect } from 'react';
import { User, Camera } from 'lucide-react';

interface ProfileImageUploadProps {
    name: string;
    onImageChange: (file: File | null) => void;
    initialImage?: string | null;

    disabled?: boolean;
    size?: 'small' | 'medium' | 'large' | 'xl';
}

export const ProfileImageUpload = ({
    name,
    onImageChange,
    initialImage = null,

    disabled = false,
    size = 'large',
}: ProfileImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(initialImage);

    // Update preview when initialImage changes
    useEffect(() => {
        setPreview(initialImage);
    }, [initialImage]);

    const sizeClasses = {
        small: 'w-20 h-20',
        medium: 'w-32 h-32',
        large: 'w-40 h-40',
        xl: 'w-48 h-48',
    };

    const iconSizes = {
        small: 32,
        medium: 48,
        large: 64,
        xl: 80,
    };

    const handleImageClick = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file only');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Call parent onChange
        if (onImageChange) {
            onImageChange(file);
        }
    };

    return (
        <div className="relative inline-block text-center">
            {/* Image Container */}
            <div className="relative group">
                <div
                    className={`${sizeClasses[size]} mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-indigo-100 cursor-pointer transition-all duration-300 hover:ring-indigo-200 hover:shadow-xl ${disabled ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                    onClick={handleImageClick}
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                            <User size={iconSizes[size]} className="text-white opacity-90" />
                        </div>
                    )}
                </div>

                {/* Camera Overlay on Hover */}
                {!disabled && (
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center pointer-events-none">
                        <Camera
                            size={32}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    </div>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                name={name}
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled}
                className="hidden"
            />

            {/* Upload Hint */}
            {!disabled && !preview && (
                <p className="text-xs text-gray-500 mt-2">
                    Click to upload photo
                </p>
            )}

            {!disabled && preview && (
                <p className="text-xs text-gray-500 mt-2">
                    Click to change photo
                </p>
            )}
        </div>
    );
};

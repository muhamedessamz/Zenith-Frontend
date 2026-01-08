
import { useNavigate } from 'react-router-dom';

interface ProfileAvatarProps {
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    imageUrl?: string;
}

export const ProfileAvatar = ({ name, size = 'md', imageUrl }: ProfileAvatarProps) => {
    const navigate = useNavigate();

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl'
    };

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getColorFromName = (name?: string) => {
        if (!name) return 'from-gray-500 to-gray-600';

        const colors = [
            'from-indigo-500 to-indigo-600',
            'from-purple-500 to-purple-600',
            'from-pink-500 to-pink-600',
            'from-blue-500 to-blue-600',
            'from-cyan-500 to-cyan-600',
            'from-teal-500 to-teal-600',
            'from-green-500 to-green-600',
            'from-orange-500 to-orange-600',
        ];

        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const handleClick = () => {
        navigate('/profile');
    };

    if (imageUrl) {
        return (
            <button
                onClick={handleClick}
                className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105`}
            >
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getColorFromName(name)} flex items-center justify-center text-white font-bold shadow-md border-2 border-white hover:shadow-lg transition-all cursor-pointer hover:scale-105`}
        >
            {getInitials(name)}
        </button>
    );
};

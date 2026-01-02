import { useMemo } from 'react';
import { useAuthStore } from '../store/authStore';

interface UserDisplayProps {
    user?: {
        id: string;
        firstName?: string;
        lastName?: string;
        displayName?: string;
        userName?: string;
        profilePicture?: string;
        email?: string;
    };
    fallbackName?: string; // For legacy comments
    size?: 'sm' | 'md' | 'lg';
    showAvatar?: boolean;
}

export const UserDisplay = ({ user, fallbackName, size = 'md', showAvatar = true }: UserDisplayProps) => {
    const { user: currentUser } = useAuthStore();

    // Responsive Logic: If userId matches current user, use store data for instant updates!
    const displayUser = useMemo(() => {
        if (!user) {
            console.log('UserDisplay: No user prop provided', { fallbackName });
            return null;
        }

        console.log('UserDisplay received user:', user);
        console.log('Current user from store:', currentUser);

        if (currentUser && user.id === currentUser.id) {
            console.log('Using currentUser from store');
            return currentUser;
        }
        console.log('Using user prop');
        return user;
    }, [user, currentUser]);

    const displayName =
        (displayUser?.firstName && displayUser.lastName ? `${displayUser.firstName} ${displayUser.lastName}` : null) ||
        displayUser?.displayName ||
        displayUser?.email ||
        'User';

    console.log('Final displayName:', displayName, 'from user:', displayUser);

    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base'
    };

    return (
        <div className="flex items-center gap-2">
            {showAvatar && (
                displayUser?.profilePicture ? (
                    <img
                        src={displayUser.profilePicture}
                        alt={displayName}
                        className={`${sizeClasses[size]} rounded-full object-cover shrink-0 border border-gray-200`}
                    />
                ) : (
                    <div className={`${sizeClasses[size]} rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shrink-0`}>
                        {initials || '?'}
                    </div>
                )
            )}
            <span className="font-medium text-gray-900">{displayName}</span>
        </div>
    );
};

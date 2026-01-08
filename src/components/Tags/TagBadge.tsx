import { Hash } from 'lucide-react';
import type { Tag } from '../../types/tag';

interface TagBadgeProps {
    tag: Tag;
    size?: 'sm' | 'md';
    onClick?: () => void;
}

export const TagBadge = ({ tag, size = 'sm', onClick }: TagBadgeProps) => {
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm'
    };

    const iconSize = size === 'sm' ? 12 : 14;

    return (
        <div
            className={`inline-flex items-center gap-1 rounded-full font-medium transition-all ${sizeClasses[size]} ${onClick ? 'cursor-pointer hover:opacity-80' : ''
                }`}
            style={{
                backgroundColor: tag.color + '20',
                color: tag.color
            }}
            onClick={onClick}
        >
            <Hash size={iconSize} />
            <span>{tag.name}</span>
        </div>
    );
};

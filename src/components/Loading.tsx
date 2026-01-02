import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: number;
    className?: string;
    text?: string;
}

export const LoadingSpinner = ({
    size = 48,
    className = '',
    text
}: LoadingSpinnerProps) => {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <Loader2
                size={size}
                className="animate-spin text-indigo-600"
            />
            {text && (
                <p className="text-sm text-gray-600 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};

interface FullPageLoadingProps {
    text?: string;
}

export const FullPageLoading = ({ text = 'Loading...' }: FullPageLoadingProps) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <LoadingSpinner size={48} text={text} />
        </div>
    );
};

interface InlineLoadingProps {
    text?: string;
    size?: number;
}

export const InlineLoading = ({ text, size = 20 }: InlineLoadingProps) => {
    return (
        <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 size={size} className="animate-spin text-indigo-600" />
            {text && <span className="text-sm text-gray-600">{text}</span>}
        </div>
    );
};

interface ButtonLoadingProps {
    text?: string;
}

export const ButtonLoading = ({ text = 'Loading...' }: ButtonLoadingProps) => {
    return (
        <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            {text}
        </span>
    );
};

interface SkeletonProps {
    className?: string;
    count?: number;
}

export const Skeleton = ({ className = '', count = 1 }: SkeletonProps) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`animate-pulse bg-gray-200 rounded ${className}`}
                />
            ))}
        </>
    );
};

export const CardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
            </div>
        </div>
    );
};

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                </div>
            ))}
        </div>
    );
};

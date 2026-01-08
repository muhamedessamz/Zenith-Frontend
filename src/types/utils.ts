// Utility types for better type safety

// API Error Response
export interface ApiError {
    response?: {
        data?: {
            error?: string;
            message?: string;
            title?: string;
        };
        status?: number;
    };
    message?: string;
}

// Type guard to check if error is an API error
export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
    );
}

// Extract error message from unknown error
export function getErrorMessage(error: unknown): string {
    if (isApiError(error)) {
        return (
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.response?.data?.title ||
            error.message ||
            'An error occurred'
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unknown error occurred';
}

// Queue item for axios interceptor
export interface QueueItem {
    resolve: (value: string | null) => void;
    reject: (reason?: any) => void;
}

// Drag and Drop Event types
export interface DragStartEvent {
    active: {
        id: string | number;
        data: {
            current?: {
                type?: string;
                task?: any;
            };
        };
    };
}

export interface DragEndEvent extends DragStartEvent {
    over: {
        id: string | number;
        data: {
            current?: {
                type?: string;
                accepts?: string[];
            };
        };
    } | null;
}

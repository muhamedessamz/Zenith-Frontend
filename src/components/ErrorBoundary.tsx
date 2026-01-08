import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('Error caught by boundary:', error, errorInfo);
        }

        this.setState({
            error,
            errorInfo,
        });

        // TODO: Log to error reporting service (e.g., Sentry)
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center p-6">
                    <div className="max-w-2xl w-full">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
                            {/* Error Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle size={40} className="text-red-600" />
                                </div>
                            </div>

                            {/* Error Message */}
                            <div className="text-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Oops! Something went wrong
                                </h1>
                                <p className="text-gray-600">
                                    We're sorry for the inconvenience. The application encountered an unexpected error.
                                </p>
                            </div>

                            {/* Error Details (Development Only) */}
                            {import.meta.env.DEV && this.state.error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm font-mono text-red-800 mb-2">
                                        <strong>Error:</strong> {this.state.error.message}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="mt-2">
                                            <summary className="text-sm text-red-700 cursor-pointer hover:text-red-900">
                                                Stack Trace
                                            </summary>
                                            <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40 p-2 bg-red-100 rounded">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={this.handleReset}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    <RefreshCw size={18} />
                                    Try Again
                                </button>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    <Home size={18} />
                                    Go Home
                                </button>
                            </div>

                            {/* Help Text */}
                            <p className="text-center text-sm text-gray-500 mt-6">
                                If this problem persists, please contact support or try refreshing the page.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

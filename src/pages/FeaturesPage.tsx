import { Logo } from '../components/Logo';
import { Link } from 'react-router-dom';
import {
    CheckCircle2, Users, Kanban, Calendar, Tag, Link2, Clock,
    BarChart3, Bell, Shield, FileText, Share2, List, Zap,
    GitBranch, Upload, Eye, Settings, ArrowRight
} from 'lucide-react';

export const FeaturesPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Navigation - Same as Landing Page */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <div className="glass-effect border-b border-white/20">
                    <nav className="container mx-auto px-6">
                        <div className="flex items-center justify-between h-20">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                                <Logo size={36} showText={true} />
                            </div>

                            {/* Center Navigation */}
                            <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                                <Link to="/" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                                    Home
                                </Link>
                                <Link to="/features" className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1">
                                    Features
                                </Link>
                                <a href="/how-it-works" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                                    How It Works
                                </a>
                                <a href="/pricing" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                                    Pricing
                                </a>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="btn btn-ghost text-sm">
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Get Started Free
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-16 pt-24">
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                        <span className="gradient-text">Complete Feature</span> Overview
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover all the powerful features that make Zenith the ultimate task management platform
                    </p>
                </div>

                {/* Feature Categories */}
                <div className="space-y-20">
                    {featureCategories.map((category, categoryIndex) => (
                        <section key={categoryIndex} className="scroll-mt-20">
                            {/* Category Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                                    <category.icon size={32} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                                    <p className="text-gray-600">{category.description}</p>
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.features.map((feature, featureIndex) => (
                                    <div
                                        key={featureIndex}
                                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all group"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                                                <feature.icon size={20} className="text-indigo-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 mb-1">{feature.name}</h3>
                                                <p className="text-sm text-gray-600">{feature.description}</p>
                                            </div>
                                        </div>
                                        {feature.highlights && (
                                            <ul className="space-y-2 mt-4">
                                                {feature.highlights.map((highlight, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                                                        <span>{highlight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-20 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-2xl p-12 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Start using all these powerful features today
                    </p>
                    <Link to="/register" className="btn bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-4">
                        Start Free Trial
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </main>

            {/* Footer - Same as Landing Page */}
            <footer className="py-12 px-6 bg-slate-900 text-white mt-20">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                        <div className="col-span-2 lg:col-span-2">
                            <Logo variant="white" size={36} />
                            <p className="text-gray-400 mt-6 text-sm leading-relaxed max-w-sm">
                                The ultimate task management platform for modern teams.
                                Collaborate, track, and achieve more together.
                            </p>
                        </div>

                        <div className="lg:col-span-1">
                            <h4 className="font-bold mb-6 text-lg">Product</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><Link to="/features" className="hover:text-white transition-colors duration-200">Features</Link></li>
                                <li><a href="/pricing" className="hover:text-white transition-colors duration-200">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Security</a></li>
                            </ul>
                        </div>

                        <div className="lg:col-span-1">
                            <h4 className="font-bold mb-6 text-lg">Company</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors duration-200">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Careers</a></li>
                            </ul>
                        </div>

                        <div className="lg:col-span-1">
                            <h4 className="font-bold mb-6 text-lg">Support</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Status</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; 2025 Zenith. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const featureCategories = [
    {
        icon: CheckCircle2,
        title: 'Task Management',
        description: 'Complete control over your tasks and projects',
        features: [
            {
                icon: List,
                name: 'CRUD Operations',
                description: 'Create, read, update, and delete tasks with ease',
                highlights: [
                    'Quick task creation',
                    'Inline editing',
                    'Bulk operations',
                    'Soft delete with restore'
                ]
            },
            {
                icon: Tag,
                name: 'Categories & Tags',
                description: 'Organize with color-coded categories and flexible tags',
                highlights: [
                    'Custom categories',
                    '20+ tag colors',
                    'Multi-tag support',
                    'Filter by tags'
                ]
            },
            {
                icon: Zap,
                name: 'Priority Levels',
                description: 'Set task priorities from Low to Critical',
                highlights: [
                    '4 priority levels',
                    'Color indicators',
                    'Priority-based sorting',
                    'Visual badges'
                ]
            },
            {
                icon: FileText,
                name: 'Rich Descriptions',
                description: 'Add detailed descriptions and notes to tasks',
                highlights: [
                    'Markdown support',
                    'Unlimited length',
                    'Formatting options',
                    'Quick preview'
                ]
            },
            {
                icon: Calendar,
                name: 'Due Dates & Times',
                description: 'Set precise deadlines with date and time',
                highlights: [
                    'Date picker',
                    'Time selection',
                    'Overdue indicators',
                    'Calendar integration'
                ]
            },
            {
                icon: CheckCircle2,
                name: 'Checklist Items',
                description: 'Break tasks into smaller actionable items',
                highlights: [
                    'Unlimited items',
                    'Progress tracking',
                    'Inline editing',
                    'Completion percentage'
                ]
            }
        ]
    },
    {
        icon: Users,
        title: 'Team Collaboration',
        description: 'Work together seamlessly with your team',
        features: [
            {
                icon: Users,
                name: 'Multi-user Assignment',
                description: 'Assign tasks to multiple team members',
                highlights: [
                    'Multiple assignees',
                    'User avatars',
                    'Assignment notifications',
                    'Workload distribution'
                ]
            },
            {
                icon: FileText,
                name: 'Comments & Discussions',
                description: 'Collaborate with threaded comments',
                highlights: [
                    'Real-time comments',
                    'Edit & delete',
                    'User mentions',
                    'Comment history'
                ]
            },
            {
                icon: Share2,
                name: 'Shared Links',
                description: 'Share tasks with view-only access',
                highlights: [
                    'Secure tokens',
                    'Expiration dates',
                    'No login required',
                    'Revoke anytime'
                ]
            },
            {
                icon: Bell,
                name: 'Real-time Notifications',
                description: 'Stay updated with SignalR notifications',
                highlights: [
                    'Instant updates',
                    'Task assignments',
                    'Comment mentions',
                    'Due date reminders'
                ]
            }
        ]
    },
    {
        icon: Kanban,
        title: 'Multiple Views',
        description: 'Visualize your work in different ways',
        features: [
            {
                icon: Kanban,
                name: 'Kanban Board',
                description: 'Drag-and-drop task management',
                highlights: [
                    'Drag & drop',
                    'Status columns',
                    'Smooth animations',
                    'Mobile-friendly'
                ]
            },
            {
                icon: Calendar,
                name: 'Calendar View',
                description: 'See tasks in monthly calendar format',
                highlights: [
                    'Month view',
                    'Task indicators',
                    'Date selection',
                    'Priority colors'
                ]
            },
            {
                icon: List,
                name: 'List View',
                description: 'Traditional list with powerful filters',
                highlights: [
                    'Advanced filters',
                    'Sorting options',
                    'Pagination',
                    'Quick actions'
                ]
            },
            {
                icon: BarChart3,
                name: 'Dashboard',
                description: 'Overview with charts and statistics',
                highlights: [
                    'Task statistics',
                    'Progress charts',
                    'Priority breakdown',
                    'Category distribution'
                ]
            }
        ]
    },
    {
        icon: Clock,
        title: 'Time & Progress Tracking',
        description: 'Monitor time and track dependencies',
        features: [
            {
                icon: Clock,
                name: 'Time Tracking',
                description: 'Built-in timer for accurate time logging',
                highlights: [
                    'Start/stop timer',
                    'Time history',
                    'Total time',
                    'Per-task tracking'
                ]
            },
            {
                icon: Link2,
                name: 'Task Dependencies',
                description: 'Link related tasks and manage blockers',
                highlights: [
                    'Add dependencies',
                    'Blocker detection',
                    'Circular prevention',
                    'Visual indicators'
                ]
            },
            {
                icon: BarChart3,
                name: 'Analytics',
                description: 'Detailed insights and reports',
                highlights: [
                    'Completion rates',
                    'Time analytics',
                    'Team performance',
                    'Export reports'
                ]
            },
            {
                icon: GitBranch,
                name: 'Project Management',
                description: 'Organize tasks into projects',
                highlights: [
                    'Multiple projects',
                    'Project members',
                    'Project tasks',
                    'Progress tracking'
                ]
            }
        ]
    },
    {
        icon: Calendar,
        title: 'Smart Integrations',
        description: 'Connect with your favorite tools',
        features: [
            {
                icon: Calendar,
                name: 'Google Calendar Sync',
                description: 'Automatic two-way synchronization',
                highlights: [
                    'OAuth 2.0',
                    'Auto-sync tasks',
                    'Real-time updates',
                    'Event creation'
                ]
            },
            {
                icon: Upload,
                name: 'File Attachments',
                description: 'Attach files to tasks',
                highlights: [
                    'Up to 10MB',
                    'Multiple files',
                    'Download/delete',
                    'File type validation'
                ]
            },
            {
                icon: Share2,
                name: 'Public Sharing',
                description: 'Share tasks externally',
                highlights: [
                    'View-only links',
                    'Expiration control',
                    'No account needed',
                    'Secure tokens'
                ]
            },
            {
                icon: Bell,
                name: 'Notifications',
                description: 'Multi-channel notifications',
                highlights: [
                    'In-app notifications',
                    'Real-time via SignalR',
                    'Email notifications',
                    'Custom preferences'
                ]
            }
        ]
    },
    {
        icon: Shield,
        title: 'Security & Enterprise',
        description: 'Enterprise-grade security and reliability',
        features: [
            {
                icon: Shield,
                name: 'Authentication',
                description: 'Secure JWT-based authentication',
                highlights: [
                    'JWT tokens',
                    'Email verification',
                    'Password reset',
                    'Session management'
                ]
            },
            {
                icon: Eye,
                name: 'Data Privacy',
                description: 'Your data is encrypted and protected',
                highlights: [
                    'Encrypted storage',
                    'HTTPS only',
                    'No data sharing',
                    'GDPR compliant'
                ]
            },
            {
                icon: Settings,
                name: 'Role-based Access',
                description: 'Control who can do what',
                highlights: [
                    'User roles',
                    'Permissions',
                    'Project access',
                    'Team management'
                ]
            },
            {
                icon: Zap,
                name: 'Performance',
                description: 'Fast and reliable platform',
                highlights: [
                    '99.9% uptime',
                    'Fast loading',
                    'Optimized queries',
                    'Scalable architecture'
                ]
            }
        ]
    }
];

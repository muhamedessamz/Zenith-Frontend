import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    ListTodo,
    FolderKanban,
    Tag,
    Calendar as CalendarIcon,
    Hash,
    User,
    Settings,
    Plus,
    Layout
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { useAuthStore } from '../store/authStore';
import type { DashboardStats } from '../types/dashboard';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { motion } from 'framer-motion';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardService.getStats();
            setStats(data);
        } catch (err: any) {
            console.error('Failed to load dashboard:', err);
            setError(err.response?.data?.error || err.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const shortcuts = [
        { icon: ListTodo, label: 'My Tasks', path: '/tasks', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        { icon: FolderKanban, label: 'Projects', path: '/projects', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        { icon: Layout, label: 'Kanban', path: '/kanban', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
        { icon: CalendarIcon, label: 'Calendar', path: '/calendar', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
        { icon: Tag, label: 'Categories', path: '/categories', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
        { icon: Hash, label: 'Tags', path: '/tags', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { icon: User, label: 'Profile', path: '/profile', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { icon: Settings, label: 'Calendar Settings', path: '/calendar/settings', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' },
    ];



    const chartData = stats?.tasksPerDay?.map(day => ({
        name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        completed: day.tasksCompleted,
        created: day.tasksCreated
    })) || [];

    const priorityData = stats?.priorityStats ? [
        { name: 'Low', value: stats.priorityStats.low, color: '#9CA3AF' },
        { name: 'Medium', value: stats.priorityStats.medium, color: '#3B82F6' },
        { name: 'High', value: stats.priorityStats.high, color: '#F59E0B' },
        { name: 'Critical', value: stats.priorityStats.critical, color: '#EF4444' },
    ].filter(item => item.value > 0) : [];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {getGreeting()}, <span className="text-indigo-600">{user?.firstName || user?.displayName?.split(' ')[0] || 'User'}</span>
                        </h1>
                        <p className="text-gray-500 mt-1 text-lg">
                            Here's what's happening with your projects today.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex gap-3">
                        <button
                            onClick={() => navigate('/tasks')}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                        >
                            <Plus size={20} />
                            New Task
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                        <p className="mt-4 text-gray-500 font-medium">Loading your dashboard...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-10">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load dashboard</h3>
                        <p className="text-red-600 mb-6">{error}</p>
                        <button
                            onClick={fetchDashboardData}
                            className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                ) : stats && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {/* Stats Overview Rows */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Tasks', value: stats.totalTasks, icon: ListTodo, color: 'text-indigo-600', bg: 'bg-indigo-50', borderColor: 'border-indigo-100' },
                                { label: 'Completed', value: stats.completedTasks, subtext: `${Math.round(stats.completionRate)}% Rate`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-emerald-100' },
                                { label: 'In Progress', value: stats.inProgressTasks, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-blue-100' },
                                { label: 'Overdue', value: stats.overdueTasks, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', borderColor: 'border-red-100' },
                            ].map((stat, idx) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        variants={itemVariants}
                                        className={`bg-white rounded-xl p-6 border ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                                                {stat.subtext && (
                                                    <p className="text-xs font-medium text-emerald-600 mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">{stat.subtext}</p>
                                                )}
                                            </div>
                                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                                <Icon className={`w-6 h-6 ${stat.color}`} />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Chart Section */}
                            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Weekly Activity</h2>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="created"
                                                name="Tasks Created"
                                                stroke="#6366f1"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorCreated)"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="completed"
                                                name="Tasks Completed"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorCompleted)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            {/* Shortcuts Grid */}
                            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Access</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {shortcuts.map((shortcut, idx) => {
                                        const Icon = shortcut.icon;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => navigate(shortcut.path)}
                                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${shortcut.bg} ${shortcut.border} hover:shadow-sm`}
                                            >
                                                <Icon className={`w-6 h-6 mb-2 ${shortcut.color}`} />
                                                <span className="text-xs font-semibold text-gray-700">{shortcut.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Priority Distribution */}
                            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Tasks by Priority</h2>
                                {priorityData.length > 0 ? (
                                    <div className="h-[250px] flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={priorityData}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {priorityData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-[250px] flex items-center justify-center text-gray-400">
                                        No tasks found
                                    </div>
                                )}
                            </motion.div>

                            {/* Category Stats */}
                            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Category Performance</h2>
                                <div className="space-y-4">
                                    {stats.categoryStats?.categories && stats.categoryStats.categories.length > 0 ? (
                                        stats.categoryStats.categories.slice(0, 5).map((cat, idx) => (
                                            <div key={idx} className="group">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                                                        <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{cat.categoryName}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        <span className="font-semibold text-gray-900">{cat.completedCount}</span>
                                                        <span className="mx-1">/</span>
                                                        <span>{cat.taskCount} Tasks</span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${(cat.completedCount / cat.taskCount) * 100}%`,
                                                            backgroundColor: cat.color
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-gray-400">No categories to display</div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

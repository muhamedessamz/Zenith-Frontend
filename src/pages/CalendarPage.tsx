import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Clock, Settings } from 'lucide-react';
import { taskService } from '../services/taskService';
import type { Task } from '../types/task';
import { useNavigate } from 'react-router-dom';

export const CalendarPage = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        fetchTasks();
    }, [currentDate]);

    const fetchTasks = async () => {
        try {
            const response = await taskService.getTasks({ pageSize: 1000 });
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    const getTasksForDate = (date: Date) => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return (
                taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear()
            );
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (date: Date) => {
        if (!selectedDate) return false;
        return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
        );
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'bg-red-500';
            case 'High': return 'bg-orange-500';
            case 'Medium': return 'bg-blue-500';
            case 'Low': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    // Generate calendar days
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
                            <span className="gradient-text">Calendar</span>
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg">
                            View your tasks in calendar format
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/calendar/settings')}
                            className="btn btn-secondary flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                            title="Connect Google Calendar"
                        >
                            {/* Using Settings icon but with clearer text, or we could import Cloud/Refresh */}
                            <Settings size={18} className="text-gray-500" />
                            <span className="hidden sm:inline font-medium">Google Calendar Sync</span>
                        </button>
                        <button
                            onClick={goToToday}
                            className="btn btn-primary"
                        >
                            Today
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={previousMonth}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextMonth}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Day Names */}
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {dayNames.map(day => (
                                    <div
                                        key={day}
                                        className="text-center text-sm font-semibold text-gray-600 py-2"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2">
                                {days.map((date, index) => {
                                    if (!date) {
                                        return <div key={`empty-${index}`} className="aspect-square" />;
                                    }

                                    const dateTasks = getTasksForDate(date);


                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedDate(date)}
                                            className={`aspect-square p-2 rounded-lg border-2 transition-all hover:border-indigo-300 ${isToday(date)
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : isSelected(date)
                                                    ? 'border-indigo-400 bg-indigo-50'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex flex-col h-full">
                                                <span
                                                    className={`text-sm font-medium mb-1 ${isToday(date) ? 'text-indigo-600' : 'text-gray-900'
                                                        }`}
                                                >
                                                    {date.getDate()}
                                                </span>
                                                {dateTasks.length > 0 && (
                                                    <div className="flex-1 flex flex-col gap-0.5">
                                                        {dateTasks.slice(0, 3).map(task => (
                                                            <div
                                                                key={task.id}
                                                                className={`h-1 rounded-full ${getPriorityColor(
                                                                    task.priority
                                                                )} ${task.isCompleted ? 'opacity-40' : ''}`}
                                                            />
                                                        ))}
                                                        {dateTasks.length > 3 && (
                                                            <span className="text-xs text-gray-500 mt-0.5">
                                                                +{dateTasks.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Selected Date Tasks */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-4">
                                <CalendarIcon size={20} className="text-gray-700" />
                                <h3 className="font-semibold text-gray-900">
                                    {selectedDate
                                        ? selectedDate.toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })
                                        : 'Select a date'}
                                </h3>
                            </div>

                            {selectedDate ? (
                                selectedDateTasks.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <CalendarIcon size={48} className="mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm">No tasks for this date</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                        {selectedDateTasks.map(task => (
                                            <div
                                                key={task.id}
                                                onClick={() => navigate(`/tasks/${task.id}`)}
                                                className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer"
                                            >
                                                <div className="flex items-start gap-2 mb-2">
                                                    {task.isCompleted ? (
                                                        <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                                                    ) : (
                                                        <Clock size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                                    )}
                                                    <h4
                                                        className={`font-medium text-sm flex-1 ${task.isCompleted
                                                            ? 'line-through text-gray-400'
                                                            : 'text-gray-900'
                                                            }`}
                                                    >
                                                        {task.title}
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-2 ml-6">
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-full ${task.priority === 'Critical'
                                                            ? 'bg-red-100 text-red-700'
                                                            : task.priority === 'High'
                                                                ? 'bg-orange-100 text-orange-700'
                                                                : task.priority === 'Medium'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                    {task.categoryName && (
                                                        <span className="text-xs text-gray-500">
                                                            {task.categoryName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <CalendarIcon size={48} className="mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">Click on a date to view tasks</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

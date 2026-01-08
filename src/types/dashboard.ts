// Dashboard Types matching Backend DTOs

export interface DashboardStats {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    completionRate: number;
    tasksCreatedToday: number;
    tasksCreatedThisWeek: number;
    tasksCreatedThisMonth: number;
    priorityStats: PriorityStats;
    categoryStats: CategoryStats;
    tasksPerDay: DailyTaskCount[];
}

export interface PriorityStats {
    low: number;
    medium: number;
    high: number;
    critical: number;
}

export interface CategoryStats {
    categories: CategoryTaskCount[];
    uncategorized: number;
}

export interface CategoryTaskCount {
    categoryId: number;
    categoryName: string;
    color: string;
    taskCount: number;
    completedCount: number;
}

export interface DailyTaskCount {
    date: string;
    tasksCreated: number;
    tasksCompleted: number;
}

// Legacy types for compatibility
export interface TasksPerDay {
    date: string;
    count: number;
}

export interface WeeklyProgress {
    day: string;
    completed: number;
    total: number;
}

export interface RecentActivity {
    id: number;
    taskTitle: string;
    action: string;
    status: 'completed' | 'in progress' | 'pending' | 'overdue';
    time: string;
    color: 'green' | 'amber' | 'indigo' | 'red';
}

// Calendar Types

export interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: {
        taskId: number;
        priority: 'Low' | 'Medium' | 'High' | 'Critical';
        isCompleted: boolean;
        categoryName?: string;
        description?: string;
    };
}

export interface CalendarViewType {
    month: 'month';
    week: 'week';
    day: 'day';
    agenda: 'agenda';
}

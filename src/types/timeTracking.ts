export interface TimeEntry {
    id: number;
    startTime: string;
    endTime?: string;
    notes?: string;
    isManual: boolean;
    userId: string;
    userName: string;
    createdAt: string;
}

export interface TimeTrackingStats {
    totalTime: string; // Format: "hh:mm:ss"
    entries: TimeEntry[];
}

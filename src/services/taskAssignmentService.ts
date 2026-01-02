import api from '../lib/axios';

export interface TaskAssignment {
    id: number;
    taskId: number;
    assignedTo: {
        id: string;
        email: string;
        displayName: string;
        firstName: string;
        lastName: string;
        profilePicture?: string;
    };
    assignedAt: string;
    note?: string;
}

export interface AssignTaskDto {
    userIdentifier: string; // Email or DisplayName or UserId
    note?: string;
    permission?: 'Viewer' | 'Editor';
}

class TaskAssignmentService {
    // Get assignments for a task
    async getAssignments(taskId: number): Promise<TaskAssignment[]> {
        const response = await api.get(`/tasks/${taskId}/assignments`);
        return response.data;
    }

    // Assign user to task
    async assignTask(taskId: number, userIdOrDto: string | AssignTaskDto, note?: string): Promise<TaskAssignment> {
        const dto = typeof userIdOrDto === 'string'
            ? { userIdentifier: userIdOrDto, note, permission: 'Editor' as const }
            : userIdOrDto;
        const response = await api.post(`/tasks/${taskId}/assignments`, dto);
        return response.data;
    }

    // Alias for getAssignments
    async getTaskAssignments(taskId: number): Promise<TaskAssignment[]> {
        return this.getAssignments(taskId);
    }

    // Unassign user from task by userId
    async unassignTask(taskId: number, userId: string): Promise<void> {
        const assignments = await this.getAssignments(taskId);
        const assignment = assignments.find(a => a.assignedTo.id === userId);
        if (assignment) {
            await this.removeAssignment(taskId, assignment.id);
        }
    }

    // Remove assignment
    async removeAssignment(taskId: number, assignmentId: number): Promise<void> {
        await api.delete(`/tasks/${taskId}/assignments/${assignmentId}`);
    }

    // Get tasks assigned to me
    async getAssignedToMe(): Promise<any[]> {
        const response = await api.get('/tasks/assigned-to-me');
        return response.data;
    }

    // Get tasks assigned by me
    async getAssignedByMe(): Promise<any[]> {
        const response = await api.get('/tasks/assigned-by-me');
        return response.data;
    }
}

export const taskAssignmentService = new TaskAssignmentService();

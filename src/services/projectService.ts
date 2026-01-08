import api from '../lib/axios';
import type { Project, CreateProjectDto, UpdateProjectDto } from '../types/project';

// Project Service
class ProjectService {
    private readonly baseUrl = '/Projects';

    // Map backend DTO to frontend Project model
    private mapToProject(dto: any): Project {
        return {
            ...dto,
            // Map Title from backend to name for frontend
            name: dto.title || dto.Title || dto.name || '',
            // Map OwnerId from backend to userId for frontend
            userId: dto.ownerId || dto.userId,
            // Derive status from isCompleted
            status: dto.isCompleted ? 'Completed' : 'InProgress',
            // Ensure these fields exist
            priority: dto.priority || 'Medium',
            isCompleted: dto.isCompleted || false,
            ownerName: dto.ownerName || '',
            taskCount: dto.taskCount || 0,
        };
    }

    // Get all projects
    async getProjects(): Promise<Project[]> {
        const response = await api.get<any[]>(this.baseUrl);
        return response.data.map(dto => this.mapToProject(dto));
    }

    // Get project by ID
    async getProjectById(id: number): Promise<Project> {
        const response = await api.get<any>(`${this.baseUrl}/${id}`);
        return this.mapToProject(response.data);
    }

    // Create new project
    async createProject(data: CreateProjectDto): Promise<Project> {
        // Map frontend status to backend isCompleted
        const payload = {
            ...data,
            isCompleted: data.status === 'Completed',
            priority: data.priority || 'Medium'
        };
        const response = await api.post<any>(this.baseUrl, payload);
        return this.mapToProject(response.data);
    }

    // Update project
    async updateProject(id: number, data: UpdateProjectDto): Promise<Project> {
        // Map frontend status to backend isCompleted
        const payload = {
            ...data,
            isCompleted: data.status === 'Completed' || data.isCompleted,
            priority: data.priority || 'Medium'
        };
        const response = await api.put<any>(`${this.baseUrl}/${id}`, payload);
        return this.mapToProject(response.data);
    }

    // Delete project
    async deleteProject(id: number): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    // Get project members
    async getMembers(id: number): Promise<any[]> {
        const response = await api.get(`${this.baseUrl}/${id}/members`);
        return response.data;
    }

    // Alias for getMembers
    async getProjectMembers(id: number): Promise<any[]> {
        return this.getMembers(id);
    }

    // Add member to project
    async addMember(id: number, userIdentifier: string, role: string = 'Viewer'): Promise<void> {
        await api.post(`${this.baseUrl}/${id}/members`, { userIdentifier, role });
    }

    // Remove member from project
    async removeMember(id: number, userId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}/members/${userId}`);
    }
}

export const projectService = new ProjectService();

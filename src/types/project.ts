// Project Types

export interface Project {
    id: number;
    title: string;
    name: string; // Mapped from title by projectService
    description?: string;
    startDate?: string;
    endDate?: string;
    status: 'NotStarted' | 'InProgress' | 'Completed' | 'OnHold';
    priority?: string;
    isCompleted: boolean;
    categoryId?: number;
    categoryName?: string;
    userId: string;
    ownerName?: string;
    createdAt: string;
    taskCount: number;
    currentUserRole?: string;
    members?: ProjectMember[];
}

export interface ProjectMember {
    id: number;
    userId: string;
    displayName: string;
    email: string;
    profilePicture?: string;
    role: string;
    joinedAt: string;
}

export interface CreateProjectDto {
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: 'NotStarted' | 'InProgress' | 'Completed' | 'OnHold';
    priority?: string;
    categoryId?: number;
}

export interface UpdateProjectDto {
    id: number;
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: 'NotStarted' | 'InProgress' | 'Completed' | 'OnHold';
    priority?: string;
    isCompleted?: boolean;
    categoryId?: number;
}

export interface AddProjectMemberDto {
    userIdentifier: string;
    role: string;
}

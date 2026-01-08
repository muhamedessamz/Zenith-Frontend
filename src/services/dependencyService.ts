import api from '../lib/axios';
import type { TaskDependency, DependencyBlocker } from '../types/dependency';

class DependencyService {
    // Add a dependency (task depends on another task)
    async addDependency(taskId: number, dependsOnTaskId: number): Promise<void> {
        await api.post(`/tasks/${taskId}/dependencies/${dependsOnTaskId}`);
    }

    // Remove a dependency
    async removeDependency(taskId: number, dependsOnTaskId: number): Promise<void> {
        await api.delete(`/tasks/${taskId}/dependencies/${dependsOnTaskId}`);
    }

    // Get all dependencies for a task
    async getDependencies(taskId: number): Promise<TaskDependency[]> {
        const response = await api.get<TaskDependency[]>(`/tasks/${taskId}/dependencies`);
        return response.data;
    }

    // Get tasks that are blocking this task
    async getBlockers(taskId: number): Promise<DependencyBlocker[]> {
        const response = await api.get<DependencyBlocker[]>(`/tasks/${taskId}/dependencies/blockers`);
        return response.data;
    }

    // Check if task can be started (all dependencies completed)
    canStartTask(dependencies: TaskDependency[]): boolean {
        return dependencies.every(dep => dep.dependsOnTask.isCompleted);
    }

    // Get incomplete dependencies
    getIncompleteDependencies(dependencies: TaskDependency[]): TaskDependency[] {
        return dependencies.filter(dep => !dep.dependsOnTask.isCompleted);
    }
}

export const dependencyService = new DependencyService();

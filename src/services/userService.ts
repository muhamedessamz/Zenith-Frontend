import api from '../lib/axios';

export interface UserSummary {
    id: string;
    email: string;
    displayName: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
}

class UserService {
    private readonly baseUrl = '/Users';

    async searchUsers(query: string): Promise<UserSummary[]> {
        if (!query || query.length < 3) return [];
        const response = await api.get<UserSummary[]>(`${this.baseUrl}/search?query=${encodeURIComponent(query)}`);
        return response.data;
    }
}

export const userService = new UserService();

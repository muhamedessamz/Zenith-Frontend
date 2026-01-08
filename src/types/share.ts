export interface SharedLink {
    token: string;
    publicUrl: string;
    expiry: string | null;
}

export interface GenerateLinkRequest {
    entityType: 'Task' | 'Project';
    entityId: number;
    expiresAt?: string;
}

export interface SharedContent {
    entityType: string;
    data: any;
}

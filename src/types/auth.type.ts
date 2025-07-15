export interface loginResponse {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    user?: user;
}

export interface user {
    id: number;
    username: string;
    email: string;
    role: string;
}

export interface payloadCreate {
    name: string;
    status: string;
    parent_id: number;
}

export interface payloadGetAll {
    s?: string | null;
    limit: number;
    page: number;
}

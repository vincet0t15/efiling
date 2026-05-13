export interface DocumentUpdate {
    id: number;
    document_id: number;
    description: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    user?: User;
    files?: DocumentFile[];
}
export interface Document {
    id: number;
    tracking_number: string;
    title: string;
    description: string | null;
    document_type_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    document_type?: DocumentType;
    user?: User;
    files?: DocumentFile[];
    updates?: DocumentUpdate[];
}

export type DocumentCreateRequest = {
    title: string;
    description: string | null;
    document_type_id: number;
    files: File[];
};

export type DocumentUpdateRequest = {
    title: string;
    description: string | null;
    document_type_id: number;
};

export type DocumentUpdateAddRequest = {
    description: string;
    files: File[];
};
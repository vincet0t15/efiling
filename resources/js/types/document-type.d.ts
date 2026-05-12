export interface DocumentType {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    documents_count?: number;
}

export type DocumentTypeCreateRequest = Omit<DocumentType, 'id' | 'created_at' | 'updated_at' | 'documents_count'>;
export type DocumentTypeUpdateRequest = Partial<DocumentTypeCreateRequest>;
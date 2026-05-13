export interface DocumentFile {
    id: number;
    document_id: number;
    original_filename: string;
    stored_filename: string;
    file_path: string;
    file_type: string | null;
    file_size: number | null;
    created_at: string;
    updated_at: string;
}
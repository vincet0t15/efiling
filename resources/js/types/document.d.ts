import { DocumentTypeProps } from "./documentType";

export interface DocumentProps {
    id: number;
    document_type_id: number;
    title: string;
    description?: string;
    office_receiver_id: number;
    document_type: DocumentTypeProps;
    document_files?: File[];
}

export interface DocumentCreateProps {
    document_type_id: string;
    title: string;
    description?: string;
    document_files: File[];
    existing_files?: any[];
    new_files?: File[];
    removed_file_ids?: number[];
}

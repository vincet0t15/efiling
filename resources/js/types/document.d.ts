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

export type DocumentCreateProps = Omit<DocumentProps, 'id', 'office_receiver_id', 'document_type'>;
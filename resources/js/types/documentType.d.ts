export interface DocumentTypeProps {
    id: number;
    name: string;
    code: string;
}

export type DocumentTypes = Omit<DocumentTypeProps, 'id'>
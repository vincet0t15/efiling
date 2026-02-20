export interface DocumentProps {
    id: number;
    document_type_id: number;
    title: string;
    description?: string;
    office_receiver_id: number;
}

export type DocumentCreateProps = Omit<DocumentProps, 'id', 'office_receiver_id'>;
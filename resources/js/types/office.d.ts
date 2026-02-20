import { User } from "./auth";

export interface OfficeProps {
    id: number;
    name: string;
    code: string;
    users: User[]
}

export type OfficeType = Omit<OfficeProps, 'id' | 'users'>;
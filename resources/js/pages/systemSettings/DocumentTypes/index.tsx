import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import offices from '@/routes/offices';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';

import { PaginatedDataResponse } from '@/types/pagination';
import { OfficeProps } from '@/types/office';
import { FilterProps } from '@/types/filter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/paginationData';
import documentTypes from '@/routes/document-types';
import { DocumentTypeProps } from '@/types/documentType';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Document Types',
        href: documentTypes.index.url(),
    },
];

interface Props {
    documentTypesList: PaginatedDataResponse<DocumentTypeProps>;
    filters: FilterProps;
}

export default function DocumentTypeIndex({ documentTypesList, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentTypeProps>();

    const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearch(e.target.value);
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        const queryString = search ? search : '';
        if (e.key === 'Enter') {
            e.preventDefault();
            router.get(documentTypes.index.url(), {
                search: queryString
            }, {
                preserveState: true,
                replace: true,
            })
        }
    }

    const onEditClick = (documentType: DocumentTypeProps) => {
        setSelectedDocumentType(documentType);
        setOpenEdit(true);
    }

    const onDeleteClick = (documentType: DocumentTypeProps) => {
        setSelectedDocumentType(documentType);
        setOpenDelete(true);
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Document Type" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button onClick={() => setOpenCreate(true)} className='cursor-pointer rounded-sm'>
                        <PlusIcon />
                        <span className="rounded-sm lg:inline">Add Document Type</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input placeholder="Search..." className="" value={search} onChange={handleSearch} onKeyDown={handleKeyDown} />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-primary font-bold">Document Type Name</TableHead>
                                <TableHead className="text-primary font-bold">Document Type Code</TableHead>
                                <TableHead className="text-primary font-bold text-center w-25"> Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documentTypesList.data.length > 0 ? (
                                documentTypesList.data.map((documentType, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell>
                                            <span >{documentType.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span >{documentType.code}</span>
                                        </TableCell>


                                        <TableCell className="text-sm gap-2 flex justify-end">
                                            <span
                                                className="cursor-pointer text-green-500 hover:text-green-700 hover:underline"
                                                onClick={() => onEditClick(documentType)}
                                            >
                                                Edit
                                            </span>
                                            <span
                                                className="text-red-500 cursor-pointer hover:text-orange-700 hover:underline"
                                                onClick={() => onDeleteClick(documentType)}
                                            >
                                                Delete
                                            </span>


                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-3 text-center text-gray-500">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={documentTypesList} />
                </div>
            </div>

        </AppLayout>
    );
}

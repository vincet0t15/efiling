import Heading from '@/components/heading';
import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { DocumentType } from '@/types/document-type';
import type { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import documentTypes from '@/routes/document-types';
import { CreateDocumentTypeDialog } from './create';
import { DeleteDocumentTypeDialog } from './delete';
import { EditDocumentTypeDialog } from './edit';

interface IndexProps {
    data: PaginatedDataResponse<DocumentType>;
    filters: {
        search?: string;
    };
}

export default function DocumentTypeIndex({ data, filters }: IndexProps) {
    const { data: searchData, setData } = useForm({
        search: filters.search || '',
    });

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] =
        useState<DocumentType | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const queryString = searchData.search
                ? { search: searchData.search }
                : undefined;
            router.get(documentTypes.index(), queryString, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleEditClick = (documentType: DocumentType) => {
        setSelectedDocumentType(documentType);
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (documentType: DocumentType) => {
        setSelectedDocumentType(documentType);
        setOpenDeleteDialog(true);
    };

    return (
        <>
            <Head title="Document Types" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Document Types"
                    description="Manage document type categories."
                />

                {/* Search and Create buttons */}
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button onClick={() => setOpenCreateDialog(true)}>
                        <PlusIcon className="h-4 w-4" />
                        Create Document Type
                    </Button>
                    <div className="relative w-full sm:w-[250px]">
                        <Label htmlFor="search" className="sr-only">
                            Search
                        </Label>
                        <Input
                            id="search"
                            placeholder="Search..."
                            className="w-full pl-8"
                            value={searchData.search}
                            onChange={(e) =>
                                setData({ search: e.target.value })
                            }
                            onKeyDown={handleSearchKeyDown}
                        />
                        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                    </div>
                </div>

                {/* Table */}
                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Description
                                </TableHead>
                                <TableHead className="text-right font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.data.length > 0 ? (
                                data.data.map((documentType) => (
                                    <TableRow
                                        key={documentType.id}
                                        className="text-sm hover:bg-muted/30"
                                    >
                                        <TableCell className="text-sm font-medium">
                                            {documentType.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {documentType.description || '-'}
                                        </TableCell>
                                        <TableCell className="flex items-center justify-end gap-2 text-sm">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleEditClick(
                                                        documentType,
                                                    )
                                                }
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDeleteClick(
                                                        documentType,
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination data={data} />

                {/* Dialogs */}
                {openCreateDialog && (
                    <CreateDocumentTypeDialog
                        isOpen={openCreateDialog}
                        onClose={() => setOpenCreateDialog(false)}
                    />
                )}
                {openEditDialog && selectedDocumentType && (
                    <EditDocumentTypeDialog
                        isOpen={openEditDialog}
                        onClose={() => setOpenEditDialog(false)}
                        documentType={selectedDocumentType}
                    />
                )}
                {openDeleteDialog && selectedDocumentType && (
                    <DeleteDocumentTypeDialog
                        isOpen={openDeleteDialog}
                        onClose={() => setOpenDeleteDialog(false)}
                        documentType={selectedDocumentType}
                    />
                )}
            </div>
        </>
    );
}

DocumentTypeIndex.layout = {
    breadcrumbs: [
        {
            title: 'Document Types',
            href: documentTypes.index(),
        },
    ],
};

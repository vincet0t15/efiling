import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    EyeIcon,
    PencilIcon,
    PlusIcon,
    Search,
    Trash2,
    FileText,
} from 'lucide-react';
import { useState } from 'react';

import { CustomComboBox } from '@/components/CustomComboBox';
import Heading from '@/components/heading';
import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import documents from '@/routes/documents';
import type { Document } from '@/types/document';
import type { DocumentType } from '@/types/document-type';
import type { PaginatedDataResponse } from '@/types/pagination';
import { CreateDocumentDialog } from './create';
import { DeleteDocumentDialog } from './delete';
import { EditDocumentDialog } from './edit';

interface IndexProps {
    data: PaginatedDataResponse<Document>;
    filters: {
        search?: string;
        document_type_id?: string;
    };
    documentTypes: DocumentType[];
}

export default function DocumentIndex({
    data,
    filters,
    documentTypes,
}: IndexProps) {
    const { data: searchData, setData: setSearchData } = useForm({
        search: filters.search || '',
    });

    const { data: filterData, setData: setFilterData } = useForm({
        document_type_id: filters.document_type_id || 'all',
    });

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(
        null,
    );
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    // Handle flash messages (e.g., tracking number after document creation)
    const initialFlash = (usePage().props as { flash?: { tracking_number?: string } }).flash;
    const [showSuccessDialog, setShowSuccessDialog] = useState(!!initialFlash?.tracking_number);
    const [createdTrackingNumber] = useState(initialFlash?.tracking_number || '');

    const documentTypeOptions = [
        { value: 'all', label: 'All Types' },
        ...documentTypes.map((dt) => ({
            value: dt.id.toString(),
            label: dt.name,
        })),
    ];

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const queryString: Record<string, string> = {};

            if (searchData.search) {
                queryString.search = searchData.search;
            }

            if (
                filterData.document_type_id &&
                filterData.document_type_id !== 'all'
            ) {
                queryString.document_type_id = filterData.document_type_id;
            }

            router.get(
                documents.index(),
                Object.keys(queryString).length > 0 ? queryString : undefined,
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    };

    const handleFilterChange = () => {
        const queryString: Record<string, string> = {};

        if (searchData.search) {
            queryString.search = searchData.search;
        }

        if (
            filterData.document_type_id &&
            filterData.document_type_id !== 'all'
        ) {
            queryString.document_type_id = filterData.document_type_id;
        }

        router.get(
            documents.index(),
            Object.keys(queryString).length > 0 ? queryString : undefined,
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleEditClick = (document: Document) => {
        setSelectedDocument(document);
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (document: Document) => {
        setSelectedDocument(document);
        setOpenDeleteDialog(true);
    };

    const handleViewClick = (document: Document) => {
        router.get(documents.show(document));
    };

    return (
        <>
            <Head title="Documents" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Documents"
                    description="Manage e-filing documents with tracking numbers."
                />

                {/* Search and Create buttons */}
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button onClick={() => setOpenCreateDialog(true)}>
                        <PlusIcon className="h-4 w-4" />
                        Upload Document
                    </Button>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="w-full sm:w-[200px]">
                            <CustomComboBox
                                items={documentTypeOptions}
                                placeholder="Document Type"
                                value={filterData.document_type_id}
                                onSelect={(val) => {
                                    setFilterData(
                                        'document_type_id',
                                        val || 'all',
                                    );
                                    handleFilterChange();
                                }}
                            />
                        </div>
                        <div className="relative w-full sm:w-[250px]">
                            <Label htmlFor="search" className="sr-only">
                                Search
                            </Label>
                            <Input
                                id="search"
                                placeholder="Search by tracking #, title..."
                                className="w-full pl-8"
                                value={searchData.search}
                                onChange={(e) =>
                                    setSearchData({ search: e.target.value })
                                }
                                onKeyDown={handleSearchKeyDown}
                            />
                            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Tracking #
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Title
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Type
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Files
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Created
                                </TableHead>
                                <TableHead className="text-right font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.data.length > 0 ? (
                                data.data.map((document) => (
                                    <TableRow
                                        key={document.id}
                                        className="text-sm hover:bg-muted/30"
                                    >
                                        <TableCell className="font-mono text-sm text-blue-600">
                                            {document.tracking_number}
                                        </TableCell>
                                        <TableCell className="text-sm font-medium">
                                            {document.title}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {document.document_type?.name ||
                                                '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex items-center gap-1">
                                                <FileText className="h-4 w-4 text-gray-500" />
                                                {document.files?.length || 0}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(
                                                document.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="flex items-center justify-end gap-2 text-sm">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleViewClick(document)
                                                }
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleEditClick(document)
                                                }
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDeleteClick(document)
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
                                        colSpan={6}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No documents found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination data={data} />

                {/* Dialogs */}
                {openCreateDialog && (
                    <CreateDocumentDialog
                        isOpen={openCreateDialog}
                        onClose={() => setOpenCreateDialog(false)}
                        documentTypes={documentTypes}
                    />
                )}
                {openEditDialog && selectedDocument && (
                    <EditDocumentDialog
                        isOpen={openEditDialog}
                        onClose={() => setOpenEditDialog(false)}
                        document={selectedDocument}
                        documentTypes={documentTypes}
                    />
                )}
                {openDeleteDialog && selectedDocument && (
                    <DeleteDocumentDialog
                        isOpen={openDeleteDialog}
                        onClose={() => setOpenDeleteDialog(false)}
                        document={selectedDocument}
                    />
                )}

                {/* Success Dialog - shown after document creation */}
                <Dialog
                    open={showSuccessDialog}
                    onOpenChange={setShowSuccessDialog}
                >
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                Document Created Successfully
                            </DialogTitle>
                            <DialogDescription>
                                Your document has been submitted. Please use the
                                tracking number below to reference your
                                document.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center py-4">
                            <p className="text-xs text-muted-foreground">
                                Tracking Number
                            </p>
                            <p className="mt-1 font-mono text-xl font-bold tracking-wider text-primary">
                                {createdTrackingNumber}
                            </p>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={() => {
                                    setShowSuccessDialog(false);
                                }}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

DocumentIndex.layout = {
    breadcrumbs: [
        {
            title: 'Documents',
            href: documents.index(),
        },
    ],
};

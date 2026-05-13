import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Document as DocumentType } from '@/types/document';
import type { DocumentFile } from '@/types/document-file';
import type { FlashProps } from '@/types/flash';
import { CustomComboBox } from '@/components/CustomComboBox';
import { useForm } from '@inertiajs/react';
import { Head, router } from '@inertiajs/react';
import {
    Download,
    FileText,
    PlusIcon,
    Upload,
    ArrowLeft,
    Clock,
    User,
    File,
    Eye,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import documents from '@/routes/documents';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import type { SubmitEventHandler, ChangeEventHandler } from 'react';
import { toast } from 'sonner';

interface ShowProps {
    document: DocumentType;
}

export default function DocumentShow({ document: doc }: ShowProps) {
    const {
        data: updateData,
        setData: setUpdateData,
        post: postUpdate,
        reset: resetUpdate,
        errors: updateErrors,
        processing: updateProcessing,
    } = useForm({
        description: '',
        files: [] as File[],
    });

    const [openUploadFileDialog, setOpenUploadFileDialog] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...newFiles]);
            setUpdateData('files', [...selectedFiles, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setUpdateData('files', newFiles);
    };

    const handleAddUpdate: SubmitEventHandler = (e) => {
        e.preventDefault();
        postUpdate(documents.updateDocument(doc).url, {
            onSuccess: (response) => {
                const flash = response.props as unknown as FlashProps;
                toast.success(
                    flash.flash?.message || 'Update added successfully.',
                );
                setOpenUploadFileDialog(false);
                resetUpdate();
                setSelectedFiles([]);
                // Refresh to show new update
                router.reload({ only: ['document'] });
            },
            onError: () => {
                toast.error('Failed to add update.');
            },
        });
    };

    const handleDownload = (fileId: number) => {
        window.open(documents.downloadFile({ id: fileId }).url, '_blank');
    };

    const handleView = (fileId: number) => {
        window.open(documents.viewFile({ id: fileId }).url, '_blank');
    };

    const handleDeleteFile = (fileId: number) => {
        if (confirm('Are you sure you want to delete this file?')) {
            router.delete(documents.deleteFile({ id: fileId }).url, {
                onSuccess: () => {
                    toast.success('File deleted successfully.');
                    router.reload();
                },
                onError: () => {
                    toast.error('Failed to delete file.');
                },
            });
        }
    };

    return (
        <>
            <Head title={`Document - ${doc.tracking_number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.get(documents.index())}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <Heading
                                title={doc.tracking_number}
                            />
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                {doc.status || 'Active'}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Created on {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="text-sm text-muted-foreground">
                    Last updated: {new Date(doc.updated_at).toLocaleString()}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Document Details */}
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Document Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-500">
                                        Title
                                    </Label>
                                    <p className="font-medium">{doc.title}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-500">
                                        Type
                                    </Label>
                                    <p className="font-medium">
                                        {doc.document_type?.name}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-gray-500">
                                        Tracking Number
                                    </Label>
                                    <p className="font-mono text-blue-600">
                                        {doc.tracking_number}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-gray-500">
                                        Created By
                                    </Label>
                                    <p className="font-medium">
                                        {doc.user?.name || 'Unknown'}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-gray-500">
                                        Description
                                    </Label>
                                    <p className="font-medium">
                                        {doc.description || 'No description'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Files */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">
                                Files ({doc.files?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {doc.files && doc.files.length > 0 ? (
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="font-bold text-primary">
                                                Filename
                                            </TableHead>
                                            <TableHead className="font-bold text-primary">
                                                Type
                                            </TableHead>
                                            <TableHead className="font-bold text-primary">
                                                Size
                                            </TableHead>
                                            <TableHead className="text-right font-bold text-primary">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {doc.files.map((file) => (
                                            <TableRow
                                                key={file.id}
                                                className="text-sm hover:bg-muted/30"
                                            >
                                                <TableCell className="text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-gray-500" />
                                                        {file.original_filename}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {file.file_type ||
                                                        'Unknown'}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {file.file_size
                                                        ? `${(file.file_size / 1024).toFixed(1)} KB`
                                                        : '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="View"
                                                            onClick={() =>
                                                                handleView(file.id)
                                                            }
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Download"
                                                            onClick={() =>
                                                                handleDownload(file.id)
                                                            }
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() =>
                                                                handleDeleteFile(file.id)
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="py-4 text-center text-gray-500">
                                    No files uploaded.
                                </p>
                            )}

                            {/* Upload another file button */}
                            <div className="mt-4 flex justify-end">
                                <Button
                                    size="sm"
                                    onClick={() => setOpenUploadFileDialog(true)}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Another File
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Quick Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm text-gray-500">
                                    Created
                                </Label>
                                <p className="text-sm">
                                    {new Date(doc.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-500">
                                    Last Updated
                                </Label>
                                <p className="text-sm">
                                    {new Date(doc.updated_at).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-500">
                                    Total Files
                                </Label>
                                <p className="text-sm">
                                    {doc.files?.length || 0}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-500">
                                    Total Updates
                                </Label>
                                <p className="text-sm">
                                    {doc.updates?.length || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add Update Dialog */}
            <Dialog
                open={openUploadFileDialog}
                onOpenChange={setOpenUploadFileDialog}
            >
                <DialogContent className="rounded-md sm:max-w-lg">
                    <form onSubmit={handleAddUpdate}>
                        <DialogHeader className="mb-4">
                            <DialogTitle>Add Document Update</DialogTitle>
                            <DialogDescription className="text-xs">
                                Add a new update with description and optional
                                new files.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="update_description">
                                    Description *
                                </Label>
                                <Textarea
                                    id="update_description"
                                    placeholder="Describe what changed..."
                                    value={updateData.description}
                                    onChange={(e) =>
                                        setUpdateData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    rows={4}
                                />
                                {updateErrors.description && (
                                    <span className="text-xs text-orange-600">
                                        {updateErrors.description as string}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>New Files (Optional)</Label>
                                <div className="rounded-md border-2 border-dashed border-gray-300 p-4 text-center">
                                    <label
                                        htmlFor="update-file-upload"
                                        className="cursor-pointer"
                                    >
                                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                        <span className="mt-2 block text-sm text-gray-600">
                                            Click to upload new files
                                        </span>
                                    </label>
                                    <input
                                        id="update-file-upload"
                                        type="file"
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                {selectedFiles.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {selectedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded bg-gray-50 px-2 py-1 text-sm"
                                            >
                                                <span className="truncate">
                                                    {file.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFile(index)
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={selectedFiles.length === 0}>
                                Upload
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            </div>
        </>
    );
}

DocumentShow.layout = {
    breadcrumbs: [
        {
            title: 'Documents',
            href: documents.index(),
        },
    ],
};

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

    const [openAddUpdateDialog, setOpenAddUpdateDialog] = useState(false);
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
                setOpenAddUpdateDialog(false);
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

    return (
        <>
            <Head title={`Document - ${doc.tracking_number}`} />

            <div className="mb-6 flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.get(documents.index())}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <Heading
                        title={doc.tracking_number}
                        description={`Created on ${new Date(doc.created_at).toLocaleDateString()}`}
                    />
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
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDownload(
                                                                file.id,
                                                            )
                                                        }
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
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
                        </CardContent>
                    </Card>

                    {/* Updates History */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">
                                Update History ({doc.updates?.length || 0})
                            </CardTitle>
                            <Button
                                size="sm"
                                onClick={() => setOpenAddUpdateDialog(true)}
                            >
                                <PlusIcon className="h-4 w-4" />
                                Add Update
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {doc.updates && doc.updates.length > 0 ? (
                                <div className="space-y-4">
                                    {doc.updates.map((update) => (
                                        <div
                                            key={update.id}
                                            className="rounded-lg border bg-gray-50 p-4"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Clock className="h-4 w-4" />
                                                    {new Date(
                                                        update.created_at,
                                                    ).toLocaleString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <User className="h-4 w-4" />
                                                    {update.user?.name ||
                                                        'Unknown'}
                                                </div>
                                            </div>
                                            <p className="mb-3 text-sm">
                                                {update.description}
                                            </p>
                                            {update.files &&
                                                update.files.length > 0 && (
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-gray-500">
                                                            Attached Files:
                                                        </Label>
                                                        {update.files.map(
                                                            (
                                                                file: DocumentFile,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        file.id
                                                                    }
                                                                    className="flex items-center justify-between rounded bg-white p-2 text-sm"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <File className="h-4 w-4 text-gray-500" />
                                                                        {
                                                                            file.original_filename
                                                                        }
                                                                    </div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            handleDownload(
                                                                                file.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Download className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-gray-500">
                                    No updates yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
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
                open={openAddUpdateDialog}
                onOpenChange={setOpenAddUpdateDialog}
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
                            <Button type="submit" disabled={updateProcessing}>
                                Add Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
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

import { useForm } from '@inertiajs/react';
import { Head, router } from '@inertiajs/react';

import {
    Download,
    FileText,
    Upload,
    ArrowLeft,
    Eye,
    Trash2,
    Calendar,
    User,
    Clock,
    FileStack,
    Tag,
} from 'lucide-react';
import { useState } from 'react';
import type { SubmitEventHandler, ChangeEventHandler } from 'react';
import { toast } from 'sonner';

import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import documents from '@/routes/documents';

interface ShowProps {
    document: Document;
}

export default function DocumentShow({ document: doc }: ShowProps) {
    const {
        data: updateData,
        setData: setUpdateData,
        post: postUpdate,
        reset: resetUpdate,
        errors: updateErrors,
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
            setUpdateData('files', (prev) => [...(prev || []), ...newFiles]);
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
        window.open(`/documents/files/${fileId}/view`, '_blank');
    };

    const handleDeleteFile = (fileId: number) => {
        router.delete(`/documents/files/${fileId}/delete`, {
            onSuccess: () => {
                toast.success('File deleted successfully.');
                router.reload();
            },
            onError: () => {
                toast.error('Failed to delete file.');
            },
        });
    };

    // Format date
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get status badge color
    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            pending:
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            in_progress:
                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            completed:
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            rejected:
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };

        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <>
            <Head title={`Document - ${doc.tracking_number}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => router.get(documents.index())}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {doc.title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Tracking No: {doc.tracking_number}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            className={`px-3 py-1 ${getStatusBadge(doc.status)}`}
                        >
                            {doc.status?.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Button
                            size="sm"
                            onClick={() => setOpenUploadFileDialog(true)}
                            className="gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Add Update
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {/* Left Column - Document Details */}
                    <div className="space-y-6 lg:col-span-3">
                        {/* Description Card */}
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Document Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
                                    {doc.description ||
                                        'No description provided.'}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Files Card */}
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileStack className="h-5 w-5 text-primary" />
                                        Attached Files
                                    </CardTitle>
                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                        {doc.files?.length || 0} files
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {doc.files && doc.files.length > 0 ? (
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {doc.files.map((file) => (
                                            <div
                                                key={file.id}
                                                className="group relative flex items-start gap-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 hover:bg-accent/50"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">
                                                        {file.original_filename}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {file.file_size
                                                            ? `${(file.file_size / 1024).toFixed(1)} KB`
                                                            : 'Unknown size'}{' '}
                                                        •{' '}
                                                        {file.file_type ||
                                                            'Unknown type'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
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
                                                        className="h-8 w-8"
                                                        title="Download"
                                                        onClick={() =>
                                                            handleDownload(
                                                                file.id,
                                                            )
                                                        }
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <DeleteConfirmationDialog
                                                        title="Delete File"
                                                        description={`Delete "${file.original_filename}"?`}
                                                        onConfirm={() =>
                                                            handleDeleteFile(
                                                                file.id,
                                                            )
                                                        }
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500 hover:text-red-600"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </DeleteConfirmationDialog>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <FileStack className="h-12 w-12 text-muted-foreground/50" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            No files uploaded yet
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Document Updates */}
                        {doc.updates && doc.updates.length > 0 && (
                            <Card className="overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Clock className="h-5 w-5 text-primary" />
                                        Document Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="relative space-y-6 before:absolute before:top-2 before:left-4 before:h-full before:w-0.5 before:bg-border before:content-['']">
                                        {doc.updates.map((update, index) => (
                                            <div
                                                key={update.id || index}
                                                className="relative flex gap-4"
                                            >
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-background bg-primary/10">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="flex-1 pb-6">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium">
                                                            Update #{index + 1}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(
                                                                update.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-foreground/80">
                                                        {update.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Sidebar Info */}
                    <div className="space-y-6">
                        {/* Document Info Card */}
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
                                <CardTitle className="text-base">
                                    Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                                        <Tag className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Type
                                        </p>
                                        <p className="text-sm font-medium">
                                            {doc.document_type?.name || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Created By
                                        </p>
                                        <p className="text-sm font-medium">
                                            {doc.user?.name || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                                        <Calendar className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Created
                                        </p>
                                        <p className="text-sm font-medium">
                                            {formatDate(doc.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                                        <Clock className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Last Updated
                                        </p>
                                        <p className="text-sm font-medium">
                                            {formatDate(doc.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Add Update Dialog */}
            <Dialog
                open={openUploadFileDialog}
                onOpenChange={setOpenUploadFileDialog}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Document Update</DialogTitle>
                        <DialogDescription>
                            Add a new update to this document with optional
                            files.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddUpdate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Update Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the update..."
                                    value={updateData.description}
                                    onChange={(e) =>
                                        setUpdateData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    className="min-h-[100px]"
                                    rows={4}
                                />
                                {updateErrors.description && (
                                    <span className="text-xs text-orange-600">
                                        {updateErrors.description as string}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Attach Files (Optional)</Label>
                                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/50">
                                    <label className="cursor-pointer">
                                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Click to upload files
                                        </p>
                                        <input
                                            type="file"
                                            multiple
                                            className="hidden"
                                            id="update-file-upload"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                                {selectedFiles.length > 0 && (
                                    <div className="space-y-2">
                                        {selectedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm"
                                            >
                                                <span className="truncate">
                                                    {file.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFile(index)
                                                    }
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">Submit Update</Button>
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

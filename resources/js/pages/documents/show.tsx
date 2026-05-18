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
import type { Document } from '@/types/document';
import type { FlashProps } from '@/types/flash';

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
    } = useForm<{ description: string; files: File[] }>({
        description: '',
        files: [],
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

    return (
        <>
            <Head title={`Document - ${doc.tracking_number}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-background via-background to-primary/5 p-6 shadow-sm ring-1 ring-border/50">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 shrink-0 rounded-lg bg-muted/50 hover:bg-muted"
                                onClick={() => router.get(documents.index())}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="space-y-1">
                                <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                    {doc.title}
                                </h1>
                                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-mono text-xs">
                                        {doc.tracking_number}
                                    </span>
                                    <span className="text-border">•</span>
                                    <span>
                                        Created{' '}
                                        {new Date(
                                            doc.created_at,
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                size="sm"
                                onClick={() => setOpenUploadFileDialog(true)}
                                className="gap-2 shadow-sm"
                            >
                                <Upload className="h-4 w-4" />
                                Add Update
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column - Document Details */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Description Card */}
                        <Card className="overflow-hidden shadow-sm ring-1 ring-border/50">
                            <CardHeader className="border-b bg-muted/30 pb-4">
                                <CardTitle className="flex items-center gap-2.5 text-base font-medium">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    Document Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5">
                                <p className="text-sm leading-7 whitespace-pre-wrap text-muted-foreground">
                                    {doc.description ||
                                        'No description provided.'}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Files Card */}
                        <Card className="overflow-hidden shadow-sm ring-1 ring-border/50">
                            <CardHeader className="border-b bg-muted/30 pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2.5 text-base font-medium">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                            <FileStack className="h-4 w-4 text-primary" />
                                        </div>
                                        Attached Files
                                    </CardTitle>
                                    <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                        {doc.files?.length || 0} files
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5">
                                {doc.files && doc.files.length > 0 ? (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {doc.files.map((file) => (
                                            <div
                                                key={file.id}
                                                className="group relative flex items-start gap-3 rounded-lg border border-border/60 p-3.5 transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
                                            >
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 shadow-inner">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="min-w-0 flex-1 space-y-1 pr-20">
                                                    <p className="truncate text-sm leading-tight font-medium">
                                                        {file.original_filename}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <span>
                                                            {file.file_size
                                                                ? `${(
                                                                      file.file_size /
                                                                      1024
                                                                  ).toFixed(
                                                                      1,
                                                                  )} KB`
                                                                : 'Unknown'}
                                                        </span>
                                                        <span className="text-border">
                                                            •
                                                        </span>
                                                        <span className="uppercase">
                                                            {file.file_type?.split(
                                                                '/',
                                                            )[1] ||
                                                                file.file_type ||
                                                                'File'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 hover:bg-muted"
                                                        title="View"
                                                        onClick={() =>
                                                            handleView(file.id)
                                                        }
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 hover:bg-muted"
                                                        title="Download"
                                                        onClick={() =>
                                                            handleDownload(
                                                                file.id,
                                                            )
                                                        }
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <DeleteConfirmationDialog
                                                        title="Delete File"
                                                        description={`Delete "${file.original_filename}"? This action cannot be undone.`}
                                                        onConfirm={() =>
                                                            handleDeleteFile(
                                                                file.id,
                                                            )
                                                        }
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-red-500/80 hover:bg-red-500/10 hover:text-red-600"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </DeleteConfirmationDialog>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                            <FileStack className="h-7 w-7 text-muted-foreground/50" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            No files uploaded yet
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground/70">
                                            Attach files to this document
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Document Updates */}
                        {doc.updates && doc.updates.length > 0 && (
                            <Card className="overflow-hidden shadow-sm ring-1 ring-border/50">
                                <CardHeader className="border-b bg-muted/30 pb-4">
                                    <CardTitle className="flex items-center gap-2.5 text-base font-medium">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                            <Clock className="h-4 w-4 text-primary" />
                                        </div>
                                        Document Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-5">
                                    <div className="relative space-y-6 pl-2 before:absolute before:top-3 before:left-[15px] before:h-[calc(100%-24px)] before:w-0.5 before:bg-gradient-to-b before:from-primary/30 before:to-transparent before:content-['']">
                                        {doc.updates.map((update, index) => (
                                            <div
                                                key={update.id || index}
                                                className="relative flex gap-4"
                                            >
                                                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm ring-1 ring-primary/20">
                                                    <span className="text-xs font-semibold text-primary">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <div className="flex-1 pb-4">
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
                                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
                    <div className="space-y-6 lg:col-span-4">
                        {/* Document Info Card */}
                        <Card className="overflow-hidden shadow-sm ring-1 ring-border/50">
                            <CardHeader className="border-b bg-muted/30 pb-4">
                                <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                                    Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5 pt-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Document Type
                                        </p>
                                        <p className="text-sm font-medium">
                                            {doc.document_type?.name || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-px bg-border/60" />
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Created By
                                        </p>
                                        <p className="text-sm font-medium">
                                            {doc.user?.name || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-px bg-border/60" />
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Created Date
                                        </p>
                                        <p className="text-sm font-medium">
                                            {new Date(
                                                doc.created_at,
                                            ).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-px bg-border/60" />
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Last Updated
                                        </p>
                                        <p className="text-sm font-medium">
                                            {new Date(
                                                doc.updated_at,
                                            ).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions Card */}
                        <Card className="overflow-hidden shadow-sm ring-1 ring-border/50">
                            <CardHeader className="border-b bg-muted/30 pb-4">
                                <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 pt-5">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                    onClick={() =>
                                        router.get(documents.index())
                                    }
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Documents
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                    onClick={() =>
                                        setOpenUploadFileDialog(true)
                                    }
                                >
                                    <Upload className="h-4 w-4" />
                                    Add New Update
                                </Button>
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
                <DialogContent className="w-full max-w-[calc(100vw-2rem)] overflow-hidden sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Document Update</DialogTitle>
                        <DialogDescription>
                            Add a new update to this document with optional
                            files.
                        </DialogDescription>
                    </DialogHeader>
                    {/* Idinagdag ang w-full at min-w-0 dito para pigilan ang grid/flex layout breakage */}
                    <form
                        onSubmit={handleAddUpdate}
                        className="w-full min-w-0 overflow-hidden"
                    >
                        <div className="w-full min-w-0 space-y-4 py-4">
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

                            <div className="w-full min-w-0 space-y-2">
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

                                {/* ANG BINAGO AT SINIGURADONG CONTAINER NG ATTACHMENTS */}
                                {selectedFiles.length > 0 && (
                                    <div className="mt-2 w-full min-w-0 space-y-2 overflow-hidden">
                                        {selectedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="table-layout-fixed flex w-full min-w-0 items-center justify-between gap-3 rounded-md bg-muted px-3 py-2 text-sm"
                                            >
                                                {/* piliting putulin ang text gamit ang truncate at break-all combinations */}
                                                <div className="min-w-0 flex-1 overflow-hidden">
                                                    <p
                                                        className="block truncate text-sm font-medium break-all text-foreground"
                                                        title={file.name}
                                                    >
                                                        {file.name}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFile(index)
                                                    }
                                                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm text-lg font-semibold text-muted-foreground transition-colors hover:bg-background/50 hover:text-destructive"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
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

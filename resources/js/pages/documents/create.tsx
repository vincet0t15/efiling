import { useForm } from '@inertiajs/react';
import { Head, router } from '@inertiajs/react';
import { FileUp, X, Upload, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

import { CustomComboBox } from '@/components/CustomComboBox';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import documents from '@/routes/documents';
import type { DocumentType } from '@/types/document-type';
import type { FlashProps } from '@/types/flash';
interface PageProps {
    documentTypes: DocumentType[];
    flash?: {
        tracking_number?: string;
    };
}

export default function CreatePage({ documentTypes }: PageProps) {
    const { data, setData, post, reset, errors, processing } = useForm<{
        title: string;
        description: string;
        document_type_id: string;
        files: File[];
    }>({
        title: '',
        description: '',
        document_type_id: '',
        files: [],
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [createdTrackingNumber, setCreatedTrackingNumber] = useState('');

    const documentTypeOptions = documentTypes.map((dt) => ({
        value: dt.id.toString(),
        label: dt.name,
    }));

    const onChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData(e.target.name as 'title' | 'description', e.target.value);
    };

    const onChangeTextarea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setData('description', e.target.value);
    };

    const onDocumentTypeChange = (val: string | null) => {
        setData('document_type_id', val || '');
    };

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...newFiles]);
            setData('files', [...selectedFiles, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setData('files', newFiles);
    };

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(documents.store().url, {
            onSuccess: (response) => {
                const flash = response.props as unknown as FlashProps;
                const trackingNumber = flash.flash?.tracking_number;

                if (trackingNumber) {
                    setCreatedTrackingNumber(trackingNumber);
                    setShowSuccessDialog(true);
                } else {
                    toast.success(
                        flash.flash?.message ||
                            'Document created successfully.',
                    );
                    router.get(documents.index());
                }

                reset();
                setSelectedFiles([]);
            },
            onError: () => {
                toast.error('Failed to create document.');
            },
        });
    };

    return (
        <>
            <Head title="Upload Document" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header with back button */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.get(documents.index())}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Heading
                        title="Upload Document"
                        description="Submit a new document for processing."
                    />
                </div>

                {/* Form */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter document title"
                                value={data.title}
                                onChange={onChangeInput}
                                className={errors.title ? 'border-red-500' : ''}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Enter document description (optional)"
                                value={data.description}
                                onChange={onChangeTextarea}
                                rows={4}
                                className={
                                    errors.description ? 'border-red-500' : ''
                                }
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Document Type */}
                        <div className="space-y-2">
                            <Label>Document Type *</Label>
                            <CustomComboBox
                                items={documentTypeOptions}
                                placeholder="Select document type"
                                value={data.document_type_id}
                                onSelect={onDocumentTypeChange}
                            />
                            {errors.document_type_id && (
                                <p className="text-sm text-red-500">
                                    {errors.document_type_id}
                                </p>
                            )}
                        </div>

                        {/* File Upload */}
                        <div className="space-y-2">
                            <Label>Files *</Label>
                            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/50">
                                <label className="cursor-pointer">
                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Click to upload files
                                    </p>
                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                </label>
                            </div>

                            {/* Selected Files */}
                            {selectedFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between rounded-md bg-muted px-3 py-2"
                                        >
                                            <span className="truncate text-sm">
                                                {file.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFile(index)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.files && (
                                <p className="text-sm text-orange-600">
                                    {errors.files as string}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.get(documents.index())}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Uploading...'
                                    : 'Upload Document'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Dialog */}
            <Dialog
                open={showSuccessDialog}
                onOpenChange={setShowSuccessDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Document Created Successfully</DialogTitle>
                        <DialogDescription>
                            Your document has been submitted. Please use the
                            tracking number below to reference your document.
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
                                router.get(documents.index());
                            }}
                        >
                            View Documents
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Dialog component for use in index.tsx
export function CreateDocumentDialog({
    isOpen,
    onClose,
    documentTypes,
}: {
    isOpen: boolean;
    onClose: () => void;
    documentTypes: DocumentType[];
}) {
    const { data, setData, post, reset, errors, processing } = useForm({
        title: '',
        description: '',
        document_type_id: '',
        files: [] as File[],
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const documentTypeOptions = documentTypes.map((dt) => ({
        value: dt.id.toString(),
        label: dt.name,
    }));

    const onChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData(e.target.name as 'title' | 'description', e.target.value);
    };

    const onChangeTextarea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setData('description', e.target.value);
    };

    const onDocumentTypeChange = (val: string | null) => {
        setData('document_type_id', val || '');
    };

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...newFiles]);
            setData('files', [...selectedFiles, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setData('files', newFiles);
    };

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(documents.store().url, {
            onSuccess: (response) => {
                const flash = response.props as unknown as FlashProps;
                toast.success(
                    flash.flash?.message || 'Document created successfully.',
                );
                reset();
                setSelectedFiles([]);
                onClose();
            },
            onError: () => {
                toast.error('Failed to create document.');
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>
                        Submit a new document for processing.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="dialog-title">Title *</Label>
                        <Input
                            id="dialog-title"
                            name="title"
                            placeholder="Enter document title"
                            value={data.title}
                            onChange={onChangeInput}
                            className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dialog-description">Description</Label>
                        <Textarea
                            id="dialog-description"
                            name="description"
                            placeholder="Enter document description"
                            value={data.description}
                            onChange={onChangeTextarea}
                            className={
                                errors.description ? 'border-red-500' : ''
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Document Type *</Label>
                        <CustomComboBox
                            items={documentTypeOptions}
                            placeholder="Select document type"
                            value={data.document_type_id}
                            onSelect={onDocumentTypeChange}
                        />
                        {errors.document_type_id && (
                            <p className="text-sm text-red-500">
                                {errors.document_type_id}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Files *</Label>
                        <div className="rounded-md border border-dashed p-4">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Input
                                    type="file"
                                    multiple
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="dialog-file-upload"
                                />
                                <Label
                                    htmlFor="dialog-file-upload"
                                    className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                >
                                    <FileUp className="mr-2 inline h-4 w-4" />
                                    Choose Files
                                </Label>
                            </div>
                        </div>
                        {selectedFiles.length > 0 && (
                            <div className="space-y-1">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded bg-muted px-2 py-1 text-sm"
                                    >
                                        <span className="truncate">
                                            {file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.files && (
                            <p className="text-sm text-orange-600">
                                {errors.files as string}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Uploading...' : 'Upload'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

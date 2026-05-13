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
import { CustomComboBox } from '@/components/CustomComboBox';
import type { FlashProps } from '@/types/flash';
import type { DocumentType } from '@/types/document-type';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import type { ChangeEventHandler, SubmitEventHandler } from 'react';
import documents from '@/routes/documents';
import { FileUp, X } from 'lucide-react';
import { useState } from 'react';

interface CreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    documentTypes: DocumentType[];
}

export function CreateDocumentDialog({
    isOpen,
    onClose,
    documentTypes,
}: CreateDialogProps) {
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

    const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
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

    const onSubmit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(documents.store().url, {
            onSuccess: (response) => {
                const flash = response.props as unknown as FlashProps;
                toast.success(
                    flash.flash?.message || 'Document created successfully.',
                );
                onClose();
                reset();
                setSelectedFiles([]);
            },
            onError: (errors) => {
                const errorMessages = Object.values(errors).flat();
                if (errorMessages.length > 0) {
                    toast.error(errorMessages[0] as string);
                } else {
                    toast.error('Failed to create document.');
                }
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-md sm:max-w-lg">
                <form onSubmit={onSubmit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Upload Document</DialogTitle>
                        <DialogDescription className="text-xs">
                            Upload a scanned document with tracking number
                            generation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter document title"
                                value={data.title}
                                onChange={onChangeInput}
                            />
                            {errors.title && (
                                <span className="text-xs text-orange-600">
                                    {errors.title as string}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="document_type_id">
                                Document Type *
                            </Label>
                            <CustomComboBox
                                items={documentTypeOptions}
                                placeholder="Select document type"
                                value={data.document_type_id || null}
                                onSelect={(val) =>
                                    setData('document_type_id', val || '')
                                }
                            />
                            {errors.document_type_id && (
                                <span className="text-xs text-orange-600">
                                    {errors.document_type_id as string}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Optional description..."
                                value={data.description || ''}
                                onChange={onChangeTextarea}
                                rows={3}
                            />
                            {errors.description && (
                                <span className="text-xs text-orange-600">
                                    {errors.description as string}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Files *</Label>
                            <div className="rounded-md border-2 border-dashed border-gray-300 p-4 text-center">
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer"
                                >
                                    <FileUp className="mx-auto h-8 w-8 text-gray-400" />
                                    <span className="mt-2 block text-sm text-gray-600">
                                        Click to upload files (PDF, JPG, PNG,
                                        DOC, DOCX)
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Max 10MB each
                                    </span>
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    className="hidden"
                                    onChange={onFileChange}
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
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.files && (
                                <span className="text-xs text-orange-600">
                                    {errors.files as string}
                                </span>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Upload Document
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

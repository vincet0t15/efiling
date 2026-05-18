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
import type { Document } from '@/types/document';
import type { DocumentType } from '@/types/document-type';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import type { ChangeEventHandler, SubmitEventHandler } from 'react';
import documents from '@/routes/documents';

interface EditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    document: Document;
    documentTypes: DocumentType[];
}

export function EditDocumentDialog({
    isOpen,
    onClose,
    document,
    documentTypes,
}: EditDialogProps) {
    const { data, setData, put, errors, processing } = useForm({
        title: document.title,
        description: document.description || '',
        document_type_id: document.document_type_id.toString(),
    });

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

    const onSubmit: SubmitEventHandler = (e) => {
        e.preventDefault();
        put(documents.update(document).url, {
            onSuccess: (response) => {
                const flash = response.props as unknown as FlashProps;
                toast.success(
                    flash.flash?.message || 'Document updated successfully.',
                );
                onClose();
            },
            onError: () => {
                toast.error('Failed to update document.');
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-md sm:max-w-sm">
                <form onSubmit={onSubmit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Edit Document</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the document details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tracking_number">
                                Tracking Number
                            </Label>
                            <Input
                                id="tracking_number"
                                value={document.tracking_number}
                                disabled
                                className="bg-gray-100"
                            />
                            <span className="text-xs text-gray-500">
                                Tracking number cannot be changed.
                            </span>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={document.title}
                                onChange={onChangeInput}
                                maxLength={255}
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
                                value={data.document_type_id}
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
                                defaultValue={document.description || ''}
                                onChange={onChangeTextarea}
                                rows={3}
                            />
                            {errors.description && (
                                <span className="text-xs text-orange-600">
                                    {errors.description as string}
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
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

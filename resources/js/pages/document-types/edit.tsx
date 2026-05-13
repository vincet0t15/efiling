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
import type { FlashProps } from '@/types/flash';
import type { DocumentType } from '@/types/document-type';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import type { ChangeEventHandler, SubmitEventHandler } from 'react';
import documentTypes from '@/routes/document-types';

interface EditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    documentType: DocumentType;
}

export function EditDocumentTypeDialog({
    isOpen,
    onClose,
    documentType,
}: EditDialogProps) {
    const { data, setData, put, errors, processing } = useForm({
        name: documentType.name,
        description: documentType.description || '',
    });

    const onChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData(e.target.name as 'name' | 'description', e.target.value);
    };

    const onChangeTextarea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setData(e.target.name as 'name' | 'description', e.target.value);
    };

    const onSubmit: SubmitEventHandler = (e) => {
        e.preventDefault();
        put(documentTypes.update(documentType.id).url, {
            onSuccess: (response) => {
                const flash = response.props as unknown as FlashProps;
                toast.success(flash.flash?.message || 'Updated successfully.');
                onClose();
            },
            onError: () => {
                toast.error('Failed to update.');
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-md sm:max-w-sm">
                <form onSubmit={onSubmit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Edit Document Type</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the document type details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={documentType.name}
                                onChange={onChangeInput}
                            />
                            {errors.name && (
                                <span className="text-xs text-orange-600">
                                    {errors.name}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={documentType.description || ''}
                                onChange={onChangeTextarea}
                                rows={3}
                            />
                            {errors.description && (
                                <span className="text-xs text-orange-600">
                                    {errors.description}
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

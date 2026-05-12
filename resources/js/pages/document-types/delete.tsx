import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { FlashProps } from '@/types/flash';
import type { DocumentType } from '@/types/document-type';
import { useForm } from '@inertiajs/react';
import { SubmitEventHandler } from 'react';
import { toast } from 'sonner';
import { documentTypes } from '@/routes/document-types';

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    documentType: DocumentType;
}

export function DeleteDocumentTypeDialog({ isOpen, onClose, documentType }: DeleteDialogProps) {
    const { delete: destroy, processing } = useForm();

    const onSubmit: SubmitEventHandler = (e) => {
        e.preventDefault();
        destroy(documentTypes.destroy(documentType), {
            onSuccess: (response) => {
                const flash = response.props as unknown as FlashProps;
                if (flash.flash?.type === 'error') {
                    toast.error(flash.flash.message || 'Failed to delete.');
                } else {
                    toast.success(flash.flash?.message || 'Deleted successfully.');
                }
                onClose();
            },
            onError: () => {
                toast.error('Failed to delete.');
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm rounded-md">
                <form onSubmit={onSubmit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Delete Document Type</DialogTitle>
                        <DialogDescription className="text-xs">
                            Are you sure you want to delete "{documentType.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" variant="destructive" disabled={processing}>Delete</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
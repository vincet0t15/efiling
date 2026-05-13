import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { FlashProps } from '@/types/flash';
import type { Document } from '@/types/document';
import { useForm } from '@inertiajs/react';
import { SubmitEventHandler } from 'react';
import { toast } from 'sonner';
import documents from '@/routes/documents';

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    document: Document;
}

export function DeleteDocumentDialog({ isOpen, onClose, document }: DeleteDialogProps) {
    const { delete: destroy, processing } = useForm();

    const onSubmit: SubmitEventHandler = (e) => {
        e.preventDefault();
        destroy(documents.destroy(document), {
            onSuccess: (response) => {
                const flash = response.props as unknown as FlashProps;
                if (flash.flash?.type === 'error') {
                    toast.error(flash.flash.message || 'Failed to delete.');
                } else {
                    toast.success(flash.flash?.message || 'Document deleted successfully.');
                }
                onClose();
            },
            onError: () => {
                toast.error('Failed to delete document.');
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm rounded-md">
                <form onSubmit={onSubmit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Delete Document</DialogTitle>
                        <DialogDescription className="text-xs">
                            Are you sure you want to delete "{document.title}" (Tracking: {document.tracking_number})?
                            This action cannot be undone. All associated files will also be deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="destructive" disabled={processing}>
                            Delete
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
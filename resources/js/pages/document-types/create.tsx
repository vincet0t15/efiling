import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { FlashProps } from '@/types/flash';
import type { DocumentTypeCreateRequest } from '@/types/document-type';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import type { ChangeEventHandler, SubmitEventHandler } from 'react';
import { documentTypes } from '@/routes/document-types';

interface CreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateDocumentTypeDialog({ isOpen, onClose }: CreateDialogProps) {
    const { data, setData, post, reset, errors, processing } = useForm<DocumentTypeCreateRequest>({
        name: '',
        description: '',
    });

    const onChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData(e.target.name as keyof DocumentTypeCreateRequest, e.target.value);
    };

    const onChangeTextarea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setData(e.target.name as keyof DocumentTypeCreateRequest, e.target.value);
    };

    const onSubmit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(documentTypes.store(), {
            onSuccess: (response) => {
                const flash = response.props as unknown as FlashProps;
                toast.success(flash.flash?.message || 'Created successfully.');
                onClose();
                reset();
            },
            onError: () => {
                toast.error('Failed to create.');
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm rounded-md">
                <form onSubmit={onSubmit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Create Document Type</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a new document type category.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., Invoice, Contract, ID"
                                value={data.name}
                                onChange={onChangeInput}
                            />
                            {errors.name && <span className="text-xs text-orange-600">{errors.name}</span>}
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
                            {errors.description && <span className="text-xs text-orange-600">{errors.description}</span>}
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
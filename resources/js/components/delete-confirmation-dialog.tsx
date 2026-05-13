import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationDialogProps {
    trigger?: ReactNode;
    title?: string;
    description?: string;
    onConfirm: () => void;
    loading?: boolean;
}

export function DeleteConfirmationDialog({
    trigger,
    title = 'Delete Confirmation',
    description = 'Are you sure you want to delete this item? This action cannot be undone.',
    onConfirm,
    loading = false,
}: DeleteConfirmationDialogProps) {
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
        onConfirm();
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {trigger || (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-red-500 text-white hover:bg-red-600"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

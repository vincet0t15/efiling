import { Button } from "@/components/ui/button"
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ChangeEventHandler, SubmitEventHandler } from "react";

import InputError from "@/components/input-error";
import { LoaderCircle } from "lucide-react";
import { OfficeType } from "@/types/office";
import offices from "@/routes/offices";
import { toast } from "sonner";
import { DocumentTypeProps, DocumentTypes } from "@/types/documentType";
import documentTypes from "@/routes/document-types";


interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    documentType: DocumentTypeProps;
}
export function DocumentTypeEditDialog({ open, setOpen, documentType }: Props) {
    const { data, setData, put, reset, processing, errors } = useForm<DocumentTypes>({
        name: documentType.name,
        code: documentType.code,
    })

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        put(documentTypes.update(documentType.id).url, {
            preserveState: true,
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                setOpen(false);
                reset();
            },
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>


            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Document Type</DialogTitle>
                    <DialogDescription>
                        Please fill in the document type details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-4 mb-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Document Type Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Purchase Request" onChange={handleChange} value={data.name} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="code">Document Type Code</Label>
                            <Input id="code" name="code" placeholder="e.g. PR" className="uppercase" onChange={handleChange} value={data.code} />
                            <InputError message={errors.code} />
                        </div>


                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800 hover:text-white" type="submit" disabled={processing} variant={'outline'}  >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Update Document Type
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog >
    )
}

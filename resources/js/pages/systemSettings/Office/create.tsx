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


interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export function OfficeCreateDialog({ open, setOpen }: Props) {
    const { data, setData, post, reset, processing, errors } = useForm<OfficeType>({
        name: '',
        code: '',
    })

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    // const submit: SubmitEventHandler = (e) => {
    //     e.preventDefault();
    //     post(event.store().url, {
    //         preserveState: true,
    //         onSuccess: (response: { props: FlashProps }) => {
    //             toast.success(response.props.flash?.success);
    //             setOpen(false);
    //             reset();
    //         },
    //     })
    // }
    return (
        <Dialog open={open} onOpenChange={setOpen}>


            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Office</DialogTitle>
                    <DialogDescription>
                        Please fill in the office details below.
                    </DialogDescription>
                </DialogHeader>
                <form >
                    <div className="grid gap-4 mb-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Office Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Office of the Municipal Mayor" onChange={handleChange} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="code">Office Code</Label>
                            <Input id="code" name="code" placeholder="e.g. MO" className="uppercase" onChange={handleChange} />
                            <InputError message={errors.code} />
                        </div>


                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800 hover:text-white" type="submit" disabled={processing} variant={'outline'}  >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create Event
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog >
    )
}

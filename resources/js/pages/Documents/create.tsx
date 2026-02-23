import { ChangeEventHandler, SubmitEventHandler, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { File, FileText, Paperclip, Trash2 } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { DocumentCreateProps } from '@/types/document';
import { ComboboxBasic } from '@/components/test';
import { DocumentTypeProps } from '@/types/documentType';
import documents from '@/routes/documents';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

interface Props {
    documentTypes: DocumentTypeProps[]
}
export default function Dashboard({ documentTypes }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors } = useForm<DocumentCreateProps>({
        title: '',
        name: '',
        description: '',
        document_type_id: '',
        document_files: [],
    });

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const pdfFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
            if (files[i].type === 'application/pdf') {
                pdfFiles.push(files[i]);
            } else {
                alert(`File "${files[i].name}" is not a PDF and will be skipped.`);
            }
        }

        if (pdfFiles.length > 0) {
            setData('document_files', [...data.document_files, ...pdfFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = [...data.document_files];
        newFiles.splice(index, 1);
        setData('document_files', newFiles);
    };

    const documentTypeOptions = documentTypes.map((documentType) => ({
        label: documentType.name,
        value: String(documentType.id)
    }));

    const onChangeDocumentType = (value: string | null) => {
        setData('document_type_id', value ?? '');
    };

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(documents.store().url, {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
            }
        });
    }

    const handleChangeInput: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setData((prev: DocumentCreateProps) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Document" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 justify-center items-center">
                <div className="w-2xl flex flex-col gap-4">
                    <form onSubmit={submit}>

                        <div className='flex gap-2'>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title">Document Title</Label>
                                <Input id="title" name="title" placeholder="e.g. Application for License" onChange={handleChangeInput} value={data.title} />
                                <InputError message={errors.title} />
                            </div>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="name">Document Type</Label>
                                <ComboboxBasic items={documentTypeOptions} value={
                                    documentTypeOptions.find(
                                        (item) => item.value === data.document_type_id
                                    )?.label ?? ''
                                } onChange={onChangeDocumentType} />
                                <InputError message={errors.document_type_id} />
                            </div>
                        </div>
                        <div className="grid gap-3 mt-4">
                            <Label htmlFor="description">Document Description</Label>
                            <Textarea id="description" name="description" placeholder="e.g. Application for License" onChange={handleChangeInput} value={data.description} />
                            <InputError message={errors.description} />
                        </div>

                        <div className='mt-4'>
                            <Button variant="outline" size="sm" type="button" onClick={handleButtonClick}>
                                <Paperclip /> Add Files
                            </Button>
                            <Input
                                hidden
                                id="picture"
                                type="file"
                                ref={fileInputRef}
                                accept="application/pdf"
                                onChange={handleFileChange}
                                multiple
                            />
                        </div>

                        {/* List of selected files */}
                        {data.document_files.length > 0 && (
                            <div className="mt-4 flex flex-col gap-2">
                                <Label>Selected Files:</Label>
                                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                                    {data.document_files.map((file: File, index: number) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
                                        >
                                            <div className="flex items-center gap-2 w-27">
                                                <FileText className="w-4 h-4" />
                                                <span className="truncate">{file.name}</span>
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end">
                            <Button type="submit" className="">
                                Create Document
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
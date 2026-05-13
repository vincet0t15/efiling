<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentFile;
use App\Models\DocumentType;
use App\Models\DocumentUpdate;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;



class DocumentController extends Controller
{
    protected function flash(string $message, string $type = 'success'): void
    {
        session()->flash('flash', ['type' => $type, 'message' => $message]);
    }

    public function index(Request $request): InertiaResponse
    {
        $query = Document::with(['documentType', 'user', 'files']);

        if ($request->has('search') && $request->search !== '') {
            $query->where(function ($q) use ($request) {
                $q->where('tracking_number', 'like', '%' . $request->search . '%')
                    ->orWhere('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('document_type_id') && $request->document_type_id !== '' && $request->document_type_id !== 'all') {
            $query->where('document_type_id', $request->document_type_id);
        }

        $data = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('documents/index', [
            'data' => $data,
            'filters' => [
                'search' => $request->search ?? '',
                'document_type_id' => $request->document_type_id ?? 'all',
            ],
            'documentTypes' => DocumentType::orderBy('name')->get(),
        ]);
    }

    public function create(Request $request): InertiaResponse
    {
        return Inertia::render('documents/create', [
            'documentTypes' => DocumentType::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'document_type_id' => 'required|exists:document_types,id',
            'files' => 'required|array|min:1',
            'files.*' => 'file|max:10240|mimes:pdf,jpg,jpeg,png,doc,docx',
        ]);

        // Create document with tracking number
        $document = Document::create([
            'tracking_number' => Document::generateTrackingNumber(),
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'document_type_id' => $validated['document_type_id'],
            'user_id' => $request->user()->id,
        ]);

        // Handle file uploads
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filename = $file->getClientOriginalName();
                $storedFilename = uniqid() . '_' . $filename;
                $path = $file->storeAs('documents', $storedFilename, 'local');

                DocumentFile::create([
                    'document_id' => $document->id,
                    'original_filename' => $filename,
                    'stored_filename' => $storedFilename,
                    'file_path' => $path,
                    'file_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        return redirect()->back()->with('success', 'Document created successfully.');
    }

    public function show(Document $document)
    {
        $document->load(['documentType', 'user', 'files', 'updates.files', 'updates.user']);

        return Inertia::render('documents/show', [
            'document' => $document,
        ]);
    }

    public function edit(Document $document): InertiaResponse
    {
        return Inertia::render('documents/edit', [
            'document' => $document->load(['documentType', 'files']),
            'documentTypes' => DocumentType::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'document_type_id' => 'required|exists:document_types,id',
        ]);

        $document->update($validated);

        return back()->with('success', 'Document updated successfully.');
    }

    public function updateDocument(Request $request, Document $document)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'files' => 'nullable|array|min:1',
            'files.*' => 'file|max:10240|mimes:pdf,jpg,jpeg,png,doc,docx',
        ]);

        // Create update record
        $update = DocumentUpdate::create([
            'document_id' => $document->id,
            'description' => $validated['description'],
            'user_id' => $request->user()->id,
        ]);

        // Handle new file uploads
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filename = $file->getClientOriginalName();
                $storedFilename = uniqid() . '_' . $filename;
                $path = $file->storeAs('documents', $storedFilename, 'local');

                DocumentFile::create([
                    'document_id' => $document->id,
                    'original_filename' => $filename,
                    'stored_filename' => $storedFilename,
                    'file_path' => $path,
                    'file_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        return back()->with('success', 'Document update added successfully.');
    }

    public function destroy(Document $document)
    {
        // Delete associated files from storage
        foreach ($document->files as $file) {
            Storage::disk('local')->delete($file->file_path);
        }

        $document->delete();

        return back()->with('success', 'Document deleted successfully.');
    }

    public function downloadFile(DocumentFile $file)
    {
        return Storage::disk('local')->download($file->file_path, $file->original_filename);
    }

    public function viewFile(DocumentFile $file)
    {
        return Storage::disk('local')->response($file->file_path, $file->original_filename);
    }

    public function deleteFile(DocumentFile $file)
    {
        // Delete file from storage
        Storage::disk('local')->delete($file->file_path);
        
        // Delete from database
        $file->delete();
        
        $this->flash('File deleted successfully.');
        
        return back();
    }
}

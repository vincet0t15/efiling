<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Response as InertiaResponse;

class DocumentTypeController extends Controller
{
    protected function flash(string $message, string $type = 'success'): void
    {
        session()->flash('flash', ['type' => $type, 'message' => $message]);
    }

    public function index(Request $request): InertiaResponse
    {
        $query = DocumentType::query();

        if ($request->has('search') && $request->search !== '') {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $data = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('document-types/index', [
            'data' => $data,
            'filters' => [
                'search' => $request->search ?? '',
            ],
        ]);
    }

    public function store(Request $request): Response
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:document_types,name',
            'description' => 'nullable|string',
        ]);

        DocumentType::create($validated);

        $this->flash('Document type created successfully.');

        return back();
    }

    public function update(Request $request, DocumentType $documentType): Response
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:document_types,name,' . $documentType->id,
            'description' => 'nullable|string',
        ]);

        $documentType->update($validated);

        $this->flash('Document type updated successfully.');

        return back();
    }

    public function destroy(DocumentType $documentType): Response
    {
        if ($documentType->documents()->exists()) {
            $this->flash('Cannot delete document type that has associated documents.', 'error');
            return back();
        }

        $documentType->delete();

        $this->flash('Document type deleted successfully.');

        return back();
    }
}
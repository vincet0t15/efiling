<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:document_types,name',
            'description' => 'nullable|string',
        ]);

        DocumentType::create($validated);

        return back()->with('success', 'Document type created successfully.');
    }

    public function update(Request $request, DocumentType $documentType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:document_types,name,' . $documentType->id,
            'description' => 'nullable|string',
        ]);

        $documentType->update($validated);

        return back()->with('success', 'Document type updated successfully.');
    }

    public function destroy(DocumentType $documentType)
    {
        if ($documentType->documents()->exists()) {
            $this->flash('Cannot delete document type that has associated documents.', 'error');
            return back();
        }

        $documentType->delete();

        return back()->with('success', 'Document type deleted successfully.');
    }
}

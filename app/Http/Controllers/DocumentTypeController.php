<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentTypeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $documentTypes = DocumentType::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('systemSettings/DocumentTypes/index', [
            'documentTypesList' => $documentTypes,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:document_types,name',
            'code' => 'required|string|max:255|unique:document_types,code',
        ]);

        DocumentType::create($request->only('name', 'code'));

        return redirect()->back()->with('success', 'Document Type created successfully.');
    }

    public function update(Request $request, DocumentType $documentType)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:document_types,name,' . $documentType->id,
            'code' => 'required|string|max:255|unique:document_types,code,' . $documentType->id,
        ]);

        $documentType->update($request->only('name', 'code'));

        return redirect()->back()->with('success', 'Document Type updated successfully.');
    }

    public function destroy(DocumentType $documentType)
    {
        $documentType->delete();

        return redirect()->back()->with('success', 'Document Type deleted successfully.');
    }
}

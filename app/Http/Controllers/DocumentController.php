<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $documents = Document::with(['documentType', 'officeReceiver'])
            ->where('title', 'like', "%$search%")
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Documents/index', [
            'documentList' => $documents,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'title' => 'required|string|max:255|unique:documents,title',
            'description' => 'nullable|string',
            'office_receiver_id' => 'required|exists:offices,id',
        ]);

        Document::create($request->all());

        return redirect()->back()->with('success', 'Document created successfully.');
    }

    public function update(Request $request, Document $document)
    {
        $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'title' => 'required|string|max:255|unique:documents,title,' . $document->id,
            'description' => 'nullable|string',
            'office_receiver_id' => 'required|exists:offices,id',
        ]);

        $document->update($request->all());

        return redirect()->back()->with('success', 'Document updated successfully.');
    }

    public function destroy(Request $request, Document $document)
    {
        $document->delete();

        return redirect()->back()->with('success', 'Document deleted successfully.');
    }

    public function create(Request $request)
    {
        $documentTypes = DocumentType::all();

        return Inertia::render('Documents/create', [
            'documentTypes' => $documentTypes,

        ]);
    }
}

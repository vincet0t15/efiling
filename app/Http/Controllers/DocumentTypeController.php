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
}

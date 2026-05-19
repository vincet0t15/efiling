<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DashboardController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $documentCounts = Document::select('document_type_id')
            ->selectRaw('COUNT(*) as count')
            ->with('documentType:id,name')
            ->groupBy('document_type_id')
            ->get()
            ->map(fn ($item) => [
                'document_type_id' => $item->document_type_id,
                'name' => $item->documentType?->name ?? 'Unknown',
                'count' => $item->count,
            ]);

        $total = $documentCounts->sum('count');

        $recentDocuments = Document::with(['documentType'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($doc) => [
                'id' => $doc->id,
                'title' => $doc->title,
                'tracking_number' => $doc->tracking_number,
                'created_at' => $doc->created_at->toIso8601String(),
                'document_type' => $doc->documentType ? [
                    'name' => $doc->documentType->name,
                ] : null,
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'total' => $total,
                'documentTypes' => $documentCounts,
            ],
            'recentDocuments' => $recentDocuments,
        ]);
    }
}
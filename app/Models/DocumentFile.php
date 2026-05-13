<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id',
        'original_filename',
        'stored_filename',
        'file_path',
        'file_type',
        'file_size',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
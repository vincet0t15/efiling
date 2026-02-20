<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentFile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'document_id',
        'extension_name',
        'path',
        'file_size',
        'original_name',
        'date_created',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}

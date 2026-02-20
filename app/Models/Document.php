<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'document_type_id',
        'title',
        'description',
        'office_receiver_id',
    ];

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function officeReceiver()
    {
        return $this->belongsTo(Office::class, 'office_receiver_id');
    }

    public function documentFiles()
    {
        return $this->hasMany(DocumentFile::class);
    }

    protected static function booted()
    {
        static::creating(function ($document) {
            if (Auth::check()) {
                $document->office_receiver_id = Auth::user()->office_id;
            }
        });
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_number',
        'title',
        'description',
        'document_type_id',
        'user_id',
    ];

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(DocumentFile::class);
    }

    public function updates(): HasMany
    {
        return $this->hasMany(DocumentUpdate::class);
    }

    /**
     * Generate a unique tracking number
     */
    public static function generateTrackingNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "EF-{$date}-";

        $lastDocument = self::where('tracking_number', 'like', $prefix . '%')
            ->orderBy('tracking_number', 'desc')
            ->first();

        if ($lastDocument) {
            $lastNumber = (int) substr($lastDocument->tracking_number, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }
}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_type_id')->constrained('document_types');
            $table->text('title');
            $table->text('description')->nullable();
            $table->foreignId('office_receiver_id')->constrained('offices')->cascadeOnDelete();
            $table->softDeletes();
            $table->timestamps();

            $table->index('document_type_id');
            $table->index('office_receiver_id');
            $table->fullText(['title', 'description']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};

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
        Schema::table('document_files', function (Blueprint $table) {
            $table->foreignId('document_update_id')->nullable()->constrained('document_updates')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_files', function (Blueprint $table) {
            $table->dropForeign(['document_update_id']);
            $table->dropColumn('document_update_id');
        });
    }
};

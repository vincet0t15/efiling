<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Document Types
    Route::resource('document-types', \App\Http\Controllers\DocumentTypeController::class);

    // Documents
    Route::resource('documents', \App\Http\Controllers\DocumentController::class);
    Route::post('documents/{document}/update-document', \App\Http\Controllers\DocumentController::class . '@updateDocument')->name('documents.update-document');
    Route::get('documents/files/{file}/download', \App\Http\Controllers\DocumentController::class . '@downloadFile')->name('documents.download-file');
    Route::get('documents/files/{file}/view', \App\Http\Controllers\DocumentController::class . '@viewFile')->name('documents.view-file');
    Route::delete('documents/files/{file}/delete', \App\Http\Controllers\DocumentController::class . '@deleteFile')->name('documents.delete-file');
});

require __DIR__.'/settings.php';

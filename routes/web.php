<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Controllers\OfficeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    //   Route::get('dashboard', DashboardController::class)->name('dashboard');


    //OFFICES
    Route::get('offices', [OfficeController::class, 'index'])->name('offices.index');
    Route::post('offices', [OfficeController::class, 'store'])->name('offices.store');
    Route::put('offices/{office}', [OfficeController::class, 'update'])->name('offices.update');
    Route::delete('offices/{office}', [OfficeController::class, 'destroy'])->name('offices.destroy');

    //DOCUMENT TYPES
    Route::get('document-types', [DocumentTypeController::class, 'index'])->name('document-types.index');
    Route::post('document-types', [DocumentTypeController::class, 'store'])->name('document-types.store');
    Route::put('document-types/{documentType}', [DocumentTypeController::class, 'update'])->name('document-types.update');
    Route::delete('document-types/{documentType}', [DocumentTypeController::class, 'destroy'])->name('document-types.destroy');

    //DOCUMENTS
    Route::get('documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::put('documents/{document}', [DocumentController::class, 'update'])->name('documents.update');
    Route::delete('documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');
    Route::get('documents/create', [DocumentController::class, 'create'])->name('documents.create');
});

require __DIR__ . '/settings.php';

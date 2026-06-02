<?php

use App\Http\Controllers\SaleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('sales/{id}/print', [SaleController::class, 'print'])->name('sales.print');
    Route::resource('sales', SaleController::class)->only(['index', 'store']);
});

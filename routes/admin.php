<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReceivingController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReturnItemController;
use App\Http\Controllers\StockOpnameController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StockMovementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/master-products', [ProductController::class, 'master'])->name('master-products.index');
    Route::resource('products', ProductController::class)->except(['show']);
    Route::resource('suppliers', SupplierController::class)->except(['show']);
    Route::resource('users', UserController::class)->except(['show']);

    Route::resource('receivings', ReceivingController::class)->only(['index', 'store']);
    Route::resource('returns', ReturnItemController::class)->only(['index', 'store']);
    Route::resource('stock-opnames', StockOpnameController::class)->only(['index', 'store']);
    Route::get('/stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');

    Route::get('/report/print', [ReportController::class, 'print'])->name('report.print');
    Route::get('/report', [ReportController::class, 'index'])->name('report.index');
});

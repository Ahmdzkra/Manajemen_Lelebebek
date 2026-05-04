<?php

namespace App\Http\Controllers;

use App\Actions\Inventory\RecordStockOpnameAction;
use App\Http\Requests\StockOpname\StoreStockOpnameRequest;
use App\Models\Product;
use App\Models\StockOpname;
use Inertia\Inertia;

class StockOpnameController extends Controller
{
    public function index()
    {
        return Inertia::render('StockOpnames/Index', [
            'products' => Product::orderBy('name')->get(),
            'opnames' => StockOpname::with('product')
                ->latest()
                ->paginate(10),
        ]);
    }

    public function store(StoreStockOpnameRequest $request, RecordStockOpnameAction $recordStockOpname)
    {
        $recordStockOpname->handle($request->validated());

        return redirect()
            ->route('stock-opnames.index')
            ->with('success', 'Stock opname berhasil disimpan.');
    }
}

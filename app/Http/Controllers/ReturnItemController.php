<?php

namespace App\Http\Controllers;

use App\Actions\Inventory\RecordReturnAction;
use App\Http\Requests\ReturnItem\StoreReturnItemRequest;
use App\Models\Product;
use App\Models\ReturnItem;
use App\Models\Supplier;
use Inertia\Inertia;

class ReturnItemController extends Controller
{
    public function index()
    {
        return Inertia::render('Returns/Index', [
            'products' => Product::orderBy('name')->get(),
            'suppliers' => Supplier::orderBy('name')->get(),
            'returns' => ReturnItem::with('product', 'supplier')
                ->latest()
                ->paginate(10),
        ]);
    }

    public function store(StoreReturnItemRequest $request, RecordReturnAction $recordReturn)
    {
        $recordReturn->handle($request->validated());

        return redirect()
            ->route('returns.index')
            ->with('success', 'Retur barang berhasil disimpan.');
    }
}

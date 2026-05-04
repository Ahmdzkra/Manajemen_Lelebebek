<?php

namespace App\Http\Controllers;

use App\Actions\Inventory\RecordReceivingAction;
use App\Http\Requests\Receiving\StoreReceivingRequest;
use App\Models\Product;
use App\Models\Receiving;
use App\Models\Supplier;
use Inertia\Inertia;

class ReceivingController extends Controller
{
    public function index()
    {
        return Inertia::render('Receivings/Index', [
            'products' => Product::orderBy('name')->get(),
            'suppliers' => Supplier::orderBy('name')->get(),
            'receivings' => Receiving::with('product', 'supplier')
                ->latest()
                ->paginate(10),
        ]);
    }

    public function store(StoreReceivingRequest $request, RecordReceivingAction $recordReceiving)
    {
        $recordReceiving->handle($request->validated());

        return redirect()
            ->route('receivings.index')
            ->with('success', 'Penerimaan barang berhasil disimpan.');
    }
}

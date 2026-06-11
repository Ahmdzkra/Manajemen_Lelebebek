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
    public function index(\Illuminate\Http\Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = ReturnItem::with('product', 'supplier')->latest();

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        return Inertia::render('Returns/Index', [
            'products' => Product::orderBy('name')->get(),
            'suppliers' => Supplier::orderBy('name')->get(),
            'returns' => $query->paginate(10)->withQueryString(),
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
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

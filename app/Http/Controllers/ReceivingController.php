<?php

namespace App\Http\Controllers;

use App\Actions\Inventory\RecordReceivingAction;
use App\Http\Requests\Receiving\StoreReceivingRequest;
use App\Models\Product;
use App\Models\Receiving;
use App\Models\Supplier;
use Inertia\Inertia;

use Illuminate\Http\Request;

class ReceivingController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = Receiving::with('product', 'supplier')->latest();

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        return Inertia::render('Receivings/Index', [
            'products' => Product::with('latestReceiving')->orderBy('name')->get(),
            'suppliers' => Supplier::orderBy('name')->get(),
            'receivings' => $query->paginate(10)->withQueryString(),
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
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

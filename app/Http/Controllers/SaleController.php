<?php

namespace App\Http\Controllers;

use App\Actions\Inventory\RecordTransactionAction;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $products = Product::with('category')
            ->where('stock', '>', 0)
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            })
            ->orderBy('name')
            ->limit(50)
            ->get();

        return Inertia::render('Sales/Index', [
            'products' => $products,
            'recentTransactions' => Transaction::with('user')->latest()->take(10)->get(),
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request, RecordTransactionAction $recordTransaction)
    {
        $recordTransaction->handle($request->all());

        return redirect()
            ->route('sales.index')
            ->with('success', 'Transaksi berhasil disimpan.');
    }

    public function print(Transaction $transaction)
    {
        $transaction->load(['user', 'details.product']);

        return Inertia::render('Sales/Print', [
            'transaction' => $transaction,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Actions\Inventory\RecordTransactionAction;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\Sale;
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
        $transaction = $recordTransaction->handle($request->all());

        return redirect()
            ->route('sales.index')
            ->with('success', 'Transaksi berhasil disimpan.')
            ->with('print_id', $transaction->id);
    }

    public function print($id)
    {
        $transaction = Transaction::with(['user', 'details.product'])->find($id);

        if (!$transaction) {
            $sale = Sale::with('product')->find($id);
            return Inertia::render('Sales/Print', [
                'sale' => $sale,
            ]);
        }

        return Inertia::render('Sales/Print', [
            'transaction' => $transaction,
        ]);
    }
}

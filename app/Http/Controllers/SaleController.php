<?php

namespace App\Http\Controllers;

use App\Actions\Inventory\RecordTransactionAction;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\Sale;
use Carbon\Carbon;
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
        $request->validate([
            'transfer_proof' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
        ], [
            'transfer_proof.mimes' => 'Bukti transfer harus berformat JPG, JPEG, atau PNG.',
            'transfer_proof.max' => 'Ukuran file maksimal 5MB.',
        ]);

        $transaction = $recordTransaction->handle($request->all());

        return redirect()
            ->route('sales.index')
            ->with('success', 'Transaksi berhasil disimpan.')
            ->with('print_id', $transaction->id);
    }

    public function history(Request $request)
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'product_id' => ['nullable', 'integer'],
            'payment_method' => ['nullable', 'string', 'in:all,cash,transfer'],
            'search' => ['nullable', 'string'],
        ]);

        $startDate = isset($validated['start_date'])
            ? Carbon::parse($validated['start_date'])->startOfDay()
            : now()->startOfMonth();

        $endDate = isset($validated['end_date'])
            ? Carbon::parse($validated['end_date'])->endOfDay()
            : now()->endOfDay();

        $productId = $validated['product_id'] ?? null;
        $paymentMethod = $validated['payment_method'] ?? 'all';
        $search = $validated['search'] ?? null;

        $query = Transaction::with(['user', 'details.product'])
            ->whereBetween('created_at', [$startDate, $endDate]);

        if ($paymentMethod && $paymentMethod !== 'all') {
            $query->where('payment_method', $paymentMethod);
        }

        if ($productId) {
            $query->whereHas('details', function ($q) use ($productId) {
                $q->where('product_id', $productId);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_no', 'like', '%' . $search . '%')
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', '%' . $search . '%');
                  });
            });
        }

        $transactions = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Sales/History', [
            'transactions' => $transactions,
            'filters' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'product_id' => $productId,
                'payment_method' => $paymentMethod,
                'search' => $search,
            ],
            'products' => Product::orderBy('name')->get(['id', 'name']),
        ]);
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

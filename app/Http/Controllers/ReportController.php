<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Receiving;
use App\Models\ReturnItem;
use App\Models\Sale;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Reports/Index', $this->reportData($request));
    }

    public function print(Request $request)
    {
        return Inertia::render('Reports/Print', $this->reportData($request));
    }

    private function reportData(Request $request): array
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'product_id' => ['nullable', 'integer'],
            'payment_method' => ['nullable', 'string', 'in:all,cash,transfer'],
        ]);

        $startDate = isset($validated['start_date'])
            ? Carbon::parse($validated['start_date'])->startOfDay()
            : now()->startOfMonth();

        $endDate = isset($validated['end_date'])
            ? Carbon::parse($validated['end_date'])->endOfDay()
            : now()->endOfDay();

        $productId = $validated['product_id'] ?? null;
        $paymentMethod = $validated['payment_method'] ?? 'all';

        // 1. Query TransactionDetail records
        $transactionDetailsQuery = TransactionDetail::with(['transaction', 'product'])
            ->whereHas('transaction', function ($q) use ($startDate, $endDate, $paymentMethod) {
                $q->whereBetween('created_at', [$startDate, $endDate]);
                if ($paymentMethod && $paymentMethod !== 'all') {
                    $q->where('payment_method', $paymentMethod);
                }
            });

        if ($productId) {
            $transactionDetailsQuery->where('product_id', $productId);
        }

        $transactionDetails = $transactionDetailsQuery->get();

        // 2. Query Sale records (only if payment_method is all or cash)
        $sales = collect();
        if ($paymentMethod === 'all' || $paymentMethod === 'cash') {
            $salesQuery = Sale::with('product')
                ->whereBetween('created_at', [$startDate, $endDate]);

            if ($productId) {
                $salesQuery->where('product_id', $productId);
            }

            $sales = $salesQuery->get();
        }

        // 3. Map TransactionDetail to unified structure
        $mappedTransactions = $transactionDetails->map(function ($d) {
            $costPrice = $d->cost_price;
            if (!$costPrice && $d->product) {
                $lastReceiving = $d->product->receivings()->latest()->first();
                $costPrice = $lastReceiving ? $lastReceiving->cost_price : 0;
            }
            return [
                'id' => 'TD-' . $d->id,
                'invoice_no' => $d->transaction?->invoice_no ?? '-',
                'created_at' => $d->transaction?->created_at ? $d->transaction->created_at->toDateTimeString() : null,
                'product_id' => $d->product_id,
                'product_name' => $d->product?->name ?? 'Produk Dihapus',
                'product' => $d->product,
                'qty' => (int) $d->qty,
                'price' => (float) $d->selling_price,
                'total' => (float) $d->subtotal,
                'payment_method' => $d->transaction?->payment_method ?? 'cash',
                'transfer_proof' => $d->transaction?->transfer_proof ? asset('storage/' . $d->transaction->transfer_proof) : null,
                'cost_price' => (float) $costPrice,
                'profit' => (float) ($d->subtotal - ($costPrice * $d->qty)),
            ];
        });

        // 4. Map Sale to unified structure
        $mappedSales = $sales->map(function ($s) {
            $costPrice = 0;
            if ($s->product) {
                $lastReceiving = $s->product->receivings()->latest()->first();
                $costPrice = $lastReceiving ? $lastReceiving->cost_price : 0;
            }
            return [
                'id' => 'S-' . $s->id,
                'invoice_no' => 'S-' . $s->id,
                'created_at' => $s->created_at ? $s->created_at->toDateTimeString() : null,
                'product_id' => $s->product_id,
                'product_name' => $s->product?->name ?? 'Produk Dihapus',
                'product' => $s->product,
                'qty' => (int) $s->qty,
                'price' => (float) $s->price,
                'total' => (float) $s->total,
                'payment_method' => 'cash',
                'transfer_proof' => null,
                'cost_price' => (float) $costPrice,
                'profit' => (float) ($s->total - ($costPrice * $s->qty)),
            ];
        });

        // 5. Merge and sort
        $mergedSales = $mappedTransactions->concat($mappedSales)->sortByDesc('created_at')->values();

        // 6. Summary metrics
        $salesTotal = $mergedSales->sum('total');
        $salesQty = $mergedSales->sum('qty');
        $salesCount = $mergedSales->unique('invoice_no')->count();
        $profitTotal = $mergedSales->sum('profit');

        // 7. Top Products calculation
        $topProducts = $mergedSales->groupBy('product_id')->map(function ($items, $productId) {
            $firstItem = $items->first();
            return [
                'product_id' => $productId,
                'product_name' => $firstItem['product_name'],
                'total_qty' => $items->sum('qty'),
                'total_sales' => $items->sum('total'),
            ];
        })->sortByDesc('total_sales')->take(10)->values();

        // 8. Pagination
        $page = $request->input('page', 1);
        $perPage = 10;
        $paginatedSales = new \Illuminate\Pagination\LengthAwarePaginator(
            $mergedSales->forPage($page, $perPage)->values(),
            $mergedSales->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return [
            'filters' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'product_id' => $productId,
                'payment_method' => $paymentMethod,
            ],
            'summary' => [
                'sales_total' => $salesTotal,
                'sales_qty' => $salesQty,
                'sales_count' => $salesCount,
                'profit' => $profitTotal,
            ],
            'topProducts' => $topProducts,
            'latestSales' => $paginatedSales,
            'products' => Product::orderBy('name')->get(['id', 'name']),
        ];
    }
}

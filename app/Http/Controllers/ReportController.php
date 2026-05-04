<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Receiving;
use App\Models\ReturnItem;
use App\Models\Sale;
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
        ]);

        $startDate = isset($validated['start_date'])
            ? Carbon::parse($validated['start_date'])->startOfDay()
            : now()->startOfMonth();

        $endDate = isset($validated['end_date'])
            ? Carbon::parse($validated['end_date'])->endOfDay()
            : now()->endOfDay();

        $dateStart = $startDate->toDateString();
        $dateEnd = $endDate->toDateString();

        $salesQuery = Sale::whereBetween('created_at', [$startDate, $endDate]);
        $receivingQuery = Receiving::whereBetween('date', [$dateStart, $dateEnd]);
        $returnQuery = ReturnItem::whereBetween('date', [$dateStart, $dateEnd]);

        $salesTotal = (clone $salesQuery)->sum('total');
        $receivingTotal = (clone $receivingQuery)->sum('total');

        return [
            'filters' => [
                'start_date' => $dateStart,
                'end_date' => $dateEnd,
            ],
            'summary' => [
                'sales_total' => $salesTotal,
                'sales_qty' => (clone $salesQuery)->sum('qty'),
                'sales_count' => (clone $salesQuery)->count(),
                'receiving_total' => $receivingTotal,
                'receiving_qty' => (clone $receivingQuery)->sum('qty'),
                'receiving_count' => (clone $receivingQuery)->count(),
                'return_qty' => (clone $returnQuery)->sum('qty'),
                'return_count' => (clone $returnQuery)->count(),
                'net_cash' => $salesTotal - $receivingTotal,
                'product_count' => Product::count(),
                'current_stock' => Product::sum('stock'),
                'low_stock' => Product::where('stock', '<=', 700)->count(),
            ],
            'topProducts' => Sale::query()
                ->join('products', 'sales.product_id', '=', 'products.id')
                ->whereBetween('sales.created_at', [$startDate, $endDate])
                ->selectRaw('products.id as product_id, products.name as product_name, SUM(sales.qty) as total_qty, SUM(sales.total) as total_sales')
                ->groupBy('products.id', 'products.name')
                ->orderByDesc('total_sales')
                ->limit(10)
                ->get(),
            'supplierPurchases' => Receiving::query()
                ->join('suppliers', 'receivings.supplier_id', '=', 'suppliers.id')
                ->whereBetween('receivings.date', [$dateStart, $dateEnd])
                ->selectRaw('suppliers.id as supplier_id, suppliers.name as supplier_name, SUM(receivings.qty) as total_qty, SUM(receivings.total) as total_purchase')
                ->groupBy('suppliers.id', 'suppliers.name')
                ->orderByDesc('total_purchase')
                ->limit(10)
                ->get(),
            'returnsByProduct' => ReturnItem::query()
                ->join('products', 'return_items.product_id', '=', 'products.id')
                ->whereBetween('return_items.date', [$dateStart, $dateEnd])
                ->selectRaw('products.id as product_id, products.name as product_name, SUM(return_items.qty) as total_qty, COUNT(return_items.id) as total_cases')
                ->groupBy('products.id', 'products.name')
                ->orderByDesc('total_qty')
                ->limit(10)
                ->get(),
            'stockProducts' => Product::query()
                ->orderBy('stock', 'asc')
                ->limit(15)
                ->get(['id', 'name', 'stock', 'price']),
            'latestSales' => Sale::with('product')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->latest()
                ->paginate(10)
                ->withQueryString(),
        ];
    }
}

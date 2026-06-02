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

        $salesTotal = (clone $salesQuery)->sum('total');

        // Calculate profit dynamically by fetching sales with their products and their latest receiving cost price
        $salesWithProduct = (clone $salesQuery)->with(['product' => function ($q) {
            $q->withTrashed()->with('latestReceiving');
        }])->get();

        $profitTotal = $salesWithProduct->sum(function ($sale) {
            $costPrice = $sale->product && $sale->product->latestReceiving
                ? $sale->product->latestReceiving->cost_price
                : 0;
            return $sale->total - ($costPrice * $sale->qty);
        });

        return [
            'filters' => [
                'start_date' => $dateStart,
                'end_date' => $dateEnd,
            ],
            'summary' => [
                'sales_total' => $salesTotal,
                'sales_qty' => (clone $salesQuery)->sum('qty'),
                'sales_count' => (clone $salesQuery)->count(),
                'profit' => $profitTotal,
            ],
            'topProducts' => Sale::query()
                ->join('products', 'sales.product_id', '=', 'products.id')
                ->whereBetween('sales.created_at', [$startDate, $endDate])
                ->selectRaw('products.id as product_id, products.name as product_name, SUM(sales.qty) as total_qty, SUM(sales.total) as total_sales')
                ->groupBy('products.id', 'products.name')
                ->orderByDesc('total_sales')
                ->limit(10)
                ->get(),
            'latestSales' => Sale::with('product')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->latest()
                ->paginate(10)
                ->withQueryString(),
        ];
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Receiving;
use App\Models\ReturnItem;
use App\Models\Sale;
use App\Models\StockOpname;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $period = $request->get('period', '7days');

        return Inertia::render('Dashboard', [
            'role' => $user?->role,
            'stats' => $this->getStats(),
            'latestSales' => $this->getLatestSales(),
            'latestReturns' => ReturnItem::with('product', 'supplier')->latest()->take(5)->get(),
            'latestOpname' => StockOpname::with('product')->latest()->first(),
            'chartData' => $this->getChartData($period),
            'currentPeriod' => $period,
        ]);
    }

    private function getStats()
    {
        return [
            'products' => Product::count(),
            'suppliers' => Supplier::count(),
            'users' => User::count(),
            'sales_today' => (float) (Sale::whereDate('created_at', today())->sum('total') + Transaction::whereDate('created_at', today())->sum('total')),
            'receiving_today' => (float) Receiving::whereDate('created_at', today())->sum('total'),
            'returns' => ReturnItem::count(),
            'low_stock' => Product::where('stock', '<', 500)->count(),
            'low_stock_products' => Product::where('stock', '<', 500)->orderBy('stock', 'asc')->get(),
        ];
    }

    private function getLatestSales()
    {
        return collect()
            ->concat(Transaction::latest()->take(5)->get()->map(fn($t) => [
                'id' => 'T'.$t->id,
                'name' => $t->invoice_no,
                'qty' => (int) $t->details()->sum('qty'),
                'total' => (float) $t->total,
                'created_at' => $t->created_at
            ]))
            ->concat(Sale::with('product')->latest()->take(5)->get()->map(fn($s) => [
                'id' => 'S'.$s->id,
                'name' => $s->product?->name ?? 'Produk',
                'qty' => (int) $s->qty,
                'total' => (float) $s->total,
                'created_at' => $s->created_at
            ]))
            ->sortByDesc('created_at')
            ->take(5)
            ->values();
    }

    private function getChartData(string $period): array
    {
        return match ($period) {
            '7days'   => $this->getDailyData(7),
            '14days'  => $this->getDailyData(14),
            '30days'  => $this->getDailyData(30),
            'weekly'  => $this->getWeeklyData(),
            'monthly' => $this->getMonthlyData(),
            'yearly'  => $this->getYearlyData(),
            default   => str_starts_with($period, 'day_')
                ? $this->getDayOfWeekData((int) str_replace('day_', '', $period))
                : $this->getDailyData(7),
        };
    }

    private function getDailyData(int $days): array
    {
        return collect(range($days - 1, 0))->map(function ($d) {
            $date = now()->subDays($d);
            $dateStr = $date->toDateString();
            return [
                'date' => $date->translatedFormat('d M'),
                'sales' => (float) (
                    Transaction::whereDate('created_at', $dateStr)->sum('total')
                    + Sale::whereDate('created_at', $dateStr)->sum('total')
                ),
            ];
        })->values()->toArray();
    }

    private function getWeeklyData(): array
    {
        return collect(range(7, 0))->map(function ($w) {
            $start = now()->subWeeks($w)->startOfWeek();
            $end = now()->subWeeks($w)->endOfWeek();
            return [
                'date' => $start->translatedFormat('d M'),
                'sales' => (float) (
                    Transaction::whereBetween('created_at', [$start, $end])->sum('total')
                    + Sale::whereBetween('created_at', [$start, $end])->sum('total')
                ),
            ];
        })->values()->toArray();
    }

    private function getMonthlyData(): array
    {
        return collect(range(11, 0))->map(function ($m) {
            $date = now()->subMonths($m);
            return [
                'date' => $date->translatedFormat('M Y'),
                'sales' => (float) (
                    Transaction::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->sum('total')
                    + Sale::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->sum('total')
                ),
            ];
        })->values()->toArray();
    }

    private function getYearlyData(): array
    {
        return collect(range(4, 0))->map(function ($y) {
            $year = now()->subYears($y)->year;
            return [
                'date' => (string) $year,
                'sales' => (float) (
                    Transaction::whereYear('created_at', $year)->sum('total')
                    + Sale::whereYear('created_at', $year)->sum('total')
                ),
            ];
        })->values()->toArray();
    }

    private function getDayOfWeekData(int $dayOfWeek): array
    {
        // Collect all occurrences of the given day in the last 8 weeks
        return collect(range(7, 0))->map(function ($w) use ($dayOfWeek) {
            $date = now()->subWeeks($w)->startOfWeek()->addDays($dayOfWeek);
            if ($date->isFuture()) return null;
            $dateStr = $date->toDateString();
            return [
                'date' => $date->translatedFormat('d M'),
                'sales' => (float) (
                    Transaction::whereDate('created_at', $dateStr)->sum('total')
                    + Sale::whereDate('created_at', $dateStr)->sum('total')
                ),
            ];
        })->filter()->values()->toArray();
    }
}

